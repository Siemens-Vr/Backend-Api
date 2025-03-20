const { LeaveRequest } = require('../models');



// Create a Leave Request
module.exports.createLeaveRequest = async (req, res) => {
  try {
    const { leaveUUID, startDate, endDate, Reason, Status } = req.body;

    if (!leaveUUID || !startDate || !endDate || !Reason) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const leaveRequest = await LeaveRequest.create({
      leaveUUID,
      startDate,
      endDate,
      Reason,
      Status,
    });

    res.status(201).json({ message: 'Leave request created successfully.', leaveRequest });
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

    await leaveRequest.update({
      startDate,
      endDate,
      Reason,
      Status,
    });

    res.status(200).json({ message: 'Leave request updated successfully.', leaveRequest });
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
