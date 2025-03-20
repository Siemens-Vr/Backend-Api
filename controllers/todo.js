const { Todo } = require('../models');

// Create a new Todo
module.exports.createTodo = async (req, res) => {
  try {
    const { userUUID } = req.params; // Get userUUID from URL params
    const { description, dueDate, isCompleted } = req.body;

    if (!dueDate) {
      return res.status(400).json({ error: 'dueDate is required.' });
    }

    const newTodo = await Todo.create({
      userUUID,
      description,
      dueDate,
      isCompleted: isCompleted || false,
    });

    return res.status(201).json(newTodo);

  } catch (error) {
    console.error('Error creating Todo:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all Todos for a specific user
module.exports.getTodo = async (req, res) => {
  try {
    const { userUUID } = req.params; // Get userUUID from URL params

    const todos = await Todo.findAll({
      where: { userUUID },
      order: [['createdAt', 'DESC']],
    });

    if (!todos.length) {
      return res.status(404).json({ message: 'No Todos found for this user.' });
    }

    return res.status(200).json(todos);
    
  } catch (error) {
    console.error('Error fetching Todos:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a Todo by ID for a specific user
module.exports.updateTodo = async (req, res) => {
  try {
    const { userUUID, id } = req.params; // Get userUUID and id from URL params
    const { description, dueDate, isCompleted } = req.body;

    const todo = await Todo.findOne({ where: { id, userUUID } });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found for this user.' });
    }

    await todo.update({
      description: description || todo.description,
      dueDate: dueDate || todo.dueDate,
      isCompleted: isCompleted !== undefined ? isCompleted : todo.isCompleted,
    });

    return res.status(200).json(todo);
  } catch (error) {
    console.error('Error updating Todo:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Todo by ID for a specific user
module.exports.deleteTodo = async (req, res) => {
  try {
    const { userUUID, id } = req.params; // Get userUUID and id from URL params

    const todo = await Todo.findOne({ where: { id, userUUID } });

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
