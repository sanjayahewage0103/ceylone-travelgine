
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import TouristAuthPage from './pages/tourist/TouristAuthPage';
import VendorAuthPage from './pages/vendor/VendorAuthPage';
import RegisterVendor2 from './components/vendor/RegisterVendor2';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/tourist" element={<TouristAuthPage />} />
      <Route path="/vendor" element={<VendorAuthPage />} />
      <Route path="/vendor/register2" element={<RegisterVendor2 />} />
    </Routes>
  );
}

export default App;
