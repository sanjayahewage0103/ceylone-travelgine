import React from 'react';

const BannerUploader = ({ imageUrl, onChange, label, editable }) => {
  return (
    <div className="relative w-full h-32 mb-2 flex items-center justify-center">
      <img
        src={imageUrl || '/default-banner.png'}
        alt={label}
        className="w-full h-32 object-cover rounded-xl border"
      />
      {editable && (
        <label className="absolute bottom-2 right-2 bg-cyan-600 text-white rounded-full p-2 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" /></svg>
          <input type="file" accept="image/*" className="hidden" onChange={onChange} />
        </label>
      )}
      <span className="absolute left-4 bottom-2 text-xs text-gray-400 bg-black bg-opacity-40 px-2 py-1 rounded">{label}</span>
    </div>
  );
};

export default BannerUploader;
