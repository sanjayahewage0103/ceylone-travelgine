// Product statistics for dashboard
const Product = require('../models/product.model');
const getProductStats = async (req, res) => {
  try {
    // Count by approval status
    const statusCounts = await Product.aggregate([
      { $group: { _id: '$isApproved', count: { $sum: 1 } } }
    ]);
    // Count by category (approved only)
    const categoryCounts = await Product.aggregate([
      { $match: { isApproved: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    // Count by active/inactive (approved only)
    const activeCounts = await Product.aggregate([
      { $match: { isApproved: 'approved' } },
      { $group: { _id: '$isActive', count: { $sum: 1 } } }
    ]);
    res.json({
      statusCounts,
      categoryCounts,
      activeCounts
    });
  } catch (err) {
    console.error('getProductStats error:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};
// Get all products (approved, rejected, pending)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate({
      path: 'vendorId',
      select: 'shopName businessRegNum location address userId',
      populate: { path: 'userId', select: 'fullName email contact' }
    });
    console.log('DEBUG getAllProducts:', JSON.stringify(products, null, 2));
    res.json(products);
  } catch (err) {
    console.error('getAllProducts error:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};


// Get all pending products with optional search/filter
const getPendingProducts = async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;
    const query = { isApproved: 'pending' };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    const products = await Product.find(query).populate({
      path: 'vendorId',
      select: 'shopName businessRegNum location address userId',
      populate: { path: 'userId', select: 'fullName email contact' }
    });
    console.log('DEBUG getPendingProducts:', JSON.stringify(products, null, 2));
    res.json(products);
  } catch (err) {
    console.error('getPendingProducts error:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

// Approve or reject a product
const setProductApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    if (!['approve', 'reject'].includes(action)) return res.status(400).json({ message: 'Invalid action' });
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isApproved = action === 'approve' ? 'approved' : 'rejected';
    await product.save();
    res.json(product);
  } catch (err) {
    console.error('setProductApproval error:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};
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
    console.error('getDashboardStats error:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
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
    console.error('getPendingApprovals error:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};
// Add new user (admin only)
const addUser = async (req, res) => {
  try {
    const user = await adminService.addUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error('addUser error:', err);
    res.status(400).json({ message: err.message, stack: err.stack });
  }
};

// Edit user (admin only)
const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await adminService.editUser(userId, req.body);
    res.json(user);
  } catch (err) {
    console.error('editUser error:', err);
    res.status(400).json({ message: err.message, stack: err.stack });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await adminService.deleteUser(userId);
    res.json(result);
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(400).json({ message: err.message, stack: err.stack });
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
    console.error('getAllUsers error:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

// Get a single user's details
const getUserDetails = async (req, res) => {
  try {
    const user = await adminService.getUserDetails(req.params.userId);
    res.json(user);
  } catch (err) {
    console.error('getUserDetails error:', err);
    res.status(404).json({ message: err.message, stack: err.stack });
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
    console.error('updateUserStatus error:', err);
    res.status(400).json({ message: err.message, stack: err.stack });
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
  getPendingProducts,
  setProductApproval,
  getAllProducts,
  getProductStats,
};
