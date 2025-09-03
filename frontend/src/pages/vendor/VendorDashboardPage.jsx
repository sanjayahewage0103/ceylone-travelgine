import React, { useEffect, useState } from 'react';
import VendorSidebar from '../../components/vendor/VendorSidebar';
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
      })
      .catch(err => {
        setError('Failed to load vendor profile. Please login again.');
        setLoading(false);
      });
    // Fetch vendor products
    productService.getVendorProducts()
      .then(setProducts)
      .catch(() => {});
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


  const handleProductAdded = (product) => {
    setProducts([product, ...products]);
  };

  const handleProductUpdated = (updated) => {
    setProducts(products.map(p => p._id === updated._id ? updated : p));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen">
      <VendorSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <VendorProfileHeader vendor={vendor} onEdit={() => setEditMode(true)} />
        <VendorProfileDetails 
          vendor={vendor} 
          editMode={editMode} 
          onSave={handleProfileUpdate} 
          onCancel={() => setEditMode(false)}
        />
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">My Marketplace</h2>
            <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={() => setProductModalOpen(true)}>Add Product</button>
          </div>
          <div className="flex flex-wrap gap-6">
            {products.length === 0 ? <div className="text-gray-500">No products yet.</div> : products.map(p => (
              <ProductCard key={p._id} product={p} onEdit={() => setEditProduct(p)} />
            ))}
          </div>
        </div>
  <ProductModal open={productModalOpen} onClose={() => setProductModalOpen(false)} onProductAdded={handleProductAdded} />
  <EditProductModal open={!!editProduct} onClose={() => setEditProduct(null)} product={editProduct || {}} onProductUpdated={handleProductUpdated} />
      </main>
    </div>
  );
};

export default VendorDashboardPage;
