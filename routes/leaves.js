const { getLeaves, createLeave, getLeaveById, updateLeave, deleteLeave } = require('../controllers/leave');
const express = require('express');
const leaveRouter = express.Router();

leaveRouter.get('/', getLeaves);
leaveRouter.post('/', createLeave);
leaveRouter.get('/:uuid', getLeaveById);
leaveRouter.post('/:uuid', updateLeave);
leaveRouter.get('/delete/:uuid', deleteLeave);

module.exports = leaveRouter;
