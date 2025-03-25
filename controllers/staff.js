const {Staff,User, Leave} = require('../models');


module.exports.getStaff = async (req, res) =>{
    try{
    const staffs = await User.findAll({order: [['createdAt', 'DESC']]})
     res.status(200).json(staffs)
    
  }catch(error){
      res.status(500).json({error:error.message})
  }

}

