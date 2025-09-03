<<<<<<< HEAD
// Admin routes for dashboard
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');

router.get('/dashboard', AdminController.getDashboardStats);
=======
const express = require('express');
const router = express.Router();

const { getAllUsers, getUserDetails, updateUserStatus, addUser, editUser, deleteUser } = require('../controllers/admin.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');

router.use(auth, isAdmin);

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.put('/profiles/:role/:profileId/status', updateUserStatus);

// Admin add, edit, delete user
router.post('/users', addUser);
router.put('/users/:userId', editUser);
router.delete('/users/:userId', deleteUser);
>>>>>>> backend-dev

module.exports = router;
