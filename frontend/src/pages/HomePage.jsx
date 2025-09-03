// HomePage.jsx: Simple navigation page
import React from 'react';
import { Link } from 'react-router-dom';
import MainNavbar from '../components/common/MainNavbar';


const HomePage = () => (
  <>  
    <MainNavbar />
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to Ceylone Travelgine</h1>
      <div className="space-y-4">
        <Link to="/admin/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Admin Login</button>
        </Link>
        <Link to="/tourist/login">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Tourist Login</button>
        </Link>
        <Link to="/guide/login">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Guide Login</button>
        </Link>
        <Link to="/vendor/login">
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">Vendor Login</button>
        </Link>
      </div>
    </div>
  </>
);

export default HomePage;
