import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';

const getImageUrl = (image) => {
  if (!image) return '/product.jpg';
  if (image.startsWith('/uploads')) {
    return `http://localhost:5000${image}`;
  }
  return image;
};


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const [qty, setQty] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  
  // Use the first image from the images array, fallback to default
  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image;
  
  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/marketplace/product/${product._id || product.id}`);
  };
  
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="glass-card rounded-xl shadow-sm hover:shadow-lg transition-all p-4 flex flex-col cursor-pointer h-full relative group"
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') handleClick(e); }}
      role="button"
      aria-label={`View details for ${product.name}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sale or New tag */}
      {product.isNew && (
        <span className="absolute top-3 left-3 bg-blue-500/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
          NEW
        </span>
      )}
      {product.discountPercentage > 0 && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
          -{product.discountPercentage}%
        </span>
      )}
      
      {/* Wishlist button */}
      <motion.button 
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-3 right-3 backdrop-blur-md bg-white/60 hover:bg-white/90 p-2 rounded-full shadow-md z-10 text-gray-500 hover:text-red-500 transition-colors border border-white/20"
        onClick={(e) => {
          e.stopPropagation();
          // Add wishlist functionality here
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </motion.button>
      
      {/* Product Image */}
      <div className="relative mb-4 overflow-hidden rounded-xl h-48 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <img 
          src={getImageUrl(image)} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
          }}
        />
      </div>
      
      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <div className="mb-3">
          <span className="text-xs font-medium text-teal-600 uppercase tracking-wider">{product.category || 'Uncategorized'}</span>
          <h3 className="font-medium text-gray-800 group-hover:text-gradient transition-colors line-clamp-2 leading-snug mt-1">
            {product.name}
          </h3>
        </div>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-xs text-gray-500">({product.reviewCount || 0})</span>
            </div>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center mt-auto">
          {product.discountPercentage > 0 && (
            <span className="text-gray-400 text-sm line-through mr-2">Rs. {product.originalPrice || Math.round(product.price * (100 / (100 - product.discountPercentage)))}</span>
          )}
          <span className="text-gradient font-bold text-lg">Rs. {product.price?.toLocaleString()}</span>
        </div>
        
        {/* Quantity and Add to Cart controls */}
        <div 
          className={`flex items-center gap-2 mt-3 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-80 md:opacity-0 group-hover:opacity-100'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex border border-white/30 rounded-md overflow-hidden backdrop-blur-sm bg-white/50">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="px-2 py-1 hover:bg-white/80 text-gray-700 transition-colors" 
              onClick={() => setQty(q => Math.max(1, q - 1))}
            >
              -
            </motion.button>
            <input 
              type="number" 
              value={qty} 
              min={1} 
              max={99} 
              onChange={e => setQty(Number(e.target.value))} 
              className="w-10 text-center border-x border-white/30 focus:outline-none bg-transparent"
              aria-label="Quantity"
            />
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="px-2 py-1 hover:bg-white/80 text-gray-700 transition-colors" 
              onClick={() => setQty(q => Math.min(99, q + 1))}
            >
              +
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-2 btn-gradient rounded-md flex items-center justify-center gap-1 disabled:opacity-60"
            disabled={cartLoading}
            onClick={async (e) => {
              e.stopPropagation();
              await addToCart(product._id || product.id, qty);
            }}
          >
            {cartLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
