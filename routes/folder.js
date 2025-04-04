const express = require('express');
const router = express.Router();
const {createFolder,getFolders,getFolderData,updateFolder,deleteFolder} = require('../controllers/folder');


router.post('/:id', createFolder);
router.get('/:id', getFolders);
router.get('/folder/:folderId', getFolderData);    //
router.post('/update/:folderId', updateFolder);
router.delete('/:folderId', deleteFolder);

module.exports = router;
