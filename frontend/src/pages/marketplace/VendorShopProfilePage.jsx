import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VendorShopProfilePage = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendorAndProducts = async () => {
      try {
        setLoading(true);
        const vendorRes = await axios.get(`/api/vendors/${vendorId}`);
        setVendor(vendorRes.data);
        const productsRes = await axios.get(`/api/products?vendorId=${vendorId}`);
        setProducts(productsRes.data);
      } catch (err) {
        setError('Failed to load vendor profile or products.');
      } finally {
        setLoading(false);
      }
    };
    fetchVendorAndProducts();
  }, [vendorId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!vendor) return <div className="p-8 text-center">Vendor not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">{vendor.shopName}</h1>
        <div className="mb-2 text-gray-600">{vendor.email}</div>
        <div className="mb-2">{vendor.description || 'No description provided.'}</div>
        <div className="mb-2">Contact: {vendor.contactNumber || 'N/A'}</div>
        {/* Add more vendor fields as needed */}
      </div>
      <h2 className="text-xl font-semibold mb-4">Products by {vendor.shopName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length === 0 && <div className="col-span-3 text-gray-500">No products found.</div>}
        {products.map(product => (
          <div key={product._id} className="bg-white rounded shadow p-4 flex flex-col">
            <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="h-32 w-full object-cover rounded mb-2" />
            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
            <div className="text-gray-600 mb-1">{product.category}</div>
            <div className="mb-2 font-semibold">LKR {product.price}</div>
            <Link to={`/marketplace/product/${product._id}`} className="mt-auto inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorShopProfilePage;
