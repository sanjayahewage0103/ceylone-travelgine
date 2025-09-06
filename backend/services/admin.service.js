

const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const Guide = require('../models/guide.model');

class AdminService {

	// Add a new user
	async addUser(userData) {
		const validRoles = ['tourist', 'vendor', 'guide', 'admin'];
		if (!validRoles.includes(userData.role)) throw new Error('Invalid role');
		const exists = await User.findOne({ email: userData.email });
		if (exists) throw new Error('Email already exists');
		const user = new User(userData);
		await user.save();
		return user;
	}

	// Edit user details
	async editUser(userId, updates) {
		const user = await User.findByIdAndUpdate(userId, updates, { new: true });
		if (!user) throw new Error('User not found');
		return user;
	}

	// Delete user
	async deleteUser(userId) {
		const user = await User.findByIdAndDelete(userId);
		if (!user) throw new Error('User not found');
		await Vendor.deleteOne({ userId });
		await Guide.deleteOne({ userId });
		return { message: 'User deleted' };
	}
	// Dashboard stats: counts for each user type and pending approvals
	async getDashboardStats() {
		const [touristCount, vendorUserCount, guideUserCount, adminCount, vendorCount, guideCount, pendingVendors, pendingGuides] = await Promise.all([
			User.countDocuments({ role: 'tourist' }),
			User.countDocuments({ role: 'vendor' }),
			User.countDocuments({ role: 'guide' }),
			User.countDocuments({ role: 'admin' }),
			Vendor.countDocuments({}),
			Guide.countDocuments({}),
			Vendor.countDocuments({ status: 'pending' }),
			Guide.countDocuments({ status: 'pending' })
		]);
		return {
			touristCount,
			vendorUserCount,
			guideUserCount,
			adminCount,
			vendorCount,
			guideCount,
			pendingVendors,
			pendingGuides
		};
	}

       // Get all users with optional filters and populate professional profiles
       async getAllUsers(filters = {}) {
	       const query = {};
	       if (filters.role) query.role = filters.role;
	       // Only allow valid roles for filtering, but always include admin in the result for admin panel
	       const validRoles = ['tourist', 'vendor', 'guide', 'admin'];
	       if (query.role && !validRoles.includes(query.role)) delete query.role;
	       // Find users (including admin)
	       const users = await User.find({ ...query, role: { $in: validRoles } }).select('-passwordHash');
	       // Populate professional profiles
	       const populated = await Promise.all(users.map(async user => {
		       let profile = null;
		       if (user.role === 'vendor') {
			       profile = await Vendor.findOne({ userId: user._id });
		       } else if (user.role === 'guide') {
			       profile = await Guide.findOne({ userId: user._id });
		       }
		       return { ...user.toObject(), profile };
	       }));
	       return populated;
       }

	// Get a single user's details with professional profile
	async getUserDetails(userId) {
		const user = await User.findById(userId).select('-passwordHash');
		if (!user) throw new Error('User not found');
		let profile = null;
		if (user.role === 'vendor') {
			profile = await Vendor.findOne({ userId: user._id });
		} else if (user.role === 'guide') {
			profile = await Guide.findOne({ userId: user._id });
		}
		return { ...user.toObject(), profile };
	}

	// Update status for vendor/guide profile
	async updateUserStatus(profileId, role, newStatus) {
		if (!['vendor', 'guide'].includes(role)) throw new Error('Invalid role');
		if (!['approved', 'rejected', 'pending'].includes(newStatus)) throw new Error('Invalid status');
		let updated;
		if (role === 'vendor') {
			updated = await Vendor.findByIdAndUpdate(profileId, { status: newStatus }, { new: true });
		} else {
			updated = await Guide.findByIdAndUpdate(profileId, { status: newStatus }, { new: true });
		}
		// TODO: Trigger notification (e.g., NotificationService) here
		return updated;
	}
}

module.exports = new AdminService();
