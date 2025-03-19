
const { Leaves }= require('../models')


module.exports.createLeave=async(req,res)=> {
    const {name, days}=req.body
    const { userId }=req.params

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
            userUUID: userId
        })
        res.status(201).json({message:"Leave created successfully", leaves})
    } catch (error) {
                
        res.status(500).json({message:"error creating leave", error})
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
        
    } catch (error) {
        res.status(500).json({message:"Error deleting leave", error:error.message})
        
    }
}