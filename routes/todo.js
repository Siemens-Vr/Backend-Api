const {getTodos, createTodos, updateTodo}  =require('../controllers/todo')
const {Router} = require('express')

const router = Router()

router.get('/:id', getTodos)
router.post('/:id', createTodos)
router.patch('/task/:id', updateTodo)



module.exports = router