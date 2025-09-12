import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import MarketplaceLayout from '../../components/marketplace/MarketplaceLayout';
import CategoryCard from '../../components/marketplace/CategoryCard';
import ProductCard from '../../components/marketplace/ProductCard';
const bannerImg = '/marketplace-banner.jpg'; // Use public asset URL

const mockCategories = [
  { id: 1, label: 'Handicrafts', image: 'http://localhost:5173/images/image/category1.jpeg' },
  { id: 2, label: 'Gems & Jewellery', image: 'http://localhost:5173/images/image/category2.jpeg' },
  { id: 3, label: 'Food & Spices', image: 'http://localhost:5173/images/image/category3.jpeg' },
  { id: 4, label: 'Wellness & Ayurveda', image: 'http://localhost:5173/images/image/category4.jpeg' },
  { id: 5, label: 'Other', image: 'http://localhost:5173/images/image/category5.jpeg' },
];





const MarketplacePage = () => {
  const [search, setSearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (searchTerm = "") => {
    try {
      setLoading(true);
      setError(null);
      const url = searchTerm ? `/api/products?search=${encodeURIComponent(searchTerm)}` : '/api/products';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = () => {
    fetchProducts(search);
  };

  return (
    <MarketplaceLayout search={search} setSearch={setSearch} onSearch={handleSearch}>
      {/* Banner Section */}
      <div className="w-full h-56 md:h-72 lg:h-80 bg-gray-200 flex items-center justify-center mb-8">
        <img src={bannerImg} alt="Marketplace Banner" className="object-cover w-full h-full" />
      </div>
      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Featured Categories</h2>
          <button
            className="text-blue-600 hover:underline font-medium"
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {(showAllCategories ? mockCategories : mockCategories.slice(0, 4)).map(cat => (
            <CategoryCard key={cat.id} label={cat.label} image={cat.image} />
          ))}
        </div>
      </section>
      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <button
            className="text-blue-600 hover:underline font-medium"
            onClick={() => {/* TODO: navigate to all products page */}}
          >
            View All
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {products.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </MarketplaceLayout>
  );
};

export default MarketplacePage;
