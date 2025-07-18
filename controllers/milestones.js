const { Milestone } = require("../models"); 
const path=require('path')
const {ArchiveService} = require('../services/auditTrail')

// Create a new milestone
module.exports.createMilestone = async (req, res) => {
  const {projectId} = req.params
  try {
    const {  
      no,
      title,
      description,
      implementation_startDate,
      implementation_endDate,
      status } = req.body;

    const milestone = await Milestone.create({
      no,
      title,
      description,
      implementation_startDate,
      implementation_endDate,
      status,
      projectId
    },{
      userId:req.user.uuid
    });

    res.status(201).json({ message: "Milestone created successfully", milestone });
  } catch (error) {
    res.status(500).json({ message: "Failed to create milestone", error:error.errors[0].message });
  }
};

// Get all milestones
module.exports.getAllMilestones = async (req, res) => {
  const {projectId} = req.params
  try {
    const { data: milestones, count } = await ArchiveService.getActiveRecords(
      Milestone,
      whereClause = {projectId},
      {
        include: [ /* …eager loads… */ ],
        order: [['no', 'ASC'] ]
      }
    );
    //  Return the projects
    return res.json({ success: true, count, milestones });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch milestones", error:error.errors[0].message});
  }
};

// Get a milestone by UUID
module.exports.getMilestoneById = async (req, res) => {
  try {
    const { uuid } = req.params;

    const milestone = await Milestone.findOne({where: { uuid } });

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.status(200).json(milestone);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch milestone", error:error.errors[0].message });
  }
};

// Update a milestone by UUID
module.exports.updateMilestone = async (req, res) => {
  // console.log(req.body)
  try {
    const { uuid } = req.params;
    const {     
      no,
      title,
      description,
      implementation_startDate,
      implementation_endDate,
      status  
    } = req.body;

    const milestone = await Milestone.findOne({ where: { uuid } });

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    // Prepare update data - only include fields that are provided
    const updateData = {};
    
    if (no !== undefined) updateData.no = no;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (implementation_startDate !== undefined) updateData.implementation_startDate = implementation_startDate;
    if (implementation_endDate !== undefined) updateData.implementation_endDate = implementation_endDate;
    if (status !== undefined) updateData.status = status;
   

    await milestone.update(updateData, {   userId:req.user.uuid});

    res.status(200).json({ message: "Milestone updated successfully", milestone });
  } catch (error) {
    console.error("Error updating milestone:", error);
    
    // Better error handling
    if (error.errors && error.errors[0]) {
      res.status(500).json({ 
        message: "Failed to update milestone", 
        error: error.errors[0].message 
      });
    } else {
      res.status(500).json({ 
        message: "Failed to update milestone", 
        error: error.message || "Unknown error occurred" 
      });
    }
  }
};



module.exports.archiveMilestoneById = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;


  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.connection.remoteAddress;

  try {
    const result = await ArchiveService.archiveRecord(
      Milestone,
      id,
      req.user?.uuid,
      reason,
      { source: 'api', ip: ip }
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error archiving output:', error);
    return res.status(400).json({
      error: error.message
    });
  }
};
