const { Personnel, User, Project } = require('../models');

// Create personnel assignment
module.exports.create = async (req, res) => {
  const projectId = req.params.uuid;
  const {
    userId,
    role,
    responsibilities,
    startDate,
    endDate,
    isActive
  } = req.body;

  try {
    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const personnel = await Personnel.create({
      userId,
      projectId,
      role,
      responsibilities,
      startDate: startDate || new Date(),
      endDate,
      isActive: isActive !== undefined ? isActive : true
    }, { userId: req.user.uuid });

    // Fetch the created personnel with user details
    const createdPersonnel = await Personnel.findByPk(personnel.uuid, {
      include: [
        { model: User, as: 'user', attributes: ['uuid', 'firstName', 'lastName', 'email'] },
        { model: Project, as: 'project', attributes: ['uuid', 'title'] }
      ]
    });

    res.status(201).json({
      message: 'Personnel assigned successfully',
      personnel: createdPersonnel
    });

  } catch (error) {
    console.error('Error creating personnel:', error);
    const errorMessage = error.errors ? error.errors[0].message : error.message;
    res.status(500).json({ 
      message: 'Failed to assign personnel',
      error: errorMessage 
    });
  }
};

// Get all personnel for a project
module.exports.getByProject = async (req, res) => {
  const projectId = req.params.uuid;
  const { isActive, role } = req.query;

  try {
    const whereClause = { projectId };
    
    // Filter by active status if provided
    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }
    
    // Filter by role if provided
    if (role) {
      whereClause.role = role;
    }

    const personnel = await Personnel.findAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['uuid', 'firstName', 'lastName', 'email'] 
        },
        { 
          model: Project, 
          as: 'project', 
          attributes: ['uuid', 'title'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Personnel retrieved successfully',
      personnel,
      count: personnel.length
    });

  } catch (error) {
    console.error('Error fetching personnel:', error);
    res.status(500).json({ 
      message: 'Failed to fetch personnel',
      error: error.message 
    });
  }
};

// Get all projects for a user
module.exports.getByUser = async (req, res) => {
  const userId = req.user.uuid;

  console.log(userId)

  try {
    const whereClause = { userId };

    const personnel = await Personnel.findAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['uuid', 'firstName', 'lastName', 'email'] 
        },
        { 
          model: Project, 
          as: 'project', 
          attributes: ['uuid', 'title', 'description', 'implementation_startDate', 'implementation_endDate'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'User projects retrieved successfully',
      projects:personnel[0].project,
      count: personnel.length
    });

  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user projects',
      error: error.message 
    });
  }
};

// Get single personnel assignment
module.exports.getById = async (req, res) => {
  const { uuid } = req.params;

  try {
    const personnel = await Personnel.findByPk(uuid, {
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['uuid', 'firstName', 'lastName', 'email'] 
        },
        { 
          model: Project, 
          as: 'project', 
          attributes: ['uuid', 'title', 'description'] 
        },
        { 
          model: User, 
          as: 'creator', 
          attributes: ['uuid', 'firstName', 'lastName'] 
        },
        { 
          model: User, 
          as: 'updater', 
          attributes: ['uuid', 'firstName', 'lastName'] 
        }
      ]
    });

    if (!personnel) {
      return res.status(404).json({ message: 'Personnel assignment not found' });
    }

    res.json({
      message: 'Personnel retrieved successfully',
      personnel
    });

  } catch (error) {
    console.error('Error fetching personnel:', error);
    res.status(500).json({ 
      message: 'Failed to fetch personnel',
      error: error.message 
    });
  }
};

// Update personnel assignment
module.exports.update = async (req, res) => {
  const { uuid } = req.params;
  const {
    role,
    responsibilities,
    startDate,
    endDate,
    isActive
  } = req.body;

  try {
    const personnel = await Personnel.findByPk(uuid);
    if (!personnel) {
      return res.status(404).json({ message: 'Personnel assignment not found' });
    }

    const updates = {};
    if (role !== undefined) updates.role = role;
    if (responsibilities !== undefined) updates.responsibilities = responsibilities.trim();
    if (startDate !== undefined) updates.startDate = startDate;
    if (endDate !== undefined) updates.endDate = endDate;
    if (isActive !== undefined) updates.isActive = isActive;

    await personnel.update(updates, { 
      userId: req.user.uuid 
    });

    // Fetch updated personnel with relations
    const updatedPersonnel = await Personnel.findByPk(uuid, {
      include: [
        { model: User, as: 'user', attributes: ['uuid', 'firstName', 'lastName', 'email'] },
        { model: Project, as: 'project', attributes: ['uuid', 'title'] }
      ]
    });

    res.json({
      message: 'Personnel updated successfully',
      personnel: updatedPersonnel
    });

  } catch (error) {
    console.error('Error updating personnel:', error);
    const errorMessage = error.errors ? error.errors.map(e => e.message).join('; ') : error.message;
    res.status(500).json({ 
      message: 'Failed to update personnel',
      error: errorMessage 
    });
  }
};

// Soft delete - set isActive to false
module.exports.deactivate = async (req, res) => {
  const { uuid } = req.params;

  try {
    const personnel = await Personnel.findByPk(uuid);
    if (!personnel) {
      return res.status(404).json({ message: 'Personnel assignment not found' });
    }

    await personnel.update({
      isActive: false,
      endDate: new Date()
    }, { 
      userId: req.user.uuid 
    });

    res.json({
      message: 'Personnel deactivated successfully',
      personnel
    });

  } catch (error) {
    console.error('Error deactivating personnel:', error);
    res.status(500).json({ 
      message: 'Failed to deactivate personnel',
      error: error.message 
    });
  }
};

// Hard delete
module.exports.delete = async (req, res) => {
  const { uuid } = req.params;

  try {
    const personnel = await Personnel.findByPk(uuid);
    if (!personnel) {
      return res.status(404).json({ message: 'Personnel assignment not found' });
    }

    await personnel.destroy();

    res.json({
      message: 'Personnel assignment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting personnel:', error);
    res.status(500).json({ 
      message: 'Failed to delete personnel',
      error: error.message 
    });
  }
};

// Get all available roles
module.exports.getRoles = async (req, res) => {
  try {
    // Get the enum values from the model
    const roles = [
      'Project Manager', 
      'Team Lead', 
      'Developer', 
      'Designer', 
      'Analyst', 
      'Tester', 
      'Stakeholder',
      'Client',
      'Consultant'
    ];

    res.json({
      message: 'Roles retrieved successfully',
      roles
    });

  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ 
      message: 'Failed to fetch roles',
      error: error.message 
    });
  }
};