const {getFolders, createFolders, createFiles} = require('../controllers/cost_categories_documents')
const express = require('express')
const {upload} = require('../middleware/fileUploadMiddleware');

const router = express.Router()


router.get('/:uuid' , getFolders )
router.post('/:uuid' , createFolders )

router.post('/file/:cost_category_entry_id?/:cost_category_folder_id?', upload, createFiles);


module.exports = router


