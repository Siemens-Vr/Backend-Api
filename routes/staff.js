const {Router} = require('express')
const {getStaff} = require('../controllers/staff')

const staffRouter = Router()

staffRouter.get('/', getStaff)




module.exports = staffRouter;
