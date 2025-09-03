// (removed duplicate updateProduct)
// productService.js: OOP API calls for products

class ProductService {
  baseUrl = '/api/products';

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  async addProduct(formData) {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });
    if (!res.ok) throw new Error('Failed to add product');
    return res.json();
  }

  async getVendorProducts() {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/vendor`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  }

  async updateProduct(productId, formData) {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/${productId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  }
}

export default new ProductService();
