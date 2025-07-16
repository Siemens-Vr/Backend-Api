const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { OnlineUser, User } = require('../models');

class OnlineTracker {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws',
      verifyClient: this.verifyClient.bind(this)
    });
    
    this.clients = new Map(); // socketId -> client info
    this.setupEventHandlers();
  }

  async verifyClient(info) {
    try {
      const url = new URL(info.req.url, `http://${info.req.headers.host}`);
      const token = url.searchParams.get('token');
      
      if (!token) {
        return false;
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      info.req.user = decoded;
      return true;
    } catch (error) {
      console.error('WebSocket auth error:', error);
      return false;
    }
  }

  setupEventHandlers() {
    this.wss.on('connection', async (ws, req) => {
      try {
        const user = req.user;
        const sessionId = this.generateSessionId(user.userId);
        const socketId = this.generateSocketId();
        
        // Store client info
        this.clients.set(socketId, {
          ws,
          userId: user.userId,
          sessionId,
          socketId,
          connectedAt: new Date()
        });

        // Update database
        await this.addOnlineUser(user.userId, sessionId, socketId, req);
        
        // Send initial data
        ws.send(JSON.stringify({
          type: 'CONNECTION_SUCCESS',
          data: { sessionId, socketId }
        }));

        // Broadcast updated online users
        await this.broadcastOnlineUsers();

        // Handle messages
        ws.on('message', async (message) => {
          await this.handleMessage(socketId, message);
        });

        // Handle disconnection
        ws.on('close', async () => {
          await this.removeOnlineUser(socketId);
          this.clients.delete(socketId);
          await this.broadcastOnlineUsers();
        });

      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close();
      }
    });
  }

  async addOnlineUser(userId, sessionId, socketId, req) {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await OnlineUser.upsert({
      userId,
      sessionId,
      socketId,
      ipAddress,
      userAgent,
      status: 'online',
      lastActivity: new Date(),
      connectedAt: new Date()
    });
  }

  async removeOnlineUser(socketId) {
    await OnlineUser.destroy({
      where: { socketId }
    });
  }

  async updateUserActivity(userId, data = {}) {
    await OnlineUser.update({
      lastActivity: new Date(),
      currentPage: data.currentPage || null,
      status: data.status || 'online'
    }, {
      where: { userId }
    });
  }

  async handleMessage(socketId, message) {
    try {
      const data = JSON.parse(message);
      const client = this.clients.get(socketId);
      
      if (!client) return;

      switch (data.type) {
        case 'ACTIVITY_UPDATE':
          await this.updateUserActivity(client.userId, data.payload);
          break;
        case 'PAGE_CHANGE':
          await this.updateUserActivity(client.userId, { 
            currentPage: data.payload.page 
          });
          break;
        case 'HEARTBEAT':
          await this.updateUserActivity(client.userId);
          break;
      }
    } catch (error) {
      console.error('Message handling error:', error);
    }
  }

  async broadcastOnlineUsers() {
    try {
      const onlineUsers = await OnlineUser.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['uuid', 'email', 'firstName', 'lastName', 'role']
        }],
        order: [['lastActivity', 'DESC']]
      });

      const message = JSON.stringify({
        type: 'ONLINE_USERS_UPDATE',
        data: onlineUsers
      });

      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error('Broadcast error:', error);
    }
  }

  generateSessionId(userId) {
    return `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateSocketId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Cleanup inactive users (call this periodically)
  async cleanupInactiveUsers() {
    const timeout = 5 * 60 * 1000; // 5 minutes
    const cutoff = new Date(Date.now() - timeout);
    
    await OnlineUser.destroy({
      where: {
        lastActivity: {
          [require('sequelize').Op.lt]: cutoff
        }
      }
    });
  }
}

module.exports = OnlineTracker;
