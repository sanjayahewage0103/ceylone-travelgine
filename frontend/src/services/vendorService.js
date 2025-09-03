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
    let options = {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: data
    };
    // If not FormData, fallback to JSON
    if (!(data instanceof FormData)) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }
    const res = await fetch(`${this.baseUrl}/me`, options);
    if (!res.ok) throw new Error('Failed to update vendor profile');
    return res.json();
  }
}

export default new VendorService();
