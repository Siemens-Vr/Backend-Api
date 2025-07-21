const { Router } = require('express');
const router = Router();
const {create, getByProject, getByUser} = require('../controllers/personnel')
const { createProject, getProjectById, getAllProjects,updateProject,archiveProjectById  } = require('../controllers/project'); 



router.post('/',  createProject);
router.get('/:uuid', getProjectById);
router.get('/', getAllProjects);
router.post('/update/:uuid',  updateProject);
router.post('/:id/archive', archiveProjectById);

//Personnel routes

router.get('/personnel/user', getByUser)

router.post('/personnel/:uuid', create)
router.get('/personnel/:uuid', getByProject )



module.exports = router;
