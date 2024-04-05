// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all Users
router.get('/', async (req, res) => {
  try {
    const users =  await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new User
router.post('/', async  (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a user
router.patch('/:id', async (req, res) => {
  try {
    const user =  await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.password != null) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
