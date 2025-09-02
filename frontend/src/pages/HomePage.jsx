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

    </div>
  </div>
);

export default HomePage;
