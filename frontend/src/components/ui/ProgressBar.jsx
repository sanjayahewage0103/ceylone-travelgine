import React from 'react';

const ProgressBar = ({ progress = 0 }) => (
  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
    <div
      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

export default ProgressBar;
