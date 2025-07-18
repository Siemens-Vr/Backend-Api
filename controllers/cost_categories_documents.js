const {Cost_cat_entries_files,Cost_cat_entries_folders,Cost_category_table} = require('../models')



module.exports.getFolders = async (req, res) => {
    const { uuid } = req.params;
    if (!uuid) {
      return res.status(400).json({ 
        error: 'UUID parameter is required' 
      });
    }
  
    try {
    
      const entryExists = await Cost_category_table.findByPk(uuid);
      if (!entryExists) {
        return res.status(404).json({ 
          error: 'Cost category entry not found' 
        });
      }
  
      
      const [folders, documents] = await Promise.all([
        Cost_cat_entries_folders.findAll({
          where: { cost_category_entry_id: uuid },
          order: [['createdAt', 'ASC']]
        }),
        Cost_cat_entries_files.findAll({
          where: { cost_category_entry_id: uuid },
          order: [['createdAt', 'ASC']] 
        })
      ]);
  
      console.log(`Found ${folders.length} folders and ${documents.length} documents for entry ${uuid}`);
  
      return res.status(200).json({
        success: true,
        data: {
          folders,
          documents
        },
        count: {
          folders: folders.length,
          documents: documents.length
        }
      });
  
    } catch (error) {
      console.error('Error fetching folders and documents:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to fetch folders and documents'
      });
    }
  };

module.exports.getFolderDocuments = async(req, res)=>{
    const {uuid} = req.params
    try{
        const documents = await Cost_cat_entries_files.findAll({where:{cost_category_entry_id: uuid}})
         res.status(200).json(documents)
    }catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}


module.exports.createFolders =async(req,res) =>{
    const cost_category_entry_id = req.params.uuid
    const {folderName} =req.body

    // console.log(folderName, cost_category_entry_id)
    try{
        const folder = await Cost_cat_entries_folders.create(
          { folderName , cost_category_entry_id },
          { userId:req.user.uuid }
        )

        res.status(200).json(folder)

    }catch(error){
        res.status(500).json({message: "Internal server error", error:error})  
    }
}

module.exports.updateFolder = async (req, res) => {
    const { uuid } = req.params;
    const { folderName } = req.body;
  

  
    if (!folderName || folderName.trim() === '') {
      return res.status(400).json({ 
        error: 'Folder name is required' 
      });
    }
  
    try {
      // Check if folder exists
      const folder = await Cost_cat_entries_folders.findByPk(uuid);
      if (!folder) {
        return res.status(404).json({ 
          error: 'Folder not found' 
        });
      }
  
      // Update the folder
      const updatedFolder = await folder.update({
        folderName: folderName.trim()
      },
    { userId:req.user.uuid }
  );
  
      console.log('Folder updated successfully:', updatedFolder.uuid);
      
      return res.status(200).json({
        success: true,
        message: 'Folder updated successfully',
        data: updatedFolder
      });
  
    } catch (error) {
      console.error('Error updating folder:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to update folder'
      });
    }
  };
  


module.exports.createFiles = async (req, res) => {
    const { uuid } = req.params;
    
    const fileArray = req.files?.cost_category;
    const file = fileArray?.[0];
  
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    try {
      let cost_category_entry_id = null;
      let cost_category_folder_id = null;
  
      if (uuid) {
        const entry = await Cost_category_table.findByPk(uuid);
        
        if (entry) {
          cost_category_entry_id = entry.uuid;
          console.log('Found cost category entry with UUID:', uuid);
        } else {
       
          const folder = await Cost_cat_entries_folders.findByPk(uuid);
          
          if (folder) {
            cost_category_folder_id = folder.uuid;
            console.log('Found cost category folder with UUID:', uuid);
          } else {
            return res.status(404).json({ error: 'UUID not found in entries or folders' });
          }
        }
      }
  
      
      const newFile = await Cost_cat_entries_files.create({
        cost_category_entry_id: cost_category_entry_id,
        cost_category_folder_id: cost_category_folder_id,
        path: file.path,
        name: file.filename,
      },
      { userId:req.user.uuid }
    );
  
      console.log('File uploaded successfully:', newFile.uuid);
      return res
        .status(201)
        .json({ message: 'File uploaded successfully', newFile });
  
    } catch (error) {
      console.error('Error creating file:', error);
      return res.status(500).json({ error: 'Failed to upload file' });
    }
  };

module.exports.getFiles =async(req, res)=>{

    const {uuid} =req.params

    try{
        const documents  = await Cost_cat_entries_files.findAll({where:{cost_category_folder_id:uuid}})
        res.status(200).json(documents)

    }catch(error){
        console.error('Error fetching documents:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to  documents'
      });

    }

  }
  