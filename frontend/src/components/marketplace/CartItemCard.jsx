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
    <div className="flex items-center gap-4 border-b py-4">
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/marketplace/product/${product._id}`)}
        title="View product details"
      >
        <img src={getImageUrl(image)} alt={product.name} className="w-20 h-20 object-cover rounded" />
      </div>
      <div className="flex-1">
        <div
          className="font-semibold text-base cursor-pointer hover:underline"
          onClick={() => navigate(`/marketplace/product/${product._id}`)}
        >
          {product.name}
        </div>
        <div className="text-xs text-gray-500">Category: {category}</div>
        <div className="text-xs text-gray-500">Shop: {shopName}</div>
        {selectedOptions?.size && <div className="text-sm text-gray-500">Size: {selectedOptions.size}</div>}
        {selectedOptions?.color && <div className="text-sm text-gray-500">Color: {selectedOptions.color}</div>}
        <div className="text-gray-700 font-bold mt-1">Rs. {price}</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => onUpdate(item, Math.max(1, quantity - 1))}>-</button>
        <span className="w-6 text-center">{quantity}</span>
        <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => onUpdate(item, quantity + 1)}>+</button>
      </div>
      <button className="ml-2 text-red-500 hover:text-red-700" onClick={() => onRemove(item)}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2"/></svg>
      </button>
    </div>
  );
};

export default CartItemCard;
