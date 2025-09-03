class VendorService {
  baseUrl = '/api/vendor';

  getToken() {
    // Try localStorage first, fallback to sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('[vendorService] Using token:', token);
    return token;
  }

  async getProfile() {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/me`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (res.status === 401) {
      throw new Error('Unauthorized: Token missing or invalid. Please login again.');
    }
    if (!res.ok) throw new Error('Failed to fetch vendor profile');
    return res.json();
  }

  async updateProfile(data) {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update vendor profile');
    return res.json();
  }
}

export default new VendorService();
