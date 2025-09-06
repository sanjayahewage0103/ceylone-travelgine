import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarketplaceLayout from '../../components/marketplace/MarketplaceLayout';
import ProductCard from '../../components/marketplace/ProductCard';
import { motion } from 'framer-motion';

const categoryBanners = {
  'Handicrafts': '/category1.jpg',
  'Gems & Jewellery': '/category2.jpg',
  'Food & Spices': '/category3.jpg',
  'Wellness & Ayurveda': '/category4.jpg',
  'Other': '/category5.jpg',
};

const categoryDescriptions = {
  'Handicrafts': 'Discover authentic Sri Lankan handicrafts, lovingly made by local artisans using traditional techniques.',
  'Gems & Jewellery': 'Explore exquisite gems and jewelry from Sri Lanka, renowned worldwide for their exceptional quality and beauty.',
  'Food & Spices': 'Taste the authentic flavors of Sri Lanka with our premium selection of spices, teas, and culinary delights.',
  'Wellness & Ayurveda': 'Experience the ancient healing wisdom of Sri Lankan Ayurveda through our carefully selected wellness products.',
  'Other': 'Browse our diverse collection of unique Sri Lankan products that showcase the island\'s rich cultural heritage.',
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/products?category=${encodeURIComponent(categoryName)}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <MarketplaceLayout>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="glass-card rounded-lg px-4 py-2 text-sm inline-flex items-center space-x-2">
          <Link to="/" className="text-gray-600 hover:text-gradient transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/marketplace" className="text-gray-600 hover:text-gradient transition-colors">Marketplace</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gradient font-medium">{categoryName}</span>
        </nav>
      </div>
      
      {/* Category Banner with Glassmorphism */}
      <div className="container mx-auto px-4 my-6">
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
          <img
            src={categoryBanners[categoryName] || '/marketplace-banner.jpg'}
            alt={categoryName + ' banner'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-teal-600/30 backdrop-blur-sm"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">{categoryName}</h1>
              <p className="text-white/90 text-lg max-w-2xl">
                {categoryDescriptions[categoryName] || 'Explore our curated collection of authentic Sri Lankan products.'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Products Section */}
      <div className="container mx-auto px-4 mb-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gradient">
              {categoryName} Products
              <span className="text-gray-700 ml-3 text-lg">
                ({products.length} {products.length === 1 ? 'item' : 'items'})
              </span>
            </h2>
            
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50/50 backdrop-blur-sm text-red-600 p-6 rounded-lg text-center">
              <p className="font-medium text-lg">Error: {error}</p>
              <p className="mt-2">Please try again later or contact support.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-blue-50/50 backdrop-blur-sm text-blue-700 p-12 rounded-lg text-center">
              <p className="font-medium text-xl mb-3">No products found in this category.</p>
              <p>We're constantly adding new products to our marketplace.</p>
              <Link to="/marketplace" className="btn-gradient mt-6 inline-block px-6 py-2 rounded-lg">
                Browse All Products
              </Link>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {products.map((prod, index) => (
                <motion.div
                  key={prod._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ProductCard product={prod} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </MarketplaceLayout>
  );
};

export default CategoryPage;
