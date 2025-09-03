const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const Guide = require('../models/guide.model');
// const NotificationService = require('./notification.service'); // Stub for notifications

class AdminService {
  async getAllUsers(filters = {}) {
    const query = {};
    if (filters.role) query.role = filters.role;
    const users = await User.find(query).lean();

    // Populate vendor/guide profiles
    const userIds = users.map(u => u._id);
    const vendors = await Vendor.find({ userId: { $in: userIds } }).lean();
    const guides = await Guide.find({ userId: { $in: userIds } }).lean();

    // Attach profiles
    return users.map(user => {
      let profile = null;
      if (user.role === 'vendor') profile = vendors.find(v => v.userId.toString() === user._id.toString());
      if (user.role === 'guide') profile = guides.find(g => g.userId.toString() === user._id.toString());
      return { ...user, profile };
    });
  }

  async getUserDetails(userId) {
    const user = await User.findById(userId).lean();
    if (!user) throw new Error('User not found');
    let profile = null;
    if (user.role === 'vendor') profile = await Vendor.findOne({ userId }).lean();
    if (user.role === 'guide') profile = await Guide.findOne({ userId }).lean();
    return { ...user, profile };
  }

  async updateUserStatus(profileId, role, newStatus) {
    let profileModel;
    if (role === 'vendor') profileModel = Vendor;
    else if (role === 'guide') profileModel = Guide;
    else throw new Error('Invalid role');

    const profile = await profileModel.findById(profileId);
    if (!profile) throw new Error('Profile not found');
    profile.status = newStatus;
    await profile.save();

    // Notification stub
    // await NotificationService.sendStatusUpdate(profile.userId, newStatus);

    return { message: `Profile ${role} status updated to ${newStatus}` };
  }
}

module.exports = new AdminService();
