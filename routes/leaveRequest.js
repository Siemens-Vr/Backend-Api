const express = require('express');
const router = express.Router();

const { 
    createLeaveRequest, 
    getLeaveRequest, 
    updateLeaveRequest, 
    deleteLeaveRequest 
} = require("../controllers/leaveRequest");

// Create a new leave request
router.post('/:userId/:leaveId/create', createLeaveRequest);

 
// Get a specific leave request by ID
router.get('/:userId/:leaveId/:reqId', getLeaveRequest);

// Update a leave request by ID
router.patch('/:userId/:leaveId/:reqId/update', updateLeaveRequest);

// Delete a leave request by ID
router.delete('/:userId/:leaveId/:reqId/delete', deleteLeaveRequest);

module.exports = router;
