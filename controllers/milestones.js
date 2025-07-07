const { Milestone } = require("../models"); 
const path=require('path')

// Create a new milestone
module.exports.createMilestone = async (req, res) => {
  const {projectId} = req.params
  try {
    const {  no,
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
    const milestones = await Milestone.findAll({
      where: { projectId },
      order: [['no', 'DESC']]
    });
    

    res.status(200).json(milestones);
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
  console.log(req.body)
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

    await milestone.update({    
      no,
      title, 
      description,
      implementation_startDate,
      implementation_endDate,
      status,
      projectId });

    res.status(200).json({ message: "Milestone updated successfully", milestone });
  } catch (error) {
    res.status(500).json({ message: "Failed to update milestone", error:error.errors[0].message });
  }
};

// Delete a milestone by UUID
module.exports.deleteMilestone = async (req, res) => {
  try {
    const { uuid } = req.params;

    const milestone = await Milestone.findOne({ where: { uuid } });

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    await milestone.destroy();

    res.status(200).json({ message: "Milestone deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete milestone", error:error.errors[0].message });
  }
};
