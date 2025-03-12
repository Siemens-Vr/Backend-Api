const { Router } = require('express');
const { upload } = require('../middleware/fileUploadMiddleware');


const { 
  getProcurements, 
  createProcurement, 
  getProcurementById, 
  search, 
  filter,
  updateProcurement, 
  deleteProcurement 
} = require('../controllers/procurement');

const procurementRouter = Router();

procurementRouter.get('/:outputId', getProcurements);
procurementRouter.post('/:outputId', upload, createProcurement);
procurementRouter.get('/:outputId/:id', getProcurementById);
// procurementRouter.get('/search', search);                       //underway
procurementRouter.get('/filter-procurements', filter)
procurementRouter.patch('/:id/update',upload, updateProcurement);
procurementRouter.delete('/output/:id/delete', deleteProcurement);

module.exports = procurementRouter;

