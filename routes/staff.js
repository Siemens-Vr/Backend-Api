const {Router} = require('express')
const {getStaff,getStaffById} = require('../controllers/staff')

const staffRouter = Router()

staffRouter.get('/', getStaff)
staffRouter.get('/:id', getStaffById)




module.exports = staffRouter;
