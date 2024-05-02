const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create a new user
router.post('/create', userController.createUser);

// Get all users
router.get('/list', userController.getAllUsers);

// Get a single user by ID
router.get('/users/:id', userController.getUserById);

// Update a user by ID
router.put('/update/:id', userController.updateUserById);

// Delete a user by ID
router.delete('/users/:id', userController.deleteUserById);

module.exports = router;
