const {getAllLeaveRequests,createLeaveRequests, getLeaveRequestsById,getStaffLeaveHistory } = require('../controllers/leaveRequests')


const express = require('express')

const router =express.Router()


router.get('/', getAllLeaveRequests)
router.get('/', getLeaveRequestsById)
router.get('/staff/:id', getStaffLeaveHistory)

router.post('/', createLeaveRequests)



module.exports = router