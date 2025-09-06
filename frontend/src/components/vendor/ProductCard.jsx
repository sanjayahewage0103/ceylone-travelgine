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
    <div 
      className="group backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/75 to-green-50/70 rounded-xl shadow-lg 
      p-5 flex flex-col w-full relative border border-green-100 hover:shadow-xl hover:border-green-200 
      transition-all duration-300 hover:-translate-y-1"
    >
      {/* Colorful top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-yellow-300 to-green-400 rounded-t-xl"></div>
      
      {/* Image Gallery with Glass Effect */}
      <div className="h-52 w-full mb-5 flex items-center justify-center bg-gradient-to-br from-green-50/80 via-white/70 to-yellow-50/60 
        rounded-lg relative overflow-hidden border border-green-100/50 backdrop-blur-sm shadow-sm group-hover:shadow-md transition-all">
        {hasImages ? (
          <>
            <img 
              src={getImageUrl(images[imgIdx])} 
              alt={product.name} 
              className="h-48 object-contain transform transition-all duration-300 hover:scale-110 group-hover:scale-105" 
            />
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImg} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md 
                  hover:bg-green-100 transition-colors opacity-70 hover:opacity-100 group-hover:opacity-90"
                  title="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button 
                  onClick={nextImg} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md 
                  hover:bg-green-100 transition-colors opacity-70 hover:opacity-100 group-hover:opacity-90"
                  title="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/70 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
                  {images.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIdx(i);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${i === imgIdx 
                        ? 'bg-green-500 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'}`}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>No Image</span>
          </div>
        )}
        
        {/* Status Badge */}
        {product.isActive ? (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold px-2.5 py-1 
            rounded-full shadow-sm border border-green-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            Active
          </div>
        ) : (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-400 to-red-500 text-white text-xs font-bold px-2.5 py-1 
            rounded-full shadow-sm border border-red-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            Inactive
          </div>
        )}
        
        {/* Edit Button */}
        {onEdit && (
          <button 
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md 
            hover:bg-green-100 transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110" 
            title="Edit Product" 
            onClick={onEdit}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Product Details */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-green-800 mb-1 line-clamp-1 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>
        
        <div className="text-sm text-yellow-700 mb-3 bg-gradient-to-r from-yellow-50 to-yellow-100/60 inline-block px-2.5 py-0.5 
          rounded-full w-fit border border-yellow-100/50 shadow-sm">
          {product.category}
        </div>
        
        <div className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </div>
        
        <div className="flex justify-between items-center mt-auto border-t border-green-100/50 pt-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-50 to-green-100/60 p-1.5 rounded-md border border-green-100/50 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="font-medium text-gray-700">
              Stock: <span className={`font-bold ${product.stockQuantity > 10 ? 'text-green-700' : product.stockQuantity > 0 ? 'text-yellow-700' : 'text-red-700'}`}>
                {product.stockQuantity}
              </span>
            </div>
          </div>
          
          <div className="text-xl font-bold bg-gradient-to-br from-green-600 to-green-700 text-transparent bg-clip-text">
            LKR {parseFloat(product.price).toLocaleString()}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-3 flex justify-between items-center">
          <div className="text-gray-400">ID: {product.originalItemId || product._id?.substring(0, 8)}</div>
          <div className="bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 text-gray-500 text-xs">
            {new Date(product.createdAt || Date.now()).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
