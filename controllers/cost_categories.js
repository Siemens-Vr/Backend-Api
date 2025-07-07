const {Cost_categories,  Cost_categories_table} = require('../models')
// const milestones = require('../models/milestones')


module.exports.getCost_categories = async (req, res)=>{
 const {uuid} = req.params
  const cost_categories = await Cost_categories.findAll({where: {milestoneId: uuid} })

  res.status(200).json(cost_categories)

  try{

  }catch(error){
    res.status(500).json({message: "Internal server error", error: error.errors[0].message})
  }

}

module.exports.get_cost_categories_by_id = async (req, res)=>{
    const {uuid} = req.params
     const cost_categories_entries = await Cost_categories.findOne({
        where: {uuid} ,
        include: [{
            model:Cost_categories_table,
            as: 'cost_categories_tables',
            separate:true,
            order:[['no', 'ASC']],
            required:false,
        }],
    
    
    
    });
   
     res.status(200).json(cost_categories_entries)
   
     try{
   
     }catch(error){
       res.status(500).json({message: "Internal server error", error: error.errors[0].message})
     }
   
   }

module.exports.createCost_categories = async (req, res)=>{
    const milestoneId = req.params.uuid
    const {title}  =req.body
    try{

        const cost_category = await Cost_categories.create({ title,milestoneId} )
        res.status(201).json(cost_category);

    }catch(error){
    res.status(500).json({message: "Internal server error", error: error.errors[0].message})

    }
 

}

module.exports.updateCost_categories = async(req, res)=>{
    const {uuid} = req.body
    const cost_category = await Cost_categories.findOne({where :{ uuid}})

    const {title} =req.body

    if( !cost_category){
        return res.status(404).json({message: 'Cost category not found'})
    }

    await cost_category.update(
        {title}
    )
    
    res.status(200).json({ message: "Cost category updated successfully", cost_category });
}

