class OrderService {
  baseUrl = '/api/orders';

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  async getVendorOrders() {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/vendor`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch vendor orders');
    return res.json();
  }

  async updateOrderStatus(orderId, status) {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/vendor/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  }
}

export default new OrderService();
