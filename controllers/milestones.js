const { Milestone } = require("../models"); 
const path=require('path')

// Create a new milestone
module.exports.createMilestone = async (req, res) => {
  try {
    const { name, startDate, endDate, status, projectId } = req.body;

    const milestone = await Milestone.create({
      name,
      startDate,
      endDate,
      status,
      projectId, // Ensure projectId is provided
    });

    res.status(201).json({ message: "Milestone created successfully", milestone });
  } catch (error) {
    res.status(500).json({ message: "Failed to create milestone", error: error.message });
  }
};

// Get all milestones
module.exports.getAllMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.findAll();

    res.status(200).json(milestones);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch milestones", error: error.message });
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
    res.status(500).json({ message: "Failed to fetch milestone", error: error.message });
  }
};

// Update a milestone by UUID
module.exports.updateMilestone = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, startDate, endDate, status } = req.body;

    const milestone = await Milestone.findOne({ where: { uuid } });

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    await milestone.update({ name, startDate, endDate, status });

    res.status(200).json({ message: "Milestone updated successfully", milestone });
  } catch (error) {
    res.status(500).json({ message: "Failed to update milestone", error: error.message });
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
    res.status(500).json({ message: "Failed to delete milestone", error: error.message });
  }
};
