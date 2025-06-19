const {CardsFolders } = require('../models')


module.exports.getFolders = async(req, res)=>{
    const {uuid} = req.params

    try{
        const folders = await CardsFolders.findAll({where:{cardId: uuid}})
         res.status(200).json(folders)

    }catch(error){
        res.status(500).json({message: "Internal server error"})
    }

}


module.exports.createFolders =async(req,res) =>{
    const cardId = req.params.uuid
    const {name} =req.body
    try{
        const folder = await CardsFolders.create({name , cardId})

        res.status(200).json(folder)

    }catch(error){
        res.status(500).json({message: "Internal server error"})  
    }
}