import React from 'react';



const getImageUrl = (image) => {
  if (!image) return '/product.jpg';
  if (image.startsWith('/uploads')) {
    return `http://localhost:5000${image}`;
  }
  return image;
};

const ProductCard = ({ product }) => {
  // Use the first image from the images array, fallback to default
  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined;
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer">
      <img src={getImageUrl(image)} alt={product.name} className="h-24 w-24 object-cover rounded mb-2" />
      <span className="font-semibold text-gray-800 text-center mb-1">{product.name}</span>
      <span className="text-green-700 font-bold mb-1">Rs. {product.price}</span>
      <span className="text-xs text-gray-500">{product.category}</span>
    </div>
  );
};

export default ProductCard;
