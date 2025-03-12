const { Router } = require('express');
const { createPhase, getPhaseById, getAllPhases, updatePhase, deletePhase } = require('../controllers/phases'); 

const router = Router();

router.post('/:uuid', createPhase);           
router.get('/:uuid', getAllPhases);           
router.get('/:uuid/:phaseId', getPhaseById);  
router.put('/:uuid/:phaseId', updatePhase);   
router.delete('/:uuid/:phaseId', deletePhase); 

module.exports = router;
