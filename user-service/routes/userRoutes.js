const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Register new user
router.post('/register', userController.register);

// User login
router.post('/login', userController.login);

// Get user profile
router.get('/:id', userController.getProfile);

// Update user profile
router.put('/:id', userController.updateProfile);

// Update password
router.patch('/:id/password', userController.updatePassword);

module.exports = router;