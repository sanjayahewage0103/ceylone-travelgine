import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainNavbar from '../../components/common/MainNavbar';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [shopProducts, setShopProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        // Fetch more from shop
        if (data.vendor && data.vendor._id) {
          const shopRes = await fetch(`/api/products?vendor=${data.vendor._id}`);
          let shopData = await shopRes.json();
          // Remove current product and pick 4 random
          shopData = shopData.filter(p => p._id !== data._id);
          setShopProducts(shopData.sort(() => 0.5 - Math.random()).slice(0, 4));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <MainNavbar />
      <div className="max-w-5xl mx-auto mt-8 bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
        {/* Left: Main Image */}
        <div className="flex-1 flex flex-col items-center">
          <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-64 h-64 object-contain rounded mb-4 border" />
          <div className="text-sm text-gray-500 mt-2">Category: <span className="font-semibold text-blue-700">{product.category?.label || product.category}</span></div>
        </div>
        {/* Center: Details */}
        <div className="flex-[2] flex flex-col gap-2">
          <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
          <div className="text-gray-600 mb-1">Sold by - <span className="font-semibold">{product.vendor?.shopName || product.vendor?.name}</span></div>
          <div className="text-2xl text-green-700 font-bold mb-2">${product.price?.toFixed(2)}</div>
          <div className="mb-2 text-gray-700">{product.description}</div>
          <div className="flex gap-4 mb-2">
            <div>Stock: <span className="font-semibold">{product.stockQty ?? 'N/A'}</span></div>
            <div>Status: <span className={product.stockQty > 0 ? 'text-green-600' : 'text-red-600'}>{product.stockQty > 0 ? 'Available' : 'Out of Stock'}</span></div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <input type="number" value={qty} min={1} max={product.stockQty || 99} onChange={e => setQty(Number(e.target.value))} className="w-12 text-center border rounded" />
            <button onClick={() => setQty(q => Math.min((product.stockQty || 99), q + 1))} className="px-2 py-1 bg-gray-200 rounded">+</button>
            <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Add to Cart</button>
          </div>
        </div>
        {/* Right: Shop Logo */}
        <div className="flex flex-col items-center min-w-[120px]">
          {product.vendor?.logo && <img src={product.vendor.logo} alt="Shop Logo" className="w-20 h-20 object-contain mb-2" />}
          <div className="text-center text-xs text-gray-500">{product.vendor?.shopName || product.vendor?.name}</div>
          <Link to={`/marketplace/shops`} className="mt-2 text-blue-600 underline text-xs">View Shop</Link>
        </div>
      </div>
      {/* More from shop */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-lg font-bold mb-4">More from {product.vendor?.shopName || product.vendor?.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {shopProducts.map(p => (
            <div key={p._id} className="bg-white rounded shadow p-3 cursor-pointer hover:shadow-lg" onClick={() => navigate(`/marketplace/product/${p._id}`)}>
              <img src={p.images?.[0] || '/placeholder.png'} alt={p.name} className="w-full h-32 object-contain mb-2" />
              <div className="font-semibold text-sm mb-1">{p.name}</div>
              <div className="text-green-700 font-bold">${p.price?.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link to={`/marketplace/shops`} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">View Shop</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
