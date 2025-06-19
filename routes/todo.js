const {getTodos, createTodos, updateTodo, updateTodos}  =require('../controllers/todo')
const {Router} = require('express')

const router = Router()

router.get('/:id', getTodos)
router.post('/:id', createTodos)
router.post('/task/:id', updateTodo)
router.post('/task/:id', updateTodos)



module.exports = router