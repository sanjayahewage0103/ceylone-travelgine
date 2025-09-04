import React, { useState } from 'react';



const getImageUrl = (image) => {
  if (!image) return '/product.jpg';
  if (image.startsWith('/uploads')) {
    return `http://localhost:5000${image}`;
  }
  return image;
};


import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const [qty, setQty] = useState(1);
  // Use the first image from the images array, fallback to default
  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image;
  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/marketplace/product/${product._id || product.id}`);
  };
  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer"
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') handleClick(e); }}
      role="button"
      aria-label={`View details for ${product.name}`}
    >
      <img src={getImageUrl(image)} alt={product.name} className="h-24 w-24 object-cover rounded mb-2" />
      <span className="font-semibold text-gray-800 text-center mb-1">{product.name}</span>
      <span className="text-green-700 font-bold mb-1">Rs. {product.price}</span>
      <span className="text-xs text-gray-500">{product.category}</span>
      <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
        <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
        <input type="number" value={qty} min={1} max={99} onChange={e => setQty(Number(e.target.value))} className="w-10 text-center border rounded" />
        <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setQty(q => Math.min(99, q + 1))}>+</button>
        <button
          className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60"
          disabled={cartLoading}
          onClick={async () => {
            await addToCart(product._id, qty);
          }}
        >
          {cartLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
