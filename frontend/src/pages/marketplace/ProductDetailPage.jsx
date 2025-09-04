import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainNavbar from '../../components/common/MainNavbar';
import MarketplaceNavbar from '../../components/marketplace/MarketplaceNavbar';
import { useCart } from '../../context/CartContext';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [shopProducts, setShopProducts] = useState([]);
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart, loading: cartLoading } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        // Normalize vendor/shop field
        let vendor = data.vendor || data.vendorId || data.shop || {};
        // If vendorId is an object, use it as vendor
        if (!vendor._id && data.vendorId && typeof data.vendorId === 'object') {
          vendor = data.vendorId;
        }
        if (vendor && vendor._id) {
          // Fetch more products from this vendor
          const shopRes = await fetch(`/api/products?vendorId=${vendor._id}`);
          let shopData = await shopRes.json();
          // Remove current product and pick 4 random
          shopData = shopData.filter(p => p._id !== data._id);
          setShopProducts(shopData.sort(() => 0.5 - Math.random()).slice(0, 4));
        }
        setProduct({ ...data, vendor });
        setMainImgIdx(0);
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
      <MarketplaceNavbar />
      <div className="max-w-5xl mx-auto mt-8 bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
        {/* Vendor Shop Link */}
        <div className="mb-4">
          <span className="text-gray-600">Shop: </span>
          {product.vendor && product.vendor._id ? (
            <Link
              to={`/marketplace/vendor/${product.vendor._id}`}
              className="text-green-700 font-semibold hover:underline"
            >
              {product.vendor.shopName || 'View Shop'}
            </Link>
          ) : (
            <span className="text-red-500 font-semibold">Unknown Shop</span>
          )}
        </div>
        {/* Left: Main Image */}
        <div className="flex-1 flex flex-col items-center">
          <img
            src={product.images && product.images.length > 0 ? (product.images[mainImgIdx]?.startsWith('/uploads') ? `http://localhost:5000${product.images[mainImgIdx]}` : product.images[mainImgIdx]) : '/placeholder.png'}
            alt={product.name}
            className="w-64 h-64 object-contain rounded mb-4 border"
            onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
          />
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mb-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.startsWith('/uploads') ? `http://localhost:5000${img}` : img}
                  alt={`thumb-${idx}`}
                  className={`w-14 h-14 object-cover rounded border cursor-pointer ${mainImgIdx === idx ? 'border-blue-500 border-2' : 'border-gray-300'}`}
                  onClick={() => setMainImgIdx(idx)}
                  onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                />
              ))}
            </div>
          )}
          <div className="text-sm text-gray-500 mt-2">Category: <span className="font-semibold text-blue-700">{product.category?.label || product.category}</span></div>
        </div>
        {/* Center: Details */}
        <div className="flex-[2] flex flex-col gap-2">
          <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
          <div className="text-gray-600 mb-1">Sold by - <span className="font-semibold">{product.vendor?.shopName || product.vendor?.name || product.vendorId?.shopName || product.vendorId?.name}</span></div>
          <div className="text-2xl text-green-700 font-bold mb-2">${product.price?.toFixed(2) ?? product.price}</div>
          <div className="mb-2 text-gray-700">{product.description}</div>
          <div className="flex gap-4 mb-2">
            <div>Stock: <span className="font-semibold">{product.stockQuantity ?? product.stockQty ?? 'N/A'}</span></div>
            <div>Status: <span className={(product.stockQuantity ?? product.stockQty) > 0 ? 'text-green-600' : 'text-red-600'}>{(product.stockQuantity ?? product.stockQty) > 0 ? 'Available' : 'Out of Stock'}</span></div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <input type="number" value={qty} min={1} max={product.stockQuantity || product.stockQty || 99} onChange={e => setQty(Number(e.target.value))} className="w-12 text-center border rounded" />
            <button onClick={() => setQty(q => Math.min((product.stockQuantity || product.stockQty || 99), q + 1))} className="px-2 py-1 bg-gray-200 rounded">+</button>
            <button
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60"
              disabled={cartLoading}
              onClick={async () => {
                await addToCart(product._id, qty);
              }}
            >
              {cartLoading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
        {/* Right: Shop Logo */}
        <div className="flex flex-col items-center min-w-[120px]">
          {product.vendor?.logo || product.vendor?.files?.logoUrl ? (
            <img src={product.vendor.logo || product.vendor.files?.logoUrl} alt="Shop Logo" className="w-20 h-20 object-contain mb-2" />
          ) : null}
          <div className="text-center text-xs text-gray-500">{product.vendor?.shopName || product.vendor?.name || product.vendorId?.shopName || product.vendorId?.name}</div>
          <Link to={`/marketplace/shops`} className="mt-2 text-blue-600 underline text-xs">View Shop</Link>
        </div>
      </div>
      {/* More from shop */}
      <div className="max-w-5xl mx-auto mt-10">
  <h2 className="text-lg font-bold mb-4">More from {product.vendor?.shopName || product.vendor?.name || product.vendorId?.shopName || product.vendorId?.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {shopProducts.map(p => (
            <div key={p._id} className="bg-white rounded shadow p-3 cursor-pointer hover:shadow-lg" onClick={() => navigate(`/marketplace/product/${p._id}`)}>
              <img
                src={p.images && p.images.length > 0 ? (p.images[0]?.startsWith('/uploads') ? `http://localhost:5000${p.images[0]}` : p.images[0]) : '/placeholder.png'}
                alt={p.name}
                className="w-full h-32 object-contain mb-2"
                onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
              />
              <div className="font-semibold text-sm mb-1">{p.name}</div>
              <div className="text-green-700 font-bold">${p.price?.toFixed(2) ?? p.price}</div>
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
