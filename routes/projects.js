const { Router } = require('express');
const router = Router();
const { createProject, getProjectById, getAllProjects,updateProject,deleteProject } = require('../controllers/project'); 
const upload = require('../middleware/uploadMiddleware'); 


router.post('/',  createProject);
router.get('/:uuid', getProjectById);
router.get('/', getAllProjects);
router.post('/update/:uuid',  updateProject);
router.get('/delete/:uuid', deleteProject );

module.exports = router;
