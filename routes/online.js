const express = require('express');
const { OnlineUser, ActivityLog, User } = require('../models');
const { isAuthenticated } = require('../middleware/auth'); // Your existing auth middleware
const { Op } = require('sequelize');

const router = express.Router();

// Get all online users
router.get('/users', isAuthenticated, async (req, res) => {
  try {
    const onlineUsers = await OnlineUser.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: [ 'uuid', 'email', 'firstName', 'lastName', 'role']
      }],
      order: [['lastActivity', 'DESC']]
    });

    res.json({
      success: true,
      data: onlineUsers,
      total: onlineUsers.length
    });
  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch online users'
    });
  }
});

// Get user activity logs
router.get('/activity', isAuthenticated, async (req, res) => {
  try {
    const {
      userId,
      action,
      resource,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const where = {};
    
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (resource) where.resource = resource;
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await ActivityLog.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: [ 'uuid', 'email', 'firstName', 'lastName', 'role']
      }],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity logs'
    });
  }
});

// Get user activity summary
router.get('/activity/summary', isAuthenticated, async (req, res) => {
  try {
    const { userId, days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where = {
      timestamp: {
        [Op.gte]: startDate
      }
    };

    if (userId) where.userId = userId;

    const activities = await ActivityLog.findAll({
      where,
      attributes: ['action', 'resource', 'timestamp', 'userId'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'role']
      }],
      order: [['timestamp', 'DESC']]
    });

    // Group by action
    const actionSummary = activities.reduce((acc, activity) => {
      if (!acc[activity.action]) {
        acc[activity.action] = 0;
      }
      acc[activity.action]++;
      return acc;
    }, {});

    // Group by user
    const userSummary = activities.reduce((acc, activity) => {
      const userId = activity.userId;
      if (!acc[userId]) {
        acc[userId] = {
          user: activity.user,
          count: 0,
          actions: {}
        };
      }
      acc[userId].count++;
      
      if (!acc[userId].actions[activity.action]) {
        acc[userId].actions[activity.action] = 0;
      }
      acc[userId].actions[activity.action]++;
      
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalActivities: activities.length,
        actionSummary,
        userSummary: Object.values(userSummary),
        period: {
          days: parseInt(days),
          startDate,
          endDate: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error fetching activity summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity summary'
    });
  }
});

module.exports = router;