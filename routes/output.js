const express = require('express');
const router = express.Router();
const {
  createOutput,
  getAllOutputs,
  getOutputById,
  updateOutputById,
  deleteOutputById,
} = require('../controllers/output');

// Define routes
router.post('/:milestoneId', createOutput);
router.get('/:milestoneId', getAllOutputs);
router.get('/:milestoneId/:id', getOutputById);
router.put('/:milestoneId/:id', updateOutputById);
router.delete('/:milestoneId/:id', deleteOutputById);

module.exports = router;
