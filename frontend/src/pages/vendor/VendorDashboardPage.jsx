// No change needed, sidebar should remain on dashboard page
import BusinessNavbar from '../../components/common/BusinessNavbar';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import VendorProfileHeader from '../../components/vendor/VendorProfileHeader';
import VendorProfileDetails from '../../components/vendor/VendorProfileDetails';
import vendorService from '../../services/vendorService';
import ProductModal from '../../components/vendor/ProductModal';
import ProductCard from '../../components/vendor/ProductCard';
import productService from '../../services/productService';
import EditProductModal from '../../components/vendor/EditProductModal';


const VendorDashboardPage = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);


  useEffect(() => {
    // Fetch vendor profile from backend
    vendorService.getProfile()
      .then(data => {
        setVendor(data);
        setLoading(false);
        console.debug('Vendor profile loaded:', data);
      })
      .catch(err => {
        if (err.message.includes('pending approval')) {
          setError('Your vendor profile is pending admin approval. Please wait for approval to access your dashboard.');
        } else {
          setError('Failed to load vendor profile. Please login again.');
        }
        setLoading(false);
        console.error('Vendor profile load error:', err);
      });
    // Fetch vendor products
    productService.getVendorProducts()
      .then(products => {
        setProducts(products);
        if (products.length === 0) {
          console.warn('No products found for this vendor.');
        } else {
          console.debug('Vendor products loaded:', products);
        }
      })
      .catch(err => {
        if (err.message.includes('pending approval')) {
          // Already handled in profile error
        } else {
          setError('Failed to load vendor products.');
        }
        console.error('Vendor products load error:', err);
      });
  }, []);

  const handleProfileUpdate = async (updatedFields) => {
    setLoading(true);
    try {
      const updated = await vendorService.updateProfile(updatedFields);
      setVendor(updated);
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };


  const refreshProducts = () => {
    productService.getVendorProducts()
      .then(setProducts)
      .catch(() => {});
  };

  const handleProductAdded = (product) => {
    refreshProducts();
  };

  const handleProductUpdated = (updated) => {
    refreshProducts();
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <>
      <BusinessNavbar />
      <div className="relative min-h-screen flex bg-gray-100">
        {/* Background image with blur and overlay */}
  <img src={'/Ceylon.png'} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" style={{ filter: 'blur(8px) brightness(0.85)' }} />
        <div className="fixed inset-0 bg-white bg-opacity-60 z-0" />
        <aside className="w-64 fixed left-0 top-0 h-screen z-20 flex flex-col min-h-screen backdrop-blur-lg bg-gradient-to-b from-white/90 via-white/80 to-green-50/80 border-r border-green-200 shadow-xl">
          <div className="p-6 text-center border-b border-green-200 bg-gradient-to-r from-green-50 to-white/90 shadow">
            <h2 className="text-2xl font-bold text-green-700">Vendor Dashboard</h2>
            <div className="h-0.5 w-20 bg-gradient-to-r from-green-500 to-yellow-400 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="py-6 px-3">
            <div className="text-xs text-green-700 font-semibold uppercase tracking-wider mb-2 px-3">Menu</div>
            <nav className="flex-1 space-y-2">
              <Link
                to="/vendor/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium bg-gradient-to-r from-green-100 to-green-50 text-green-800 shadow-md border border-green-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                My Products
              </Link>
              <Link
                to="/vendor/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium hover:bg-green-50 hover:text-green-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Manage Orders
              </Link>
              <Link
                to="/vendor/sales-dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium hover:bg-green-50 hover:text-green-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Sales Dashboard
              </Link>
              <Link
                to="/vendor/ai-forecast"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium hover:bg-green-50 hover:text-green-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Demand Forecast
              </Link>
            </nav>
          </div>
          
          <div className="mt-auto p-4 border-t border-green-100">
            <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-4 rounded-lg border border-green-200 shadow-sm mb-3">
              <div className="text-sm font-semibold text-green-800 mb-1">Need Help?</div>
              <p className="text-xs text-gray-600 mb-2">Contact our support team for assistance.</p>
              <a href="mailto:support@ceylone-travelgine.com" className="text-xs text-green-700 hover:underline">support@ceylone-travelgine.com</a>
            </div>
            
            <Link 
              to="/login" 
              onClick={() => localStorage.removeItem('token')}
              className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Link>
          </div>
        </aside>
        <main className="flex-1 relative z-10 p-4 md:p-8 flex flex-col gap-8 ml-64">
          <section className="max-w-6xl mx-auto w-full">
            <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl p-4 md:p-10 border border-green-100 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4">
                <div className="flex-1 min-w-0">
                  <VendorProfileHeader vendor={vendor} onEdit={() => setEditMode(true)} />
                </div>
                <div className="flex-1 min-w-0">
                  <VendorProfileDetails 
                    vendor={vendor} 
                    editMode={editMode} 
                    onSave={handleProfileUpdate} 
                    onCancel={() => setEditMode(false)}
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="max-w-6xl mx-auto w-full">
            <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl p-4 md:p-10 border border-green-100 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                <h2 className="text-2xl font-bold text-green-700 tracking-tight">My Marketplace</h2>
                <button className="bg-gradient-to-r from-green-500 via-yellow-400 to-green-400 hover:from-green-600 hover:to-yellow-500 transition text-white px-6 py-2 rounded-lg shadow font-semibold" onClick={() => setProductModalOpen(true)}>
                  Add Product
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.length === 0 ? (
                  <div className="text-gray-500 col-span-full">No products yet.</div>
                ) : products.map(p => (
                  <div className="transition-transform hover:scale-105">
                    <ProductCard key={p._id} product={p} onEdit={() => setEditProduct(p)} />
                  </div>
                ))}
              </div>
            </div>
          </section>
          <ProductModal open={productModalOpen} onClose={() => setProductModalOpen(false)} onProductAdded={handleProductAdded} />
          <EditProductModal open={!!editProduct} onClose={() => setEditProduct(null)} product={editProduct || {}} onProductUpdated={handleProductUpdated} />
        </main>
      </div>
    </>
  );
};

export default VendorDashboardPage;
