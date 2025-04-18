const {LeaveRequests} = require('../models')
const models = require('../models')

// console.log(models)

module.exports.getAllLeaveRequests =  async(req, res)=>{

    try {
        const requests =  await LeaveRequests.findAll()
        res.status(201).json(requests)        
    } catch (error) {
        console.log({"Error in the create leave Requests controller": error. message, })
        res.status(500).json({message: "Internal server Error", Error: error.message})
    }

}

module.exports.createLeaveRequests =  async(req, res)=>{
   console.log(req.body)
    const {userId, leaveId, reason, startDate, endDate  } =req.body
   
   
    try {
        
        const request = await LeaveRequests.create({userId, leaveId, reason, startDate, endDate})

        if(request){
            res.status(201).json({message: "Leave Request send successfully"})
        }
        
    } catch (error) {
        console.log({"Error in the create leave Requests controller": error, })
        res.status(500).json({message: "Internal server Error", Error: error.message})
    }

}
module.exports.getStaffLeaveHistory =  async(req, res)=>{
    const {id} = req. params

    try {

        const request = await LeaveRequest.findAll({where:{userId: id}})
        if(!request){
            return res.status(404).json({message: " Leave Request "})
        }
        res.sattus(200).json(request)
    } catch (error) {
        console.log({"Error in the create leave Requests controller": error. message, })
        res.status(500).json({message: "Internal server Error", Error: error.message})
    }

}

module.exports.getLeaveRequestsById =  async(req, res)=>{
    const {id} = req. params

    try {

        const request = await LeaveRequest.findAll({where:{uuid: id}})
        if(!request){
            return res.status(404).json({message: " Leave Request "})
        }
        res.sattus(200).json(request)
    } catch (error) {
        console.log({"Error in the create leave Requests controller": error. message, })
        res.status(500).json({message: "Internal server Error", Error: error.message})
    }

}


module.exports.approve =  async(req, res)=>{
    const {id} =req.params
    const {approvalStatus} = req.body

    try {
        const request = await LeaveRequest.findAll({where:{uuid :id }})
        if(!request){
            return res.status(404).json({message: " Leave Request "})
        }

        request.approvalStatus = approvalStatus
        await request.save()

        res.status(200).json({message: "User has been approved"})

    } catch (error) {
        console.log({"Error in the create leave Requests controller": error. message, })
        res.status(500).json({message: "Internal server Error", Error: error.message})
    }

}