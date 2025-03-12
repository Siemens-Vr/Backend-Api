const { Router } = require('express');
const { upload } = require('../middleware/fileUploadMiddleware');
const {createReports,getReports, getRecordById, updateReport, deleteProcurement} = require('../controllers/report')


const reportRouter = Router()

reportRouter.get('/:outputId', getReports)
reportRouter.post('/:outputId', upload, createReports)
reportRouter.get('/output/:id',  getRecordById)
reportRouter.patch('/:id/update', upload, updateReport)
reportRouter.delete('/:id/delete', deleteProcurement)


module.exports = reportRouter