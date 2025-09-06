// Button.jsx: Reusable button component
import React from 'react';


const Button = ({ children, onClick, type = 'button', fullWidth, className, ...props }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded transition ${className || 'bg-blue-600 text-white hover:bg-blue-700'} ${fullWidth ? 'w-full' : ''}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
