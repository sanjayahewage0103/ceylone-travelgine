import React, { useState, useEffect } from 'react';
import MainNavbar from '../../components/common/MainNavbar';
import MarketplaceNavbar from '../../components/marketplace/MarketplaceNavbar';
import ProductCard from '../../components/marketplace/ProductCard';

// FilterSidebar follows SRP and OCP, can be extended for more filters
function FilterSidebar({ filters, setFilters, categories, shops }) {
  return (
    <aside className="w-full md:w-64 bg-white rounded-lg shadow p-4 mb-4 md:mb-0">
      <h2 className="text-lg font-semibold mb-4">Filter Products</h2>
      {/* Title search */}
      <input
        type="text"
        placeholder="Search by title..."
        className="w-full mb-3 p-2 border rounded"
        value={filters.title}
        onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
      />
      {/* Category dropdown */}
      <select
        className="w-full mb-3 p-2 border rounded"
        value={filters.category}
        onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      {/* Shop dropdown */}
      <select
        className="w-full mb-3 p-2 border rounded"
        value={filters.shop}
        onChange={e => setFilters(f => ({ ...f, shop: e.target.value }))}
      >
        <option value="">All Shops</option>
        {shops.map(shop => (
          <option key={shop.id} value={shop.name}>{shop.name}</option>
        ))}
      </select>
      {/* Price range */}
      <div className="mb-3">
        <label className="block mb-1">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-2 border rounded"
            value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-2 border rounded"
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
          />
        </div>
      </div>
      {/* Availability */}
      <div className="mb-3">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={filters.available}
            onChange={e => setFilters(f => ({ ...f, available: e.target.checked }))}
          />
          <span className="ml-2">In Stock Only</span>
        </label>
      </div>
    </aside>
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
    <div className="bg-gray-50 min-h-screen">
      <MainNavbar />
      <MarketplaceNavbar />
      <div className="w-full h-48 bg-cover bg-center mb-6" style={{ backgroundImage: `url('/marketplace-banner.jpg')` }} />
      <div className="container mx-auto flex flex-col md:flex-row gap-6">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          shops={shops}
        />
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-4">All Ceylone Products</h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;
