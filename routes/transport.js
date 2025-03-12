const { Router } = require('express');
const { upload } = require('../middleware/fileUploadMiddleware');
const {createTransport, getTransports,getTransportById,search,updateTransport,deleteTransport} = require('../controllers/transport')


const transportRouter = Router()

transportRouter.get('/:outputId', getTransports)           //
transportRouter.post('/:outputId', upload, createTransport) //
transportRouter.get('/output/:id', getTransportById)       //
transportRouter.get('/search', search)
transportRouter.patch('/:id/update', upload, updateTransport)   //
transportRouter.delete('/:id/delete', deleteTransport) //


module.exports = transportRouter