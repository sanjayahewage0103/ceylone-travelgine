// User routes for user management and approval workflow
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUserDetails);
router.patch('/:userId/status', UserController.updateUserStatus);

module.exports = router;
