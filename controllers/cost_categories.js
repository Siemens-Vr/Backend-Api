const {Cost_categories,  Cost_categories_table} = require('../models')
const {ArchiveService} = require('../services/auditTrail')


module.exports.getCost_categories = async (req, res)=>{
 const {uuid} = req.params
  try{
      const { data: cost_categories, count } = await ArchiveService.getActiveRecords(
      Cost_categories,
      whereClause = {uuid},
      {
        include: [ /* …eager loads… */ ],
        order: [ ]
      }
    );
    //  Return the projects
    return res.json({ success: true, count, cost_categories });

  }catch(error){
    res.status(500).json({message: "Internal server error", error: error.errors[0].message})
  }

}

module.exports.get_cost_categories_by_id = async (req, res)=>{
    const {uuid} = req.params

     try{
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


     }catch(error){
       res.status(500).json({message: "Internal server error", error: error.errors[0].message})
     }
   
   }

module.exports.createCost_categories = async (req, res)=>{
    const milestoneId = req.params.uuid

    const {title}  =req.body
    try{
        const cost_category = await Cost_categories.create({ title, milestoneId},{userId:req.user.uuid} )
        res.status(201).json(cost_category);
    }catch(error){
    res.status(500).json({message: "Internal server error", error})
    }
}

module.exports.updateCost_categories = async(req, res)=>{
    const {uuid} = req.params
    const cost_category = await Cost_categories.findOne({where :{ uuid}})

    const {title} =req.body
    if( !cost_category){
        return res.status(404).json({message: 'Cost category not found'})
    }
    await cost_category.update(
        {title},{userId:req.user.uuid}
    ) 
    res.status(200).json({ message: "Cost category updated successfully", cost_category });
}

module.exports.archiveCategoryById = async (req, res) => {
  const id  = req.params.uuid;
  console.log(id)
  const { reason } = req.body;


  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.connection.remoteAddress;

  try {
    const result = await ArchiveService.archiveRecord(
      Cost_categories,
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

