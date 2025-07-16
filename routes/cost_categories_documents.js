const {getFolders, createFolders, createFiles, getFiles} = require('../controllers/cost_categories_documents')
const express = require('express')
const {upload} = require('../middleware/fileUploadMiddleware');

const router = express.Router()


router.get('/:uuid' , getFolders )
router.post('/:uuid' , createFolders )

router.post('/file/:uuid', upload, createFiles);
router.get('/files/:uuid', getFiles);


module.exports = router


