const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { requireAdmin } = adminController;

// Dashboard stats
router.get('/stats', requireAdmin, adminController.getStats);
// Pending vendors/guides
router.get('/pending-vendors', requireAdmin, adminController.listPendingVendors);
router.get('/pending-guides', requireAdmin, adminController.listPendingGuides);
const { getAllUsers, getUserDetails, updateUserStatus } = require('../controllers/admin.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');

router.use(auth, isAdmin);

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.put('/profiles/:role/:profileId/status', updateUserStatus);

module.exports = router;

module.exports = router;
