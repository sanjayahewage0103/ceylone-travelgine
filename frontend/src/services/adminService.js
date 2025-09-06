class AdminService {
  getToken() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (typeof window !== 'undefined') {
      console.debug('[adminService] Using JWT token:', token);
    }
    return token;
  }
  baseUrl = "/api/admin";

  async getPendingProducts(queryString = '') {
    const token = this.getToken();
    const res = await fetch(`/api/admin/products/pending${queryString ? '?' + queryString : ''}`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!res.ok) throw new Error('Failed to fetch pending products');
    return res.json();
  }

  async setProductApproval(productId, action) {
    const token = this.getToken();
    const res = await fetch(`/api/admin/products/${productId}/approval`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
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
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/profiles/${role}/${profileId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", 'Authorization': token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ newStatus }),
    });
    if (!res.ok) throw new Error("Failed to update profile status");
    return res.json();
  }

  async getDashboardStats() {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/stats`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
  }

  async getPendingApprovals() {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/pending`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!res.ok) throw new Error("Failed to fetch pending approvals");
    return res.json();
  }

  async getAllUsers({ role = '', status = '', search = '' } = {}) {
    const token = this.getToken();
    const params = new URLSearchParams({ role, status, search });
    const res = await fetch(`${this.baseUrl}/users?${params}`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  }

  async updateUserStatus(userId, status) {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/users/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", 'Authorization': token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update user status");
    return res.json();
  }

  async getUserById(userId) {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/users/${userId}`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!res.ok) throw new Error("Failed to fetch user details");
    return res.json();
  }

  async createUser(userData) {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'Authorization': token ? `Bearer ${token}` : '' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  }

  async editUser(userId, userData) {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", 'Authorization': token ? `Bearer ${token}` : '' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  }

  async deleteUser(userId) {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: "DELETE",
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return res.json();
  }
}

export default new AdminService();
