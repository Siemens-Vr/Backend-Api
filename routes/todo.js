const express=require('express')
const router=express.Router();

const {createTodo,getTodos,getTodo,updateTodo,deleteTodo}=require('../controllers/todo');
 

// Router to create all the todo
router.post('/:userId/create', createTodo)
router.get('/:userId', getTodos)
router.get('/:userId/:todoId', getTodo)

router.patch('/:userId/:todoId/update', updateTodo)
router.delete('/:userId/:todoId/delete', deleteTodo)

module.exports=router


