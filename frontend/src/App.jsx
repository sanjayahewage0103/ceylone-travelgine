import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import CategoryPage from './pages/marketplace/CategoryPage';
import ProductListPage from './pages/marketplace/ProductListPage';
import ShopListPage from './pages/marketplace/ShopListPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import TouristAuthPage from './pages/tourist/TouristAuthPage';
import VendorAuthPage from './pages/vendor/VendorAuthPage';
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import GuideAuthPage from './pages/guide/GuideAuthPage';
import GuideRegisterSinglePage from './components/guide/GuideRegisterSinglePage';
import DashboardPage from './pages/admin/DashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import PendingProductsPage from './pages/admin/PendingProductsPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import AdminLayout from './layouts/AdminLayout';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
  <Route path="/admin/login" element={<AdminLoginPage />} />
  <Route path="/marketplace" element={<MarketplacePage />} />
  <Route path="/marketplace/products" element={<ProductListPage />} />
  <Route path="/marketplace/shops" element={<ShopListPage />} />
  <Route path="/marketplace/category/:categoryName" element={<CategoryPage />} />
      {/* Admin routes with sidebar layout */}
      <Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<DashboardPage />} />
  <Route path="users" element={<ManageUsersPage />} />
  <Route path="products/manage" element={<ManageProductsPage />} />
      </Route>
      {/* Other auth routes */}
      <Route path="/tourist" element={<TouristAuthPage />} />
  <Route path="/vendor" element={<VendorAuthPage />} />
  <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
      {/* <Route path="/vendor/register2" element={<RegisterVendor2 />} /> */}
      <Route path="/guide" element={<GuideAuthPage />} />
      <Route path="/guide/register2" element={<GuideRegisterSinglePage />} />
      <Route path="/tourist/login" element={<TouristAuthPage />} />
      <Route path="/vendor/login" element={<VendorAuthPage />} />
      <Route path="/guide/login" element={<GuideRegisterSinglePage />} />
    </Routes>
  );
}

export default App;
