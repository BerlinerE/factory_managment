const express = require('express');
const usersBLL = require('../BLL/usersBLL');
const router = express.Router();
const { authenticateToken, isAuthenticated } = require('../middleware/middleRoute');


//Get all users
router.route('/').get( authenticateToken, isAuthenticated,async (req, res) => {
  const users = await usersBLL.getAllUsers();
  res.json(users);
});

// Get user by ID
router.route('/:id').get( authenticateToken, isAuthenticated,async (req, res) => {
  const { id } = req.params;
  const user = await usersBLL.getUserById(id);
  res.json(user);
});

// Add a new User
router.route('/').post( authenticateToken, isAuthenticated,async (req, res) => {
  const obj = req.body;
  const result = await usersBLL.addUser(obj);
  res.status(201).json(result);
});

module.exports = router;
