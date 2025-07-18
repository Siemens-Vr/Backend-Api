const {Cost_category_table} = require('../models')

const {ArchiveService} = require('../services/auditTrail')


module.exports.get_cost_categories_table = async (req, res)=>{
 const cost_category_Id = req.params.uuid

  try{

    const { data: cost_categories_entries, count } = await ArchiveService.getActiveRecords(
      Cost_category_table,
      whereClause = {cost_category_Id},
      {
        include: [ /* …eager loads… */ ],
        order: [ ]
      }
    );
    //  Return the projects
    return res.json({ success: true, count, cost_categories_entries });

  }catch(error){
    res.status(500).json({message: "Internal server error", error: error})
  }

}

module.exports.create_cost_categories_table = async (req, res)=>{
    const cost_category_Id = req.params.uuid
    const {no, title ,description ,total_amount,}  =req.body
    try{

        const cost_category_table = await Cost_category_table.create(
            {no, title,description,total_amount, cost_category_Id} ,
            {userId:req.user.uuid}
        )
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
        {no, title ,description ,total_amount},
        {userId: req.user.uuid}
    )
    
    res.status(200).json({ message: "Cost category updated successfully", cost_category });
}


module.exports.archiveCategoryById = async (req, res) => {
  const id  = req.params.uuid;
  
  const { reason } = req.body;


  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.connection.remoteAddress;

  try {
    const result = await ArchiveService.archiveRecord(
      Cost_category_table,
      id,
      req.user?.uuid,
      reason,
      { source: 'api', ip: ip }
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error archiving output:', error);
    return res.status(400).json({
      error: error.message
    });
  }
};
