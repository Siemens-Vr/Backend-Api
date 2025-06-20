const express = require('express');
const router = express.Router();
const { createSubFolder,getSubFolders,getSubFolderData,updateSubFolder,deleteSubFolder} = require('../controllers/subFolder');


router.post('/:outputId/:folderId', createSubFolder);
router.get('/:folderId', getSubFolders);
router.get('/:folderUuid/:subFolderUuid ', getSubFolderData);
router.post('/:subFolderId', updateSubFolder);
router.delete('/:subFolderId', deleteSubFolder);

module.exports = router;
