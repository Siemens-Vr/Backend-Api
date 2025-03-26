const {getAllLeaveRequests,createLeaveRequests} = require('../controllers/leaveRequests')


const express = require('express')

const router =express.Router()


router.get('/', getAllLeaveRequests)
router.post('/', createLeaveRequests)



module.exports = router