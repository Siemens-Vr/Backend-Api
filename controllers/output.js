const { Output } = require('../models');

// Create a new Output
const createOutput = async (req, res) => {
  const {milestoneId} = req.params
  try {
    const { name, description, completionDate, statu } = req.body;
    const output = await Output.create({ name, description, completionDate, status, milestoneId });
    res.status(201).json(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Outputs
const getAllOutputs = async (req, res) => {
  try {
    const outputs = await Output.findAll();
    res.status(200).json(outputs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one Output by ID
const getOutputById = async (req, res) => {
  try {
    const { id } = req.params;
    const output = await Output.findByPk(id,);
    if (!output) {
      return res.status(404).json({ message: 'Output not found' });
    }
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Output by ID
const updateOutputById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, completionDate, status, milestoneId } = req.body;
    const output = await Output.findByPk(id);
    if (!output) {
      return res.status(404).json({ message: 'Output not found' });
    }
    await output.update({ name, description, completionDate, status, milestoneId });
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an Output by ID
const deleteOutputById = async (req, res) => {
  try {
    const { id } = req.params;
    const output = await Output.findByPk(id);
    if (!output) {
      return res.status(404).json({ message: 'Output not found' });
    }
    await output.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOutput,
  getAllOutputs,
  getOutputById,
  updateOutputById,
  deleteOutputById,
};
