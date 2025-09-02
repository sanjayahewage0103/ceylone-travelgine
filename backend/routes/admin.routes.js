// Admin routes for dashboard
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');

router.get('/dashboard', AdminController.getDashboardStats);

module.exports = router;
