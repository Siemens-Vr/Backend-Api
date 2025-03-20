
const { Leaves }= require('../models')

// Module to create leave
module.exports.createLeave=async(req,res)=> {
    const {name, days}=req.body
 
    console.log(req.body);
    try {
        if(!name){
            return res.status(401).json({message: "name is required"})
        }
         
        if (!days){
            return res.status(401).json({message:"name is required"})
        }

        const leaves=await Leaves.create({
            name,
            days,
            
        })
        res.status(201).json({message:"Leave created successfully", leaves})
    } catch (error) {
                
        res.status(500).json({message:"error creating leave", error})
    }

}

// Module to getAllLeave
module.exports.getAllLeave = async (req, res) => {
    try {
        // Fetch all leave records
        const leaves = await Leaves.findAll();

        // Check if there are no leaves
        if (leaves.length === 0) {
            return res.status(404).json({ message: "No leaves found" });
        }

        // Respond with the leave records
        res.status(200).json({ message: "All leaves retrieved successfully", leaves });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Error fetching leaves", error });
    }
};


// Module to get leave by id
module.exports.getLeaveById=async (req,res)=>{
    const {id}=req.params

    try {
        //find leave by PK
        const leave=await Leaves.findByPk(id)

        // check if it exists
        if (!leave) {
            return res.status(404).json({ message: "Leave not found" });
        }

          // Respond with the leave record
          res.status(200).json({ message: "Leave retrieved successfully", leave });
        
    } catch (error) {
                // Handle errors when fetching
        res.status(500).json({ message: "Error fetching leave", error });

        
    }
}

// Module to update a leave
module.exports.updateLeave= async(req,res)=> {
       const {name, days}=req.body
       const {id}=req.params

     try { 
        const leave=await Leaves.findByPk(id)
        if(!leave){
            res.status(500).json({message:"Leave does not exist"})
        }

        // objet to store dynamically updated records
        const updated={};

        //  updates the leave
        if(name) updated.name=name
        if(days) updated.days=days

        await leave.update(updated)
        res.status(200).json({message:"Leave updated successfully", updated})
        
     } catch (error) {
        res.status(500).json({message:"error updating leave", error:error.message})
        
     }

}

module.exports.deleteLeave= async(req,res)=> {
     
    const {id}=req.params
    try {
     const Leave=await Leaves.findByPk(id)

     if(!Leave){
        res.status(404).json({message:"The record is not found"})
     }
     
    //  Delete the leave if found
     await Leave.destroy()  
     res.status(200).json({message:"Leave deleted successfully"}) 

    } catch (error) {
        res.status(500).json({message:"Error deleting leave", error:error.message})
        
    }
}