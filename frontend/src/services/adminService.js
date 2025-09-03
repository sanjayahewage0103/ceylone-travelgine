class AdminService {
  baseUrl = "/api/admin";

  async getPendingProducts(queryString = '') {
    const res = await fetch(`/api/admin/products/pending${queryString ? '?' + queryString : ''}`);
    if (!res.ok) throw new Error('Failed to fetch pending products');
    return res.json();
  }

  async setProductApproval(productId, action) {
    const res = await fetch(`/api/admin/products/${productId}/approval`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    if (!res.ok) throw new Error('Failed to update product approval');
    return res.json();
  }

  async getProductApprovalStats() {
    // For demo, call dashboard stats and count products
    const statsRes = await this.getDashboardStats();
    // You may want to call a dedicated endpoint for product/shop/vendor counts
    return {
      productCount: statsRes.pendingVendors + statsRes.pendingGuides + (statsRes.totalProducts || 0),
      vendorCount: statsRes.vendorCount,
      shopCount: statsRes.vendorCount // assuming 1 shop per vendor
    };
  }
  async approveOrRejectProfile(profileId, role, newStatus) {
    const res = await fetch(`${this.baseUrl}/profiles/${role}/${profileId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newStatus }),
    });
    if (!res.ok) throw new Error("Failed to update profile status");
    return res.json();
  }

  async getDashboardStats() {
    const res = await fetch(`${this.baseUrl}/stats`);
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
  }

  async getPendingApprovals() {
    const res = await fetch(`${this.baseUrl}/pending`);
    if (!res.ok) throw new Error("Failed to fetch pending approvals");
    return res.json();
  }

  async getAllUsers({ role = '', status = '', search = '' } = {}) {
    const params = new URLSearchParams({ role, status, search });
    const res = await fetch(`${this.baseUrl}/users?${params}`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  }

  async updateUserStatus(userId, status) {
    const res = await fetch(`${this.baseUrl}/users/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update user status");
    return res.json();
  }

  async getUserById(userId) {
    const res = await fetch(`${this.baseUrl}/users/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user details");
    return res.json();
  }

  async createUser(userData) {
    const res = await fetch(`${this.baseUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  }

  async editUser(userId, userData) {
    const res = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  }

  async deleteUser(userId) {
    const res = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return res.json();
  }
}

export default new AdminService();
