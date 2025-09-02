// AdminService: Singleton for dashboard stats and pending approvals
const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const Guide = require('../models/guide.model');

class AdminService {
  async getDashboardStats() {
    const totalUsers = await User.countDocuments();
    const activeVendors = await User.countDocuments({ role: 'vendor', status: 'approved' });
    const activeGuides = await User.countDocuments({ role: 'guide', status: 'approved' });
    const pendingApprovals = await User.find({ status: 'pending', role: { $in: ['vendor', 'guide'] } })
      .select('fullName role dateSubmitted');
    // Role distribution for chart
    const roleCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    return {
      totalUsers,
      activeVendors,
      activeGuides,
      pendingApprovals,
      roleCounts
    };
  }
}

module.exports = new AdminService();
