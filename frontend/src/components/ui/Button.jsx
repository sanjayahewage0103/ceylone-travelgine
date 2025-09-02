// Button.jsx: Reusable button component
import React from 'react';

const Button = ({ children, onClick, type = 'button', ...props }) => (
  <button
    type={type}
    onClick={onClick}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    {...props}
  >
    {children}
  </button>
);

export default Button;
