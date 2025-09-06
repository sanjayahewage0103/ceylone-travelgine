import React from 'react';
import { useNavigate } from 'react-router-dom';

const getImageUrl = (image) => {
  if (!image) return '/placeholder.png';
  if (image.startsWith('/uploads')) {
    return `http://localhost:5000${image}`;
  }
  return image;
};

const CartItemCard = ({ item, onRemove, onUpdate }) => {
  const { productId, quantity, price, selectedOptions } = item;
  const product = productId;
  const navigate = useNavigate();
  const shopName =
    (product.vendor && (product.vendor.shopName || product.vendor.name)) ||
    (product.vendorId && (product.vendorId.shopName || product.vendorId.name)) ||
    '';
  const category = product.category?.label || product.category || '';
  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl backdrop-blur-sm bg-white/60 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300">
      <div
        className="cursor-pointer group relative overflow-hidden rounded-xl"
        onClick={() => navigate(`/marketplace/product/${product._id}`)}
        title="View product details"
      >
        <img 
          src={getImageUrl(image)} 
          alt={product.name} 
          className="w-24 h-24 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
          <span className="text-white text-xs font-medium pb-1">View Details</span>
        </div>
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div
          className="font-semibold text-lg cursor-pointer bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent hover:from-green-800 hover:to-teal-700 transition-colors"
          onClick={() => navigate(`/marketplace/product/${product._id}`)}
        >
          {product.name}
        </div>
        <div className="text-xs text-gray-500 flex flex-col sm:flex-row sm:gap-2 items-center sm:items-start mt-1">
          <span className="px-2 py-1 bg-green-50 rounded-full text-green-700">{category}</span>
          <span className="px-2 py-1 bg-blue-50 rounded-full text-blue-700">{shopName}</span>
        </div>
        {(selectedOptions?.size || selectedOptions?.color) && (
          <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
            {selectedOptions?.size && (
              <span className="text-xs px-2 py-1 rounded-full border border-gray-200 bg-gray-50">
                Size: {selectedOptions.size}
              </span>
            )}
            {selectedOptions?.color && (
              <span className="text-xs px-2 py-1 rounded-full border border-gray-200 bg-gray-50">
                Color: {selectedOptions.color}
              </span>
            )}
          </div>
        )}
        <div className="text-gray-800 font-bold mt-2">Rs. {price}</div>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <button 
          className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 rounded-full shadow-sm border border-green-100 text-green-700 transition-all duration-300" 
          onClick={() => onUpdate(item, Math.max(1, quantity - 1))}
        >
          -
        </button>
        <span className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-100 font-medium text-gray-800">
          {quantity}
        </span>
        <button 
          className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 rounded-full shadow-sm border border-green-100 text-green-700 transition-all duration-300" 
          onClick={() => onUpdate(item, quantity + 1)}
        >
          +
        </button>
      </div>
      <button 
        className="mt-4 sm:mt-0 ml-2 w-8 h-8 flex items-center justify-center text-red-500 hover:text-white bg-white hover:bg-red-500 rounded-full border border-red-200 transition-all duration-300" 
        onClick={() => onRemove(item)}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2"/></svg>
      </button>
    </div>
  );
};

export default CartItemCard;
