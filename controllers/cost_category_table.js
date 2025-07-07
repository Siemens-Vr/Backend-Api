const {Cost_category_table} = require('../models')



module.exports.get_cost_categories_table = async (req, res)=>{
 const {uuid} = req.params
  const cost_categories_tables = await Cost_category_table.findAll({where: { cost_category_Id: uuid} })

  res.status(200).json(cost_categories_tables)
  try{

  }catch(error){
    res.status(500).json({message: "Internal server error", error: error})
  }

}

module.exports.create_cost_categories_table = async (req, res)=>{
    const cost_category_Id = req.params.uuid
    const {no, title ,description ,total_amount,}  =req.body
    try{

        const cost_category_table = await Cost_category_table.create({no, title,description,total_amount, cost_category_Id} )
        res.status(201).json(cost_category_table);

    }catch(error){
    res.status(500).json({message: "Internal server error", error: error})

    }
 

}

module.exports.update_cost_categories_table = async(req, res)=>{
    const {uuid} = req.body
    const cost_category = await Cost_categories_table.findOne({where :{ uuid}})

    const {no, title ,description ,total_amount} =req.body

    if( !cost_category){
        return res.status(404).json({message: 'Cost category not found'})
    }

    await cost_category.update(
        {no, title ,description ,total_amount}
    )
    
    res.status(200).json({ message: "Cost category updated successfully", cost_category });
}

