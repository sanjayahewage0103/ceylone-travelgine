// HomePage.jsx: Simple navigation page
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-3xl font-bold mb-6">Welcome to Ceylone Travelgine</h1>
    <div className="space-y-4">
      <Link to="/admin/login">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Admin Login</button>
      </Link>
      <Link to="/tourist">
        <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">Tourist Portal</button>
      </Link>
      <Link to="/vendor">
        <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">Vendor Portal</button>
      </Link>
      <Link to="/guide/register2">
        <button className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition">Register as a Tour Guide (Single Page)</button>
      </Link>
    </div>
  </div>
);

export default HomePage;
