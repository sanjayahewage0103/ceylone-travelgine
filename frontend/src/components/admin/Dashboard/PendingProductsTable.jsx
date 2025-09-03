
import React, { useEffect, useState } from 'react';
import adminService from '@/services/adminService';
import ProductApprovalModal from './ProductApprovalModal';

const AllProductsTable = ({ onView }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products/all');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      setProducts([]);
    }
    setLoading(false);
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-2">All Products</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Shop Name</th>
            <th>Vendor Name</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price (LKR)</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={8}>Loading...</td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan={8}>No products found.</td></tr>
          ) : products.map(product => {
            const vendor = product.vendorId || {};
            return (
              <tr key={product._id}>
                <td>{vendor.shopName || '-'}</td>
                <td>{vendor.userId?.fullName || '-'}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stockQuantity}</td>
                <td>{product.isApproved}</td>
                <td>
                  <button className="text-blue-600" onClick={() => onView(product)}>View</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const PendingProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [modalProduct, setModalProduct] = useState(null);
  const [stats, setStats] = useState({ productCount: 0, vendorCount: 0, shopCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [search, category]);

  async function fetchData() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const res = await adminService.getPendingProducts(params.toString());
    setProducts(res);
    setLoading(false);
  }

  async function fetchStats() {
    const stats = await adminService.getProductApprovalStats();
    setStats(stats);
  }

  const handleAction = async (product, action) => {
    await adminService.setProductApproval(product._id, action);
    fetchData();
    fetchStats();
    setModalProduct(null);
  };

  return (
    <div className="bg-white rounded shadow p-6 mt-6">
      <h1 className="text-2xl font-bold mb-2">Manage Vendor Products</h1>
      <div className="mb-4 flex gap-8">
        <div>Total Products: <span className="font-semibold">{stats.productCount}</span></div>
        <div>Total Vendors: <span className="font-semibold">{stats.vendorCount}</span></div>
        <div>Total Shops: <span className="font-semibold">{stats.shopCount}</span></div>
      </div>
      <div className="flex gap-4 mb-4">
        <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded px-2 py-1" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-2 py-1">
          <option value="">All Categories</option>
          <option value="Handicrafts">Handicrafts</option>
          <option value="Gems & Jewellery">Gems & Jewellery</option>
          <option value="Food & Spices">Food & Spices</option>
          <option value="Wellness & Ayurveda">Wellness & Ayurveda</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Shop Name</th>
            <th>Vendor Name</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price (LKR)</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={8}>Loading...</td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan={8}>No pending products.</td></tr>
          ) : products.map(product => {
            const vendor = product.vendorId || {};
            return (
              <tr key={product._id}>
                <td>{vendor.shopName || '-'}</td>
                <td>{vendor.userId?.fullName || '-'}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stockQuantity}</td>
                <td>{product.isApproved}</td>
                <td>
                  <button className="text-green-600 mr-2" onClick={() => handleAction(product, 'approve')}>Approve</button>
                  <button className="text-red-600 mr-2" onClick={() => handleAction(product, 'reject')}>Reject</button>
                  <button className="text-blue-600" onClick={() => setModalProduct(product)}>View</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {modalProduct && <ProductApprovalModal product={modalProduct} onClose={() => setModalProduct(null)} onAction={handleAction} />}

      {/* All Products Table */}
      <AllProductsTable onView={setModalProduct} />
    </div>
  );
};

export default PendingProductsTable;
