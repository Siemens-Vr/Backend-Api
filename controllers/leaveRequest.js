const { LeaveRequest } = require('../models');



// Create a Leave Request
 

module.exports.createLeaveRequest = async (req, res) => {
  try {
    const { startDate, endDate, Reason, Status } = req.body;
    const { userId, leaveId } = req.params;

    // Validate required fields
    if (!startDate || !endDate || !Reason) {
      return res.status(400).json({ error: 'Missing required fields: startDate, endDate, or Reason.' });
    }

    // Ensure startDate is before endDate
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: 'startDate must be before endDate.' });
    }

    // Check for valid Status (optional: if you have fixed status values)
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (Status && !validStatuses.includes(Status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    // Create a leave request
    const leaveRequest = await LeaveRequest.create({
      leaveUUID: leaveId,
      userUUID: userId,
      startDate,
      endDate,
      Reason,
      Status: Status || 'Pending', // Default status if not provided
    });

    res.status(201).json({
      message: 'Leave request created successfully.',
      leaveRequest,
    });

  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};




 // Get a Single Leave Request by ID
module.exports.getLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findByPk(id);

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found.' });
    }

    res.status(200).json(leaveRequest);
  } catch (error) {
    console.error('Error fetching leave request:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update a Leave Request by ID
module.exports.updateLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, Reason, Status } = req.body;

    const leaveRequest = await LeaveRequest.findByPk(id);

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found.' });
    }

    const updatedFields = {};

    if (startDate && startDate !== leaveRequest.startDate) {
      updatedFields.startDate = startDate;
    }
    if (endDate && endDate !== leaveRequest.endDate) {
      updatedFields.endDate = endDate;
    }
    if (Reason && Reason !== leaveRequest.Reason) {
      updatedFields.Reason = Reason;
    }
    if (Status && Status !== leaveRequest.Status) {
      updatedFields.Status = Status;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: 'No fields were updated.' });
    }

    await leaveRequest.update(updatedFields);

    res.status(200).json({ message: 'Leave request updated successfully.', updatedFields });
  } catch (error) {
    console.error('Error updating leave request:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


// Delete a Leave Request by ID
module.exports.deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findByPk(id);

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found.' });
    }

    await leaveRequest.destroy();

    res.status(200).json({ message: 'Leave request deleted successfully.' });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
