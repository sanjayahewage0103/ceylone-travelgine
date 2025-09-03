import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import TouristAuthPage from './pages/tourist/TouristAuthPage';
import VendorAuthPage from './pages/vendor/VendorAuthPage';
// import RegisterVendor2 from './components/vendor/RegisterVendor2';
import GuideAuthPage from './pages/guide/GuideAuthPage';
import GuideRegisterSinglePage from './components/guide/GuideRegisterSinglePage';
import DashboardPage from './pages/admin/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/tourist" element={<TouristAuthPage />} />
      <Route path="/vendor" element={<VendorAuthPage />} />
  {/* <Route path="/vendor/register2" element={<RegisterVendor2 />} /> */}
  <Route path="/guide" element={<GuideAuthPage />} />
  <Route path="/guide/register2" element={<GuideRegisterSinglePage />} />
      <Route path="/tourist/login" element={<TouristAuthPage />} />
      <Route path="/vendor/login" element={<VendorAuthPage />} />
      <Route path="/guide/login" element={<GuideRegisterSinglePage />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
