const express = require('express');
const router = express.Router();

const { getAllUsers, getUserDetails, updateUserStatus, addUser, editUser, deleteUser, getDashboardStats, getPendingApprovals } = require('../controllers/admin.controller');

// Dashboard endpoints
router.get('/stats', getDashboardStats);
router.get('/pending', getPendingApprovals);
const { auth, isAdmin } = require('../middleware/auth.middleware');


// All admin routes must be protected by both auth and isAdmin
router.use(auth, isAdmin);



router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.put('/profiles/:role/:profileId/status', updateUserStatus);

// Admin add, edit, delete user
router.post('/users', addUser);
router.put('/users/:userId', editUser);
router.delete('/users/:userId', deleteUser);

module.exports = router;
