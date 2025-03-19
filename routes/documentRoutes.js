const express = require('express');
const router = express.Router();
const {
  createDocument,
  updateDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentsInSubfolder,
  getAllDocumentsAndFolders,
  deleteDocument
} = require('../controllers/documents');
const upload = require('../middleware/uploadMiddleware');

// Create document
router.post('/:outputUuid/:folderUuid?/:subFolderUuid?', upload.single('file'), createDocument);
// router.post('/:outputUuid/folders/:folderUuid', upload.single('file'), createDocument);
// router.post('/:outputUuid/folders/:folderUuid/subfolders/:subFolderUuid', upload.single('file'), createDocument);
router.put('/:outputUuid/:documentUuid/:folderUuid?/:subFolderUuid?', upload.single('file'), updateDocument);
router.get('/:outputUuid/folders', getAllDocumentsAndFolders);
router.get('/:outputUuid/:folderUuid?', getAllDocuments);
// router.get('/:outputUuid/:subFolderUuid', getDocumentsInSubfolder);
router.get('/:outputUuid/:folderUuid/:subFolderUuid', getDocumentsInSubfolder);

// router.get('/:outputUuid', getAllDocumentsAndFolders);
// router.get('/:outputUuid/folders/:folderUuid/subfolders/:subFolderUuid', getAllDocuments);
router.get('/:outputUuid/:documentUuid', getDocumentById);
router.delete('/:outputUuid/:documentUuid/:folderUuid?/:subFolderUuid?', deleteDocument);

module.exports = router;