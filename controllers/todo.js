const { Todo } = require('../models');
const { Op } = require('sequelize');


// Create a new Todo
module.exports.createTodo = async (req, res) => {
  try {
    const { userId } = req.params; 
    const { description, createdDate } = req.body;
    console.log(req.body)

    if (!createdDate) {
      return res.status(400).json({ error: 'createdDate is required.' });
    }

    const newTodo = await Todo.create({
      userUUID: userId,
      description,
      createdDate,
      isCompleted: false, // Default to false
    });

    // Ensure the response always includes isCompleted as false
    return res.status(201).json({ ...newTodo.toJSON(), isCompleted: false });

  } catch (error) {
    console.error('Error creating Todo:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get all Todos for a specific user
module.exports.getTodos = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params
    const { date } = req.query; // Get date from query parameters

    const whereClause = { userUUID:userId };

    // If a date is provided, filter by that date
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.createdAt = { [Op.between]: [startOfDay, endOfDay] };
    }

    const todos = await Todo.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    if (!todos.length) {
      return res.status(404).json({ message: 'No Todos found for this user on the specified date.' });
    }

    return res.status(200).json(todos);

  } catch (error) {
    console.error('Error fetching Todos:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get a single todo
module.exports.getTodo=async (req,res)=>{
 
  const {todoId}=req.params
    try {

      if(!todoId){
        res.status(404).json({message:"the id is not found"})
      }


      const todo=await Todo.findByPk(todoId)
      res.status(200).json({message:"successfully found", todo})

      
    } catch (error) {
      return res.status(500).json({message:"Error finding todo", error})
      
    }
}

// Update a Todo by ID for a specific user
module.exports.updateTodo = async (req, res) => {
  try {
    const { userId, todoId } = req.params;
    const { description, createdDate } = req.body;

    // Find the Todo item for the specified user
    const todo = await Todo.findOne({ where: { id: todoId, userUUID: userId } });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found for this user.' });
    }

    // Create an object with only the modified fields
    const updatedFields = {};

    if (description !== undefined && description !== todo.description) {
      updatedFields.description = description;
    }

    if (createdDate !== undefined && createdDate !== todo.createdDate) {
      updatedFields.createdDate = createdDate;
    }

    // Update the Todo if there are changes
    if (Object.keys(updatedFields).length > 0) {
      await todo.update(updatedFields);
    }

    return res.status(200).json(todo);

  } catch (error) {
    console.error('Error updating Todo:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Delete a Todo by ID for a specific user
module.exports.deleteTodo = async (req, res) => {
  try {
    const { userId, todoId } = req.params;

    const todo = await Todo.findOne({ where: { id: todoId, userUUID: userId } });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found for this user.' });
    }

    await todo.destroy();

    return res.status(200).json({ message: 'Todo deleted successfully.' });

  } catch (error) {

    console.error('Error deleting Todo:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
