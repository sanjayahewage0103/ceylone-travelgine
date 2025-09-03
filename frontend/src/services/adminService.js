class AdminService {
  async getDashboardStats() {
    // TODO: Implement API call
    return {
      totalUsers: 0,
      totalVendors: 0,
      totalGuides: 0,
      totalTourists: 0,
    };
  }

  async getPendingApprovals() {
    // TODO: Implement API call
    return [];
  }

  async getAllUsers({ role, status, search }) {
    // TODO: Implement API call
    return [];
  }

  // Add more methods for approve/reject, add/edit/delete user, etc.
}

export default new AdminService();
