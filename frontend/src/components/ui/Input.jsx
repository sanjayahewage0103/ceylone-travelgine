// Input.jsx: Reusable input component
import React from 'react';

const Input = ({ label, type = 'text', value, onChange, ...props }) => (
  <div className="mb-4">
    {label && <label className="block mb-1 font-medium">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
      {...props}
    />
  </div>
);

export default Input;
