const { Project, Assignee, Phase, Deliverable, sequelize } = require('../models'); 
const path = require('path');


  module.exports.createProject=async (req,res)=> {
    
    try {

      const newProject=await Project.create(req.body);

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

  const project  = req.body;


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

