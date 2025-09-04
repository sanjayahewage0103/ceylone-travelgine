import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainNavbar from '../../components/common/MainNavbar';
import MarketplaceNavbar from '../../components/marketplace/MarketplaceNavbar';
import ProductCard from '../../components/marketplace/ProductCard';

const categoryBanners = {
  'Handicrafts': '/category1.jpg',
  'Gems & Jewellery': '/category2.jpg',
  'Food & Spices': '/category3.jpg',
  'Wellness & Ayurveda': '/category4.jpg',
  'Other': '/category5.jpg',
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
    <div className="bg-gray-50 min-h-screen">
      <MainNavbar />
      <MarketplaceNavbar />
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500">
        <Link to="/" className="hover:underline">Travelgine</Link> &gt;{' '}
        <Link to="/marketplace" className="hover:underline">Marketplace</Link> &gt;{' '}
        <span className="text-gray-700 font-semibold">{categoryName}</span>
      </div>
      {/* Page Title */}
      <h1 className="max-w-7xl mx-auto px-4 text-3xl font-bold text-gray-800 mb-4">{categoryName}</h1>
      {/* Category Banner */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <img
          src={categoryBanners[categoryName] || '/marketplace-banner.jpg'}
          alt={categoryName + ' banner'}
          className="w-full h-48 md:h-64 object-cover rounded-lg shadow"
        />
      </div>
      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{categoryName} Products</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {products.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
