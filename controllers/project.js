const { Project, Milestone,Output ,  sequelize } = require('../models'); 
const path = require('path');
const {ArchiveService}= require('../services/auditTrail')

  module.exports.createProject=async (req,res)=> {

   
    const {
      project_id,
      title,
      type,
      description,
      total_value,
      approved_funding,
      implementation_startDate,
      implementation_endDate
    
    } = req.body
    try {
      const newProject=await Project.create({
        project_id,
        title,
        type,
        description,
        total_value,
        approved_funding,
        implementation_startDate,
        implementation_endDate
      });

      //Send success response
      res.status(201).json({message:'project created successfully', project:newProject});
      
    } catch (error) {
      console.error("'Error creating project", error);
      res.status(500).json({message:'Failed to create project', error:error.errors[0].message})
    }


};


//Getting all projects
 
module.exports.getAllProjects = async (req, res) => {
  try {
    // Fetch all projects from the database
    const { data: projects, count } = await ArchiveService.getActiveRecords(
      Project,
      {},
      {
        include: [ /* …eager loads… */ ],
        order: [ /* … */ ]
      }
    );
    //  Return the projects
    return res.json({ success: true, count, projects });
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ message: 'Failed to retrieve projects', error:error.errors[0].message});
  }
};



// Module to getProjectById
// module.exports.getProjectById = async (req, res) => {
//   const { uuid } = req.params;

//   try {
//     const project = await Project.findOne({
//       where: { uuid },
//       include: [{
//         model: Milestone,
//         as: 'milestones',
//         separate: true,
//         order: [['no', 'ASC']],
//         required: false,
//       }],
//     });

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     res.status(200).json(project);
//   } catch (error) {
//     res.status(500).json({
//       message: 'Failed to retrieve project',
//       error: error.message
//     });
//   }
// };

module.exports.getProjectById = async (req, res) => {
  const uuid = req.params.uuid;
  // console.log(uuid)

  try {
    // // 1) Load the active project by UUID
    const activeProjectResult = await ArchiveService.getActiveRecords(
      Project,
  
    );
    const project = activeProjectResult.data.find(p => p.uuid === uuid);

    if (!project) {
      return res.status(404).json({ message: 'Project not found or inactive' });
    }
    // const project = await Project.findOne({where:{uuid}});

    // 2) Load active milestones for this project
    const activeMilestonesResult = await ArchiveService.getActiveRecords(
      Milestone,
      { projectId: uuid },
      { order: [['no', 'ASC']] }
    );
    const milestones = activeMilestonesResult.success
      ? activeMilestonesResult.data
      : [];

    // 3) For each milestone, load its active outputs
    await Promise.all(
      milestones.map(async (ms) => {
        const activeOutputsResult = await ArchiveService.getActiveRecords(
          Output,
          { milestoneId: ms.uuid },
          { order: [['no', 'ASC']] }
        );
        // Attach outputs array (or empty) under ms.dataValues.outputs
        ms.dataValues.outputs = activeOutputsResult.success
          ? activeOutputsResult.data
          : [];
      })
    );

    // 4) Attach milestones (with outputs) to the project payload
    project.dataValues.milestones = milestones;

    return res.status(200).json(project);
  } catch (error) {
    console.error('Failed to retrieve project:', error);
    return res.status(500).json({
      message: 'Failed to retrieve project',
      error: error.message
    });
  }
};



module.exports.updateProject = async (req, res) => {
  const { uuid } = req.params;
  const {
    title,
    type,
    description,
    total_value,
    approved_funding,
    implementation_startDate,
    implementation_endDate
  } = req.body;

  try {
    // 1. Fetch the project
    const project = await Project.findByPk(uuid);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }



    // 3. Build an “updates” object with only the supplied fields
    const updates = {};
    if (title                     !== undefined) updates.title                     = title.trim();
    if (type                      !== undefined) updates.type                      = type.trim();
    if (description               !== undefined) updates.description               = description.trim();
    if (total_value               !== undefined) updates.total_value               = total_value;
    if (approved_funding          !== undefined) updates.approved_funding          = approved_funding;
    if (implementation_startDate  !== undefined) updates.implementation_startDate  = implementation_startDate;
    if (implementation_endDate    !== undefined) updates.implementation_endDate    = implementation_endDate;

    // 4. Perform the update
    await project.update(updates);

    // 5. Return the updated record
    return res.status(200).json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    // Gather validation error messages if present
    const errorMessage = Array.isArray(error.errors)
      ? error.errors.map(e => e.message).join('; ')
      : error.message;

    return res.status(500).json({
      message: 'Failed to update project',
      error: errorMessage
    });
  }
};




module.exports.archiveProjectById = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;


  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.connection.remoteAddress;

  try {
    const result = await ArchiveService.archiveRecord(
      Project,
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

