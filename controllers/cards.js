const {Cards} = require('../models')
const milestones = require('../models/milestones')


module.exports.getCards = async (req, res)=>{
 const {uuid} = req.params
  const cards = await Cards.findAll({where: {milestoneId: uuid} })

  res.status(200).json(cards)

  try{

  }catch(error){
    res.status(500).json({message: "Internal server error"})
  }

}

module.exports.createCards = async (req, res)=>{
    const milestoneId = req.params.uuid
    const {name}  =req.body

    const card = await Cards.create({ name,milestoneId} )
    res.status(201).json(card);


}