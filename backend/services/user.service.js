// UserService: Singleton for user management and approval workflow
const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const Guide = require('../models/guide.model');

class UserService {
  async getAllUsers(filters) {
    const query = {};
    if (filters.search) {
      query.$or = [
        { fullName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }
    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;
    return await User.find(query).select('fullName email role status');
  }

  async getUserDetails(userId, opts = { lean: true }) {
    let user;
    if (opts.lean) {
      user = await User.findById(userId).lean();
    } else {
      user = await User.findById(userId);
    }
    if (!user) throw new Error('User not found');
    if (user.role === 'vendor') {
      const vendor = await Vendor.findOne({ userId });
      user.vendorProfile = vendor;
    } else if (user.role === 'guide') {
      const guide = await Guide.findOne({ userId });
      user.guideProfile = guide;
    }
    return user;
  }

  async updateUserStatus(userId, status) {
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
    if (!user) throw new Error('User not found');
    return user;
  }
}

module.exports = new UserService();
