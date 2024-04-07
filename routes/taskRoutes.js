// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task'); 
const router = express.Router();


// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get a Single Task based on the ID of the task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category, // Add category field
    priority: req.body.priority, // Add priority field
    targetCompletionDate : req.body.targetCompletionDate,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Update a task
  router.patch('/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (task == null) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      // Update fields if provided in request body
      if (req.body.title != null) {
        task.title = req.body.title;
      }
      if (req.body.description != null) {
        task.description = req.body.description;
      }
      if (req.body.completed != null) {
        task.completed = req.body.completed;
      }
      if (req.body.category != null) {
        task.category = req.body.category;
      }
      if (req.body.priority != null) {
        task.priority = req.body.priority;
      }
      if(req.body.targetCompletionDate != null) {
        task.targetCompletionDate = req.body.targetCompletionDate;
      }
      if(req.body.completed != null) {
        task.completed = req.body.completed;
      }
      
      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch('/:id/priority', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (req.body.priority == null) {
      return res.status(400).json({ message: 'Priority is required' });
    }
    task.priority = req.body.priority;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
