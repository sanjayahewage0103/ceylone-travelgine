import React, { useState } from 'react';


const getImageUrl = (url) => url.startsWith('http') ? url : `http://localhost:5000${url}`;


const ProductCard = ({ product, onEdit }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const images = product.images || [];
  const hasImages = images.length > 0;

  const prevImg = e => {
    e.stopPropagation();
    setImgIdx(idx => (idx === 0 ? images.length - 1 : idx - 1));
  };
  const nextImg = e => {
    e.stopPropagation();
    setImgIdx(idx => (idx === images.length - 1 ? 0 : idx + 1));
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col w-72 relative">
      <div className="h-40 w-full mb-2 flex items-center justify-center bg-gray-100 rounded relative">
        {hasImages ? (
          <>
            <img src={getImageUrl(images[imgIdx])} alt={product.name} className="h-36 object-contain" />
            {images.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow text-lg" title="Previous image">&#8592;</button>
                <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow text-lg" title="Next image">&#8594;</button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === imgIdx ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
        {onEdit && (
          <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow" title="Edit Product" onClick={onEdit}>
            <span className="material-icons">edit</span>
          </button>
        )}
      </div>
      <div className="font-bold text-lg mb-1">{product.name}</div>
      <div className="text-sm text-gray-600 mb-1">{product.category}</div>
      <div className="text-sm mb-1">{product.description}</div>
      <div className="text-sm mb-1">Stock: {product.stockQuantity}</div>
      <div className="text-sm mb-1">Price: LKR {product.price}</div>
      <div className="text-xs mb-1">Status: {product.isActive ? 'Active' : 'Inactive'}</div>
      <div className="text-xs text-gray-500">Original ID: {product.originalItemId}</div>
    </div>
  );
};

export default ProductCard;
