const express=require('express')
const router=express.Router();

const {createTodo,getTodo,updateTodo,deleteTodo}=require('../controllers/todo');
 

// Router to create all the todo
router.post('/', createTodo)
router.get('/', getTodo)
router.patch('/update', updateTodo)
router.delete('/delete', deleteTodo)

module.exports=router


