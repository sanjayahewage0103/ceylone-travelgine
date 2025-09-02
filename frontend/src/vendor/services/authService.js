class AuthService {
  async login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return await res.json();
  }

  async registerVendor(formData) {
    const data = new FormData();
    data.append('role', 'vendor');
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'shopDetails') {
        Object.entries(value).forEach(([k, v]) => {
          data.append(`shopDetails[${k}]`, v);
        });
      } else {
        data.append(key, value);
      }
    });
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: data
    });
    if (!res.ok) throw new Error('Registration failed');
    return await res.json();
  }
}

export default new AuthService();
