
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainNavbar from '../../components/common/MainNavbar';
import MarketplaceNavbar from '../../components/marketplace/MarketplaceNavbar';

const VendorShopProfilePage = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVendorAndProducts() {
      setLoading(true);
      setError(null);
      try {
        const vRes = await fetch(`/api/vendors/${vendorId}`);
        if (!vRes.ok) throw new Error('Vendor not found');
        const vData = await vRes.json();
        setVendor(vData);
        // Get products for this vendor
        const pRes = await fetch(`/api/products?vendorId=${vendorId}`);
        const pData = await pRes.json();
        setProducts(Array.isArray(pData) ? pData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVendorAndProducts();
  }, [vendorId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!vendor) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <MainNavbar />
      <MarketplaceNavbar />
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
          <img
            src={vendor.files?.logoUrl || '/shop-logo.png'}
            alt={vendor.shopName}
            className="h-28 w-28 object-cover rounded-full border mb-2"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-green-800 mb-1">{vendor.shopName}</h1>
            <div className="text-gray-600 mb-1">{vendor.location}</div>
            <div className="text-gray-700 mb-2">{vendor.description}</div>
            <div className="text-sm text-gray-500">Business Reg: {vendor.businessRegNum}</div>
            <div className="text-sm text-gray-500">Contact: {vendor.shopContact || 'N/A'}</div>
            <div className="text-sm text-gray-500">Email: {vendor.shopMail || 'N/A'}</div>
          </div>
        </div>
        {vendor.profileBanner && (
          <img src={vendor.profileBanner} alt="Banner" className="w-full h-40 object-cover rounded mb-6" />
        )}
        <h2 className="text-xl font-bold mb-4">Products by {vendor.shopName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.length === 0 ? (
            <div className="col-span-full text-gray-500">No products found for this shop.</div>
          ) : (
            products.map(product => (
              <div
                key={product._id}
                className="bg-white rounded shadow p-3 cursor-pointer hover:shadow-lg flex flex-col"
                onClick={() => navigate(`/marketplace/product/${product._id}`)}
              >
                <img
                  src={product.images && product.images.length > 0 ? (product.images[0]?.startsWith('/uploads') ? `http://localhost:5000${product.images[0]}` : product.images[0]) : '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-32 object-contain mb-2"
                  onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                />
                <div className="font-semibold text-sm mb-1">{product.name}</div>
                <div className="text-green-700 font-bold">${product.price?.toFixed(2) ?? product.price}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorShopProfilePage;
