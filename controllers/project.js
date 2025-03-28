const { Project, Assignee, Phase, Deliverable, sequelize } = require('../models'); 
const path = require('path');
const validateProject = require('../validation/projectValidation');


// module.exports.createProject = async (req, res) => {
//   const { name, description, status, budget, funding, startDate, endDate, assignees, phases, deliverables } = req.body;

//   // Step 1: Validate project data
//   const { error: projectError } = validateProject({ name, description, status, budget, funding, startDate, endDate });
//   if (projectError) {
//     return res.status(500).json({ message: 'Project validation error', details: projectError.details });
//   }

//   // Step 2: Early validation of deliverables structure
//   if (deliverables && deliverables.length > 0 && (!phases || phases.length === 0)) {
//     return res.status(500).json({ 
//       message: 'Invalid project structure', 
//       details: 'Deliverables cannot be created without associated phases. Please create phases first and assign deliverables to specific phases.'
//     });
//   }

//   const transaction = await sequelize.transaction();

//   try {
//     // // Get file path from multer (if file is uploaded)
//     // const documentPath = req.file ? req.file.path : null;

//     // Step 3: Create the project with document path if provided
//     let project;
//     try {
//       project = await Project.create(
//         {
//           name,
//           description,
//           status,
//           budget,
//           funding,
//           startDate,
//           endDate,
//         },
//         { transaction }
//       );
//     } catch (error) {
//       await transaction.rollback();
//       return res.status(500).json({ message: 'Failed to create project', error: error.message });
//     }

//     // Verify project was created successfully
//     if (!project || !project.uuid) {
//       await transaction.rollback();
//       return res.status(500).json({ message: 'Project creation failed - invalid project data' });
//     }

//     // Step 4: Validate and Create Assignees if provided (only if project exists)
//     if (assignees && assignees.length > 0) {
//       // Validate all assignees first before creating any
//       for (const assignee of assignees) {
//         const { error: assigneeError } = validateAssignee(assignee);
//         if (assigneeError) {
//           await transaction.rollback();
//           return res.status(500).json({ message: 'Assignee validation error', details: assigneeError.details });
//         }
//       }

//       const assigneeData = assignees.map((assignee) => ({
//         ...assignee,
//         projectId: project.uuid,
//       }));

//       try {
//         await Assignee.bulkCreate(assigneeData, { transaction });
//       } catch (error) {
//         await transaction.rollback();
//         return res.status(500).json({ message: 'Failed to create assignees', error: error.message });
//       }
//     }

//     // Step 5: Validate and Create Phases and Deliverables if provided
//     if (phases && phases.length > 0) {
//       // Validate all phases first before creating any
//       for (const phase of phases) {
//         const { error: phaseError } = validatePhase(phase);
//         if (phaseError) {
//           await transaction.rollback();
//           return res.status(500).json({ message: 'Phase validation error', details: phaseError.details });
//         }
//       }

//       // Create phases and their deliverables
//       for (const phase of phases) {
//         let phaseRecord;
//         try {
//           phaseRecord = await Phase.create(
//             {
//               name: phase.name,
//               startDate: phase.startDate,
//               endDate: phase.endDate,
//               status: phase.status,
//               projectId: project.uuid,
//             },
//             { transaction }
//           );
//         } catch (error) {
//           await transaction.rollback();
//           return res.status(500).json({ message: 'Failed to create phase', error: error.message });
//         }

//         // Verify phase was created successfully
//         if (!phaseRecord || !phaseRecord.uuid) {
//           await transaction.rollback();
//           return res.status(500).json({ message: 'Phase creation failed - invalid phase data' });
//         }

//         // Create Deliverables for each Phase if provided
//         if (phase.deliverables && phase.deliverables.length > 0) {
//           // Validate all deliverables first before creating any
//           for (const deliverable of phase.deliverables) {
//             const { error: deliverableError } = validateDeliverable(deliverable);
//             if (deliverableError) {
//               await transaction.rollback();
//               return res.status(500).json({ message: 'Deliverable validation error', details: deliverableError.details });
//             }
//           }

//           const deliverableData = phase.deliverables.map((deliverable) => ({
//             ...deliverable,
//             phaseId: phaseRecord.uuid,
//           }));

//           try {
//             await Deliverable.bulkCreate(deliverableData, { transaction });
//           } catch (error) {
//             await transaction.rollback();
//             return res.status(500).json({ message: 'Failed to create deliverables', error: error.message });
//           }
//         }
//       }
//     }

//     // Commit the transaction
//     await transaction.commit();
//     res.status(200).json({ message: 'Project created successfully', project });
//   } catch (error) {
//     // Rollback the transaction if any error occurs
//     await transaction.rollback();
//     res.status(500).json({ message: 'Failed to create project', error: error.message });
//   }
// };

// module.exports.getAllProjects = async (req, res) => {
//   try {
//     const projects = await Project.findAll({
//       include: [
//         {
//           model: Assignee,
//           as: 'assignees',
//         },
//         {
//           model: Phase,
//           as: 'phases',
//           include: [
//             {
//               model: Deliverable,
//               as: 'deliverables',
//             },
//           ],
//         },
//       ],
//     });

//     res.status(200).json(projects);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to retrieve projects', error: error.message });
//   }
// };

// module.exports.getProjectById = async (req, res) => {
//   const { uuid } = req.params;

//   try {
//     const project = await Project.findOne({
//       where: { uuid },
//       include: [
//         {
//           model: Assignee,
//           as: 'assignees',
//         },
//         {
//           model: Phase,
//           as: 'phases',
//           include: [
//             {
//               model: Deliverable,
//               as: 'deliverables',
//             },
//           ],
//         },
//       ],
//     });

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     res.status(200).json(project);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to retrieve project', error: error.message });
//   }
// };






// Module to create a project and save to the datase


  module.exports.createProject=async (req,res)=> {
    
  const {name, description, status, budget,funding, startDate, endDate}= req.body

  // Validate the project credentials using joi
  const { error: projectError } = validateProject({ name, description, status, budget, funding, startDate, endDate });
    if (projectError) {
      return res.status(500).json({ message: 'Project validation error', details: projectError.details });
    }

    try {

      const newProject=await Project.create({
        name,
        description,
        status,
        budget,
        funding,
        startDate,
        endDate,
      });

      //Send success response
      res.status(201).json({message:'project created successfully', project:newProject});
      
    } catch (error) {
      console.error("'Error creating project", error);
      res.status(500).json({message:'Failed to create project', error:error.message})
    }


};


//Getting all projects
 
module.exports.getAllProjects = async (req, res) => {
  try {
    // Fetch all projects from the database
    const projects = await Project.findAll();

    //  Check if there are no projects
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }

    //  Return the projects
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ message: 'Failed to retrieve projects', error: error.message });
  }
};



// Module to getProjectById
module.exports.getProjectById = async (req, res) => {
  const { uuid } = req.params;

  try {
    const project = await Project.findOne({where: { uuid } });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve project', error: error.message });
  }
};


module.exports.updateProject = async (req, res) => {
  const { uuid } = req.params;

  const { name, description, status, budget, funding, startDate, endDate } = req.body;


  try {
    // Step 1: Update the Project
    const project = await Project.findByPk(uuid);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update project fields
    await project.update(
      {
        name,
        description,
        status,
        budget,
        funding,
        startDate,
        endDate,
      }
    );
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    // Rollback the transaction if any error occurs

    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
};




module.exports.deleteProject = async (req, res) => {
  const { uuid } = req.params;
  const transaction = await sequelize.transaction();

  try {
    // Step 1: Find the project by UUID
    const project = await Project.findOne({ where: { uuid } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Step 2: Fetch associated phases for deletion of deliverables
    const phases = await Phase.findAll({ where: { projectId: project.uuid } });
    const phaseIds = phases.map(phase => phase.uuid);

    // Step 3: Delete associated deliverables
    await Deliverable.destroy({ where: { phaseId: phaseIds }, transaction });

    // Step 4: Delete associated phases
    await Phase.destroy({ where: { projectId: project.uuid }, transaction });

    // Step 5: Delete associated assignees
    await Assignee.destroy({ where: { projectId: project.uuid }, transaction });

    // Step 6: Delete the project itself
    await project.destroy({ transaction });

    // Step 7: Delete the document from the uploads folder
    if (project.documentPath) {
      const filePath = path.join(__dirname, '../uploads', project.documentPath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
        }
      });
    }

    // Commit the transaction
    await transaction.commit();
    res.status(200).json({ message: 'Project and associated records deleted successfully' });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};

