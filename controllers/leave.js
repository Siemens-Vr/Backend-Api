const {Leaves } = require('../models')
// const models = require('../models')
// console.log(models)


module.exports.getLeaves = async(req, res)=>{
    console.log("Running")
    try{
        const leaves = await Leaves.findAll()
        res.status(200).json(leaves)
        
    }catch(error){
        console.log({"Error in the create leave controller": error. message, })
        res.status(500).json({message: "Internal server Error", Error: error.message})

    } 

    

}

module.exports.createLeave = async(req, res)=>{
    const {name , description, days} = req.body
    try{
        const leave = await Leaves.create({name, description, days})

        if(leave){
            return res.status(201).json({message: "Leave created successfully"})
        }
        res.status(200).json({leave})

    }catch(error){
        console.log({"Error in the create leave controller": error. message, })
        res.status(500).json({message: "Internal server error", Error: error.message})
    }
}

module.exports.getLeaveById = async (req, res) => {
    const { uuid } = req.params;
    console.log(uuid);

    try {
        const leave = await Leaves.findAll({ where: { uuid } });

        if (leave.length === 0) {
            return res.status(404).json({ Error: "Leave not found" });
        }
        
        res.status(200).json(leave); // Return `leave` not `Leave`

    } catch (error) {
        console.error({ "Error in the getLeaveById controller": error.message });
        res.status(500).json({ message: "Internal server error", Error: error.message });
    }
};


module.exports.updateLeave = async (req, res) => {
    const { uuid } = req.params;
    try {
        const updatedLeave = await Leaves.update(req.body, { where: { uuid } });

        if (!updatedLeave[0]) {
            return res.status(404).json({ error: "Leave not found" });
        }
        res.status(200).json({ message: "Leave updated successfully" });
    } catch (error) {
        console.error("Error updating leave:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports.deleteLeave = async (req, res)=>{
    const {uuid} = req.params

    try {
        const deleteLeave = await Leaves.destroy({ where: { uuid } });
    
        if (deleteLeave) {
          res.status(200).json({ message: "leave deleted successfully" });
        } else {
          res.status(404).json({ error: "leave not found" });
        }
      } catch (error) {
        console.log({"Error in the create leave controller": error. message, })
        res.status(500).json({message: "Internal server error", Error: error.message})
      }
}
