// Admin Controller for dashboard and user management
const AdminService = require('../services/admin.service');

class AdminController {
  async getDashboardStats(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AdminController();
// Add new user (admin only)
const addUser = async (req, res) => {
  try {
    const { fullName, email, contact, nic, passwordHash, role } = req.body;
    if (!fullName || !email || !contact || !passwordHash || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const user = await adminService.addUser({ fullName, email, contact, nic, passwordHash, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Edit user (admin only)
const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const user = await adminService.editUser(userId, updates);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await adminService.deleteUser(userId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const Guide = require('../models/guide.model');

// Middleware to check admin role
function requireAdmin(req, res, next) {
  // Example: req.user.role === 'admin' (assumes JWT auth and user attached to req)
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
}

// Get dashboard stats
async function getStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const totalGuides = await Guide.countDocuments();
    const pendingVendors = await Vendor.countDocuments({ status: 'pending' });
    const pendingGuides = await Guide.countDocuments({ status: 'pending' });
    res.json({ totalUsers, totalVendors, totalGuides, pendingVendors, pendingGuides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// List pending vendors
async function listPendingVendors(req, res) {
  try {
    const vendors = await Vendor.find({ status: 'pending' });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// List pending guides
async function listPendingGuides(req, res) {
  try {
    const guides = await Guide.find({ status: 'pending' });
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Approve user (vendor or guide)
async function approveUser(req, res) {
  try {
    const { id, type } = req.params; // type: 'vendor' or 'guide'
    let doc;
    if (type === 'vendor') {
      doc = await Vendor.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    } else if (type === 'guide') {
      doc = await Guide.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Reject user (vendor or guide)
async function rejectUser(req, res) {
  try {
    const { id, type } = req.params;
    let doc;
    if (type === 'vendor') {
      doc = await Vendor.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    } else if (type === 'guide') {
      doc = await Guide.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// View details
async function viewUser(req, res) {
  try {
    const { id, type } = req.params;
    let doc;
    if (type === 'vendor') {
      doc = await Vendor.findById(id);
    } else if (type === 'guide') {
      doc = await Guide.findById(id);
    } else if (type === 'user') {
      doc = await User.findById(id);
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Add new vendor
async function addVendor(req, res) {
  // ...implementation (similar to registration, but admin can set status)
  res.status(501).json({ error: 'Not implemented' });
}

// Add new guide
async function addGuide(req, res) {
  // ...implementation (similar to registration, but admin can set status)
  res.status(501).json({ error: 'Not implemented' });
}

const adminService = require('../services/admin.service');

const getAllUsers = async (req, res) => {
  try {
    const filters = { role: req.query.role, status: req.query.status };
    const users = await adminService.getAllUsers(filters);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await adminService.getUserDetails(req.params.userId);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { profileId, role } = req.params;
    const { newStatus } = req.body;
    console.log('[updateUserStatus] role:', role, 'profileId:', profileId, 'newStatus:', newStatus);
    if (!['vendor', 'guide'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be vendor or guide.' });
    }
    if (!profileId || profileId.length !== 24) {
      return res.status(400).json({ message: 'Invalid profileId.' });
    }
    if (!['approved', 'rejected', 'pending'].includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid newStatus.' });
    }
    const result = await adminService.updateUserStatus(profileId, role, newStatus);
    res.json(result);
  } catch (err) {
    console.error('[updateUserStatus] error:', err);
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  requireAdmin,
  getStats,
  listPendingVendors,
  listPendingGuides,
  approveUser,
  rejectUser,
  viewUser,
  addVendor,
  addGuide,
  addUser,
  editUser,
  deleteUser,
};
