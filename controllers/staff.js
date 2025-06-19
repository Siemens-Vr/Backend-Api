const {Staff,User, Leave} = require('../models');


module.exports.getStaff = async (req, res) =>{
    console.log("running")
    try{
    const staffs = await User.findAll({order: [['createdAt', 'DESC']]})
    console.log(staffs)
     res.status(200).json(staffs)
    
  }catch(error){
    console.log(error)
      res.status(500).json({error:error.message})
  }

}

module.exports.getStaffById = async(req, res) =>{
    const {id} = req.params
    try{
        const staff = await  User.findOne({where : {uuid: id}})
        res.status(201).json( staff)

    }catch(error){
        res.status(500).json({error:error.message})
    }
} 

