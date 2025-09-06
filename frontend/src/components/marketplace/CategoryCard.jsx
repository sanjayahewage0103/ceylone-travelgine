import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  // Handle both the old and new prop patterns
  const label = category?.label || category;
  const image = category?.image || '/category-placeholder.jpg';
  const count = category?.count;
  
  // Fallback image handling
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150?text=Category';
  };
  
  return (
    <Link 
      to={`/marketplace/category/${encodeURIComponent(label?.toLowerCase?.() || 'category')}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center cursor-pointer group overflow-hidden"
    >
      <div className="h-20 w-20 rounded-full overflow-hidden bg-green-50 relative mb-3">
        <img 
          src={image} 
          alt={label} 
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/30 group-hover:opacity-0 transition-opacity"></div>
      </div>
      
      <span className="font-medium text-gray-800 text-center group-hover:text-green-600 transition-colors">
        {label}
      </span>
      
      {count !== undefined && (
        <span className="text-xs text-gray-500 mt-1">
          {count} products
        </span>
      )}
    </Link>
  );
};

export default CategoryCard;
