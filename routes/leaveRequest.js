const express = require('express');
const router = express.Router();

const { 
    createLeaveRequest, 
    getLeaveRequest, 
    updateLeaveRequest, 
    getAllLeaveRequests,
    deleteLeaveRequest 
} = require("../controllers/leaveRequest");

// Create a new leave request
router.post('/:userId/create', createLeaveRequest);

 
// Get a leave requests for a specific user
router.get('/:userUUID', getLeaveRequest);

 

// Update a leave request by ID
router.patch('/:userId/:leaveId/:id/update', updateLeaveRequest);

// Delete a leave request by ID
router.delete('/:userId/:leaveId/:id/delete', deleteLeaveRequest);

module.exports = router;
