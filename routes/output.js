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
router.post('/outputs', createOutput);
router.get('/', getAllOutputs);
router.get('/outputs/:id', getOutputById);
router.put('/outputs/:id', updateOutputById);
router.delete('/outputs/:id', deleteOutputById);

module.exports = router;
