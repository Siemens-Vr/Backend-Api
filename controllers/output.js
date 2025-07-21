const { Output , Milestone , UsersNotification} = require('../models');
const {ArchiveService} = require('../services/auditTrail')


const bulkCreateOutputs = async (req, res) => {
  // Quick debug – you should see your text‐fields and files here
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);

  // 1) Parse the metadata JSON
  let outputsData;
  try {
    outputsData = JSON.parse(req.body.outputs);
    console.log(outputsData)
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON in outputs field' });
  }

  // 2) Basic array checks
  if (!Array.isArray(outputsData) || outputsData.length === 0) {
    return res.status(400).json({ error: 'Expected non-empty array of outputs' });
  }

  // 3) Grab the array of uploaded files (field name "output")
  const uploadedFiles = req.files.output || [];

  const results = {
    totalProcessed: 0,
    created: [],
    failed: []
  };

  // 4) Process each metadata entry
  for (let i = 0; i < outputsData.length; i++) {
    results.totalProcessed++;
    const meta = outputsData[i];
    const file = uploadedFiles[i];           // the matching uploaded file, if any

    const {no, milestoneId, name, description, value } = meta;

    // validate required fields
    if (!milestoneId || !no || !name || !description || value == null) {
      results.failed.push({ meta, error: 'Missing required fields' });
      continue;
    }
    if (![0,1].includes(value)) {
      results.failed.push({ meta, error: 'Value must be 0 or 1' });
      continue;
    }

    // verify milestone exists
    const milestone = await Milestone.findByPk(milestoneId);
    if (!milestone) {
      results.failed.push({ meta, error: 'Milestone not found' });
      continue;
    }


    // build the record payload
    const payload = {
      no,         // let Sequelize generate if not provided
      name: name.trim(),
      description: description.trim(),
      value,
      is_approved: false,
      milestoneId
    };
    if (file) {
      payload.document_path = file.path;
      payload.document_name = file.filename;
    }

    // create the record
    try {
      const newOutput = await Output.create(payload);
      results.created.push({
        milestoneId,
        outputId: newOutput.uuid,
        name: newOutput.name,
      });
      console.log(`✔️ Created output ${newOutput.uuid} for milestone ${milestoneId}`);
    } catch (err) {
      console.error('Error creating output:', err);
      results.failed.push({ meta, error: err.message });
    }
  }

  // 5) Return a summary
  return res.status(201).json({
    success: true,
    summary: {
      total:  results.totalProcessed,
      ok:     results.created.length,
      bad:    results.failed.length
    },
    results
  });
};
// controllers/outputController.js

const bulkEditOutputs = async (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);

  // 1) Parse the edits JSON
  let edits;
  try {
    edits = JSON.parse(req.body.edits);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON in edits field' });
  }

  if (!Array.isArray(edits) || edits.length === 0) {
    return res.status(400).json({ error: 'Expected non-empty array of edits' });
  }

  // 2) Grab uploaded files (if any)
  const uploadArray = req.files.output || [];

  const results = {
    totalProcessed: 0,
    updated: [],
    failed: []
  };

  for (let i = 0; i < edits.length; i++) {
    results.totalProcessed++;
    const meta = edits[i];
    const file = uploadArray[i];

    const { uuid, no, name, description, value } = meta;

    // must have a UUID
    if (!uuid) {
      results.failed.push({ meta, error: 'Missing output UUID' });
      continue;
    }

    // find existing record
    const output = await Output.findByPk(uuid);
    if (!output) {
      results.failed.push({ meta, error: 'Output not found' });
      continue;
    }

    // optional: validate fields if present
    if (no != null && typeof no !== 'number') {
      results.failed.push({ meta, error: '"no" must be a number' });
      continue;
    }
    if (value != null && ![0,1].includes(value)) {
      results.failed.push({ meta, error: '"value" must be 0 or 1' });
      continue;
    }

    // build update payload
    const updates = {};
    if (no  != null) updates.no          = no;
    if (name != null) updates.name        = name.trim();
    if (description != null) updates.description = description.trim();
    if (value != null) updates.value      = value;
    // file override?
    if (file) {
      updates.document_path = file.path;
      updates.document_name = file.filename;
      // OPTIONAL: delete old file from disk here if you want
    }

    // perform update
    try {
      await output.update(updates);
      results.updated.push({
        uuid,
        changes: Object.keys(updates)
      });
      console.log(`✔️ Updated output ${uuid}:`, Object.keys(updates));
    } catch (err) {
      console.error('Error updating output:', err);
      results.failed.push({ meta, error: err.message });
    }
  }

  // return summary
  return res.status(200).json({
    success: true,
    summary: {
      total: results.totalProcessed,
      ok:    results.updated.length,
      bad:   results.failed.length
    },
    results
  });
};
const bulkGetOutputs = async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(400).json({ error: 'projectId parameter is required' });
  }

  try {
    const milestones = await Milestone.findAll({
      where: { projectId },
      // Make sure you do NOT have raw: true here
      include: [{
        model: Output,
        as: 'outputs',             // must match your hasMany({ as: 'outputs' })
        attributes: [
          'uuid', 'no', 'name', 'description',
          'document_path', 'document_name',
          'value', 'is_approved', 'createdAt', 'updatedAt'
        ]
      }],
      order: [
        ['no', 'ASC'],
        [{ model: Output, as: 'outputs' }, 'no', 'ASC']
      ]
    });

    const data = milestones.map(milestone => {
      // defensive fallback in case `outputs` is ever undefined
      const outputs = Array.isArray(milestone.outputs)
        ? milestone.outputs
        : [];

      return {
        milestoneId: milestone.uuid,
        milestoneNo: milestone.no,
        title: milestone.title,
        outputs: outputs.map(o => ({
          uuid:          o.uuid,
          no:            o.no,
          name:          o.name,
          description:   o.description,
          document_path: o.document_path,
          document_name: o.document_name,
          value:         o.value,
          is_approved:   o.is_approved,
          createdAt:     o.createdAt,
          updatedAt:     o.updatedAt
        }))
      };
    });

    return res.json({
      success:    true,
      projectId,
      milestones: data
    });
  } catch (err) {
    console.error('Error fetching outputs by project:', err);
    return res.status(500).json({
      success: false,
      error:   'Internal server error'
    });
  }
};
// Create a new Output
const createOutput = async (req, res) => {
  const {milestoneId} = req.params
  const fileArray = req.files?.output;
  const file = fileArray?.[0];

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }


  try {
    const { no, name, description, value } = req.body;
    const output = await Output.create({
      no,
      name, 
      description,
      value,
      document_name: file.filename,
      document_path: file.path,
      milestoneId 
    
    },
  {
    userId: req.user.uuid
  });


    res.status(201).json(output);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.errors[0].message});
  }
};

// Get all Outputs
const getAllOutputs = async (req, res) => {
  const {milestoneId} = req.params
  try {
      const { data: outputs, count } = await ArchiveService.getActiveRecords(
      Output,
      whereClause = {milestoneId},
      {
        include: [ /* …eager loads… */ ],
        order: [['no', 'ASC'] ]
      }
    );
    //  Return the projects
    return res.json({ success: true, count, outputs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one Output by ID
const getOutputById = async (req, res) => {
  try {
    const { id } = req.params;
    const output = await Output.findByPk(id,);
    if (!output) {
      return res.status(404).json({ message: 'Output not found' });
    }
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Output by ID with file upload support
const updateOutputById = async (req, res) => {
  // console.log('Request body:', req.body);
  // console.log('Request files:', req.files);
  
  try {
    const { id } = req.params;
    const { no, name, description, value, milestoneId } = req.body;
    
    // Find the output first
    const output = await Output.findByPk(id);
    if (!output) {
      return res.status(404).json({ message: 'Output not found' });
    }

    // Handle file upload if present
    const fileArray = req.files?.output;
    const file = fileArray?.[0];
    
    // Prepare update data
    const updateData = {
      no,
      name,
      description,
      value,
      milestoneId
    };

    // If a new file is uploaded, update file-related fields
    if (file) {
      updateData.document_name = file.filename;
      updateData.document_path = file.path;
      
      console.log(`New file uploaded: ${file.filename} for output ${id}`);
      
      // Optional: Delete old file if it exists
      if (output.document_path) {
        const fs = require('fs');
        const path = require('path');
        
        try {
          // Check if old file exists and delete it
          if (fs.existsSync(output.document_path)) {
            fs.unlinkSync(output.document_path);
            console.log(`Old file deleted: ${output.document_path}`);
          }
        } catch (fileError) {
          console.error('Error deleting old file:', fileError);
          // Continue with update even if file deletion fails
        }
      }
    }

    // Update the output
    await output.update(updateData,  {
    userId: req.user.uuid
  });
    
    res.status(200).json({
      ...output.toJSON(),
      fileUpdated: !!file
    });
    
  } catch (error) {
    console.error('Error updating output:', error);
    res.status(500).json({ 
      error: error.errors?.[0]?.message || error.message 
    });
  }
};

//approving 
const approveOutput = async (req, res) => {
  try {
    const  uuid  = req.params.id;
    
    // Find the output by UUID
    const output = await Output.findOne({ where: { uuid } });
    if (!output) {
      return res.status(404).json({ message: 'Output not found' });
    }

    // Check if already approved (optional)
    if (output.is_approved) {
      return res.status(400).json({ message: 'Output is already approved' });
    }

    // Update the output to approved
    await output.update({ 
      is_approved: true,
      // approved_at: new Date(), 
      // approved_by: req.user?.uuid 
    });
    
    res.status(200).json({
      message: 'Output approved successfully',
      output: output.toJSON()
    });
    
  } catch (error) {
    console.error('Error approving output:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to approve output'
    });
  }
};

const rejectOutput =async (req, res) =>{
  console.log(req.body)
   try {

    const outputId = req.params.id;
    const { createdBy, reason } = req.body;      
    const actingUserId = req.user.uuid;     



    // 3) Create a notification record
    await UsersNotification.create({
      outputId,           // uuid of the output
      userId:createdBy,             // the original creator (who should be notified)
      message: reason,    // the rejection reason
      isRead: false,
      createdBy: actingUserId,
      updatedBy: actingUserId
    });

    // 4) Reply success
    res.status(200).json({
      success: true,
      message: 'Output rejected and notification sent.'
    });
  } catch (error) {
    console.error('Error rejecting output:', error);
    res.status(500).json({
      error: error.message || 'Failed to reject output'
    });
  }
  
}

const archiveOutputById = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const result = await ArchiveService.archiveRecord(
      Output,
      id,
      req.user?.id,
      reason,
      { source: 'api', ip: req.ip }
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error archiving output:', error);
    return res.status(400).json({
      error: error.message
    });
  }
};



// Soft Delete Output
const deleteOutputById = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const result = await ArchiveService.softDeleteRecord(
      Output,
      id,
      req.user?.id,
      reason,
      { source: 'api', ip: req.ip }
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error deleting output:', error);
    return res.status(400).json({
      error: error.message
    });
  }
};






module.exports = {
  createOutput,
  getAllOutputs,
  getOutputById,
  updateOutputById,
  archiveOutputById,
  deleteOutputById,
  bulkGetOutputs,bulkEditOutputs,
  bulkCreateOutputs,
  approveOutput,
  rejectOutput
};
