const { Router } = require('express');
const router = Router();
const { createProject, getProjectById, getAllProjects,updateProject,archiveProjectById  } = require('../controllers/project'); 
const upload = require('../middleware/uploadMiddleware'); 
const {authenticateJwt}  =require('../middleware/auth')


router.post('/',  createProject);
router.get('/:uuid', getProjectById);
router.get('/', getAllProjects);
router.post('/update/:uuid',  updateProject);
router.post('/:id/archive', authenticateJwt, archiveProjectById);



module.exports = router;
