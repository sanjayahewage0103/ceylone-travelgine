import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '../../components/marketplace/MarketplaceLayout';
import ProductCard from '../../components/marketplace/ProductCard';
import { motion } from 'framer-motion';

// FilterSidebar follows SRP and OCP, can be extended for more filters
function FilterSidebar({ filters, setFilters, categories, shops }) {
  return (
    <motion.aside 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:w-64 glass-card rounded-xl p-5 mb-4 md:mb-0 transition-all duration-300 hover:shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-5 text-gradient">Filter Products</h2>
      
      {/* Title search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full p-2.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
          value={filters.title}
          onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
        />
      </div>
      
      {/* Category dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          className="w-full p-2.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      {/* Shop dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Shop</label>
        <select
          className="w-full p-2.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
          value={filters.shop}
          onChange={e => setFilters(f => ({ ...f, shop: e.target.value }))}
        >
          <option value="">All Shops</option>
          {shops.map(shop => (
            <option key={shop.id} value={shop.name}>{shop.name}</option>
          ))}
        </select>
      </div>
      
      {/* Price range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-2.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-2.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
          />
        </div>
      </div>
      
      {/* Availability */}
      <div className="mb-3 mt-5">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500 transition-all duration-300"
            checked={filters.available}
            onChange={e => setFilters(f => ({ ...f, available: e.target.checked }))}
          />
          <span className="ml-3 text-gray-700">In Stock Only</span>
        </label>
      </div>
    </motion.aside>
  );
}

// ProductListPage follows SRP, OCP, and uses composition
const ProductListPage = () => {
  const [filters, setFilters] = useState({
    title: '',
    category: '',
    shop: '',
    minPrice: '',
    maxPrice: '',
    available: false,
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch filter options (categories, shops) from product endpoints
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [catRes, shopRes] = await Promise.all([
          fetch('/api/products/categories'),
          fetch('/api/products/shops'),
        ]);
        const categories = await catRes.json();
        const shops = await shopRes.json();
        setCategories(categories);
        setShops(shops);
      } catch (err) {
        setCategories([]);
        setShops([]);
      }
    }
    fetchOptions();
  }, []);

  // Fetch products with filters
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.title) params.append('search', filters.title);
        if (filters.category) params.append('category', filters.category);
        if (filters.shop) params.append('shop', filters.shop);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.available) params.append('available', 'true');
        params.append('approved', 'true');
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        setProducts(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [filters]);

  return (
    <MarketplaceLayout>
      {/* Banner with glassmorphism overlay */}
      <div className="relative w-full h-64 bg-cover bg-center mb-8 overflow-hidden rounded-lg" 
           style={{ backgroundImage: `url('/marketplace-banner.jpg')` }}>
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-r from-green-600/30 to-teal-600/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center p-6 max-w-2xl"
          >
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md">Ceylon Marketplace</h1>
            <p className="text-white text-lg max-w-lg mx-auto">
              Discover authentic Sri Lankan products from trusted local vendors
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 mb-12">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          shops={shops}
        />
        <main className="flex-1">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-xl p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gradient">All Ceylon Products</h2>
              <div className="text-sm text-gray-600">
                {products.length} Products Found
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                <p className="font-medium">Error: {error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-blue-50 text-blue-700 p-6 rounded-lg text-center">
                <p className="font-medium">No products found matching your criteria.</p>
                <p className="mt-2">Try adjusting your filters.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </MarketplaceLayout>
  );
};

export default ProductListPage;
