const {Cost_cat_entries_files,Cost_cat_entries_folders,Cost_category_table} = require('../models')



module.exports.getFolders = async(req, res)=>{
    const {uuid} = req.params
    try{
        const folders = await Cost_cat_entries_folders.findAll({where:{cost_category_entry_id: uuid}})
         res.status(200).json(folders)
    }catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}


module.exports.createFolders =async(req,res) =>{
    const cost_category_entry_id = req.params.uuid
    const {folderName} =req.body

    console.log(folderName, cost_category_entry_id)
    try{
        const folder = await Cost_cat_entries_folders.create({folderName , cost_category_entry_id})

        res.status(200).json(folder)

    }catch(error){
        res.status(500).json({message: "Internal server error", error:error})  
    }
}


//     console.log(req.params)
//     const {  cost_category_folder_id, cost_category_entry_id } = req.params;
//     const file = req.file;  
//     console.log(req.params)
//     console.log(file)
  
//     // if (!file) return res.status(400).json({ error: 'No file uploaded' });
  
//     try {
  
//       let cost_category_entry_id = null;
//       let cost_category_folder_id = null;
  
//       if (cost_category_entry_id) {
//         const cost_cat_entry = await Cost_category_table.findOne({ where: { uuid: cost_category_entry_id } });
//         if (!cost_cat_entry) return res.status(404).json({ error: 'cost category entry not found' });
//         cost_category_entry_id = cost_cat_entry.uuid;
  
//         if (cost_category_folder_id) {
//           const folder = await Cost_cat_entries_folders.findOne({ where: { uuid: cost_category_folder_id } });
//           if (!folder) return res.status(404).json({ error: 'folder not found' });
//           cost_category_folder_id = folder.uuid;
//         }
//       }
  
//       // Create the document for the single file uploaded
//       const newFile = await Cost_cat_entries_files.create({
//         cost_category_entry_id,
//         cost_category_folder_id,
//         path: file.path,
//         name: file.filename,
//       }, );
  
//       console.log("File uploaded successfully:", newFile);
  
//       res.status(201).json({ message: 'File uploaded  successfully', newFile });
//     } catch (error) {
//       console.error('Error creating document:', error);
//       res.status(500).json({ error: 'Failed to upload file' });
//     }
//   };


module.exports.createFiles = async (req, res) => {
    const {
      cost_category_entry_id: entryId,
      cost_category_folder_id: folderId
    } = req.params;
    const {uuid } = req.params
  
    const fileArray = req.files?.cost_category;

    const file  = fileArray?.[0];

   
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    try {
      // 1. Validate entry if provided
      let cost_category_entry_id = null;
      if (uuid) {
        const entry = await Cost_category_table.findByPk(uuid);
        if (!entry) {

            let cost_category_folder_id = null;
            if (folderId) {
              const folder = await Cost_cat_entries_folders.findByPk(folderId);
              // if (!folder) {
              //   return res.status(404).json({ error: 'Folder not found' });
              // }
              cost_category_folder_id = folder.uuid;
            }
            

          return res.status(404).json({ error: 'Cost category entry not found' });
        }
        cost_category_entry_id = entry.uuid;     

        
      }
  
      // 2. Validate folder if provided
 
  
      // 3. Create the file record
      const newFile = await Cost_cat_entries_files.create({
        cost_category_entry_id:  entryUuid,
        cost_category_folder_id: folderUuid,
        path:                    file.path,
        name:                    file.filename,
      });
  
      console.log('File uploaded successfully:', newFile.uuid);
      return res
        .status(201)
        .json({ message: 'File uploaded successfully', newFile });
  
    } catch (error) {
      console.error('Error creating file:', error);
      return res.status(500).json({ error: 'Failed to upload file' });
    }
  };
  