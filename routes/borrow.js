const { getBorrowers, postBorrowers,updateBorrowedComponents, getBorrowedComponentById,getBorrowersByComponent} = require('../controllers/borrow')

const {Router} = require('express')

const borrowRouter = Router();


borrowRouter.get('/', getBorrowers);
borrowRouter.post('/', postBorrowers);
borrowRouter.get('/:id', getBorrowedComponentById);
borrowRouter.patch('/:id/update', updateBorrowedComponents);
borrowRouter.get('/', getBorrowersByComponent);





module.exports = borrowRouter;