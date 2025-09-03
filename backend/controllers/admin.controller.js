// Dashboard stats endpoint
const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    // Map backend keys to frontend expected keys
    res.json({
      totalUsers: stats.touristCount + stats.vendorUserCount + stats.guideUserCount + stats.adminCount,
      totalVendors: stats.vendorCount,
      totalGuides: stats.guideCount,
      totalTourists: stats.touristCount,
      ...stats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pending approvals endpoint
const getPendingApprovals = async (req, res) => {
  try {
    // Get all users with pending vendor/guide profiles
    const users = await adminService.getAllUsers();
    const pending = users.filter(u => u.profile && u.profile.status === 'pending');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Add new user (admin only)
const addUser = async (req, res) => {
  try {
    const user = await adminService.addUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Edit user (admin only)
const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await adminService.editUser(userId, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await adminService.deleteUser(userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const adminService = require('../services/admin.service');

// Get all users with optional filters
const getAllUsers = async (req, res) => {
  try {
    const filters = { role: req.query.role, status: req.query.status };
    const users = await adminService.getAllUsers(filters);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single user's details
const getUserDetails = async (req, res) => {
  try {
    const user = await adminService.getUserDetails(req.params.userId);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update status for vendor/guide profile
const updateUserStatus = async (req, res) => {
  try {
    const { profileId, role } = req.params;
    const { newStatus } = req.body;
    const result = await adminService.updateUserStatus(profileId, role, newStatus);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  addUser,
  editUser,
  deleteUser,
  getDashboardStats,
  getPendingApprovals,
};
