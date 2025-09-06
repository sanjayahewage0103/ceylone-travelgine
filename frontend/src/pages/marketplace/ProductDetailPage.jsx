import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MarketplaceLayout from '../../components/marketplace/MarketplaceLayout';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

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

  if (loading) {
    return (
      <MarketplaceLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </MarketplaceLayout>
    );
  }
  
  if (error) {
    return (
      <MarketplaceLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="glass-card p-8 rounded-xl text-center">
            <div className="text-red-500 text-xl mb-4">Error: {error}</div>
            <p className="mb-6">We couldn't find the product you're looking for.</p>
            <Link to="/marketplace" className="btn-gradient py-2 px-6 rounded-lg">
              Return to Marketplace
            </Link>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (!product) return null;

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="glass-card rounded-lg px-4 py-2 text-sm inline-flex items-center space-x-2 mb-6">
          <Link to="/" className="text-gray-600 hover:text-gradient transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/marketplace" className="text-gray-600 hover:text-gradient transition-colors">Marketplace</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gradient font-medium">{product.name}</span>
        </nav>

        {/* Product Detail Card */}
        <div className="glass-card rounded-xl overflow-hidden shadow-lg mb-10">
          <div className="flex flex-col md:flex-row">
            {/* Left: Product Images */}
            <div className="md:w-2/5 p-6">
              <div className="bg-white/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm mb-4 p-4 flex items-center justify-center">
                <img
                  src={product.images && product.images.length > 0 ? (product.images[mainImgIdx]?.startsWith('/uploads') ? `http://localhost:5000${product.images[mainImgIdx]}` : product.images[mainImgIdx]) : '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-80 object-contain transition-all duration-300 hover:scale-105"
                  onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                />
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {product.images.map((img, idx) => (
                    <div 
                      key={idx}
                      className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${mainImgIdx === idx ? 'ring-2 ring-green-500 scale-105' : 'opacity-70 hover:opacity-100'}`}
                      onClick={() => setMainImgIdx(idx)}
                    >
                      <img
                        src={img.startsWith('/uploads') ? `http://localhost:5000${img}` : img}
                        alt={`thumb-${idx}`}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right: Product Details */}
            <div className="md:w-3/5 p-6 flex flex-col">
              {/* Vendor Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {product.vendor?.logo || product.vendor?.files?.logoUrl ? (
                    <img 
                      src={product.vendor.logo || product.vendor.files?.logoUrl} 
                      alt="Shop Logo" 
                      className="w-12 h-12 rounded-full object-cover border border-white/20 mr-3" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-lg">
                        {(product.vendor?.shopName || product.vendor?.name || 'S')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-600">Sold by</div>
                    <Link
                      to={`/marketplace/vendor/${product.vendor?._id || '#'}`}
                      className="font-medium hover:text-gradient transition-colors"
                    >
                      {product.vendor?.shopName || product.vendor?.name || product.vendorId?.shopName || product.vendorId?.name || 'Unknown Shop'}
                    </Link>
                  </div>
                </div>
                <div className="text-sm bg-white/50 backdrop-blur-sm py-1 px-3 rounded-full border border-white/20">
                  Category: <span className="font-medium text-gradient">{product.category?.label || product.category}</span>
                </div>
              </div>
              
              {/* Product Name & Price */}
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="text-3xl text-gradient font-bold mb-4">
                Rs. {product.price?.toLocaleString() ?? product.price}
              </div>
              
              {/* Description */}
              <div className="mb-6 text-gray-700 bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              {/* Stock & Status */}
              <div className="flex gap-6 mb-6">
                <div className="bg-white/30 backdrop-blur-sm rounded-lg py-2 px-4 border border-white/20">
                  <div className="text-sm text-gray-600">Stock</div>
                  <div className="font-medium">{product.stockQuantity ?? product.stockQty ?? 'N/A'} units</div>
                </div>
                <div className="bg-white/30 backdrop-blur-sm rounded-lg py-2 px-4 border border-white/20">
                  <div className="text-sm text-gray-600">Status</div>
                  <div className={(product.stockQuantity ?? product.stockQty) > 0 ? 'font-medium text-green-600' : 'font-medium text-red-600'}>
                    {(product.stockQuantity ?? product.stockQty) > 0 ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="mt-auto">
                <div className="flex items-center gap-3">
                  <div className="flex border border-white/30 rounded-lg overflow-hidden backdrop-blur-sm bg-white/50">
                    <button 
                      onClick={() => setQty(q => Math.max(1, q - 1))} 
                      className="px-4 py-2 hover:bg-white/80 text-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={qty} 
                      min={1} 
                      max={product.stockQuantity || product.stockQty || 99} 
                      onChange={e => setQty(Number(e.target.value))} 
                      className="w-14 text-center border-x border-white/30 focus:outline-none bg-transparent"
                      aria-label="Quantity"
                    />
                    <button 
                      onClick={() => setQty(q => Math.min((product.stockQuantity || product.stockQty || 99), q + 1))} 
                      className="px-4 py-2 hover:bg-white/80 text-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="flex-1 py-2.5 btn-gradient rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
                    disabled={cartLoading || (product.stockQuantity ?? product.stockQty) <= 0}
                    onClick={async () => {
                      await addToCart(product._id, qty);
                    }}
                  >
                    {cartLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Adding to Cart...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* More from shop */}
        {shopProducts.length > 0 && (
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 text-gradient">
              More from {product.vendor?.shopName || product.vendor?.name || product.vendorId?.shopName || product.vendorId?.name}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shopProducts.map((p, index) => (
                <div 
                  key={p._id} 
                  className="bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/marketplace/product/${p._id}`)}
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={p.images && p.images.length > 0 ? (p.images[0]?.startsWith('/uploads') ? `http://localhost:5000${p.images[0]}` : p.images[0]) : '/placeholder.png'}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-medium text-sm mb-1 line-clamp-2">{p.name}</div>
                    <div className="text-gradient font-bold">Rs. {p.price?.toLocaleString() ?? p.price}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                to={`/marketplace/vendor/${product.vendor?._id || '#'}`} 
                className="btn-gradient inline-flex items-center justify-center py-2 px-6 rounded-lg"
              >
                Visit Shop
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
};

export default ProductDetailPage;
