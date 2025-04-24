const {Todo} = require('../models')
const express = require('express')
// const models =require('../models')
// console.log(models)

module.exports.getTodos = async (req, res) => {
    const { id } = req.params;
  
    try {
      const todos = await Todo.findAll({
        where: { userId: id },
        order: [['todoDate', 'ASC']]
      });
    
      // Group by todoDate
      const groupedTodos = todos.reduce((acc, todo) => {
        const dateKey = todo.todoDate.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(todo);
        return acc;
      }, {});
  
      res.status(200).json(groupedTodos);
    } catch (error) {
      res.status(500).json({ Error: error.message });
    }
  };



module.exports.createTodos = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const { tasks } = req.body;

  try {
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: 'Tasks should be an array' });
    }

    const todosToCreate = tasks.map(task => ({
      userId:id,
      todo: task.task,
      status: task.status,
      todoDate: task.date,
      
    }));
    console.log(todosToCreate)
    const createdTodos = await Todo.bulkCreate(todosToCreate);

    res.status(201).json(createdTodos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 'Error': error.message });
  }
};


module.exports.updateTodo = async (req, res) => {
    const uuid = req.params.id;
    const { status } = req.body;

    try {
        const todo = await Todo.findByPk(uuid); // await here

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        todo.status = status;
        await todo.save(); // save the updated instance

        return res.status(200).json({ message: "Todo status updated", todo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports.updateTodos =async(req, res) =>{
  try {
    
  } catch (error) {
    
  }
}

