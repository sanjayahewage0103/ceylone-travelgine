import TouristMyToursPage from './pages/tourist/TouristMyToursPage';
import TouristOrderDetailPage from './pages/tourist/TouristOrderDetailPage';
import TouristOrdersPage from './pages/tourist/TouristOrdersPage';
import GuideProfile from './pages/GuideProfile.jsx';
import TouristForecast from './components/guide/TouristForecast';
import GuideBlogs from './pages/GuideBlogs';
import GuideBlogEditor from './pages/GuideBlogEditor';
import BlogDetail from './pages/BlogDetail';
import AllBlogs from './pages/AllBlogs';
import ViewBlogPost from './pages/ViewBlogPost';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import CategoryPage from './pages/marketplace/CategoryPage';
import ProductListPage from './pages/marketplace/ProductListPage';
import ShopListPage from './pages/marketplace/ShopListPage';
import ProductDetailPage from './pages/marketplace/ProductDetailPage';
import CheckoutPage from './pages/marketplace/CheckoutPage';
import OrderConfirmationPage from './pages/marketplace/OrderConfirmationPage';
import VendorShopProfilePage from './pages/marketplace/VendorShopProfilePage';
import CartPage from './pages/marketplace/CartPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import TouristAuthPage from './pages/tourist/TouristAuthPage';
import VendorAuthPage from './pages/vendor/VendorAuthPage';
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import VendorOrdersPage from './pages/vendor/VendorOrdersPage';
import VendorSalesDashboardPage from './pages/vendor/VendorSalesDashboardPage';
import GuideAuthPage from './pages/guide/GuideAuthPage';
import GuideRegisterSinglePage from './components/guide/GuideRegisterSinglePage';
import GuideProfilePage from './pages/guide/GuideProfilePage';
import TourPackageManager from './pages/TourPackageManager';
import AllTours from './pages/AllTours';
import TourPackageDetail from './pages/TourPackageDetail';
import VendorForecastingDashboard from './pages/vendor/VendorForecastingDashboard';
import VendorAIForecastPage from './pages/vendor/VendorAIForecastPage';
import DashboardPage from './pages/admin/DashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import PendingProductsPage from './pages/admin/PendingProductsPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import AdminLayout from './layouts/AdminLayout';

import GuideManageBookings from './pages/GuideManageBookings';
import GuideCalendarNotes from './pages/GuideCalendarNotes';
import SmartItineraryDashboard from './pages/trip/SmartItineraryDashboard';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blogs" element={<AllBlogs />} />
      <Route path="/guide/blogs" element={<GuideBlogs />} />
      <Route path="/guide/blogs/new" element={<GuideBlogEditor />} />
      <Route path="/guide/blogs/:id" element={<BlogDetail />} />
      <Route path="/guide/blogs/edit/:id" element={<GuideBlogEditor editMode={true} />} />
    <Route path="/blogs/:id" element={<ViewBlogPost />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/marketplace/products" element={<ProductListPage />} />
      <Route path="/marketplace/product/:productId" element={<ProductDetailPage />} />
      <Route path="/marketplace/shops" element={<ShopListPage />} />
      <Route path="/marketplace/vendor/:vendorId" element={<VendorShopProfilePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
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
      <Route path="/vendor/orders" element={<VendorOrdersPage />} />
      <Route path="/vendor/sales-dashboard" element={<VendorSalesDashboardPage />} />
      <Route path="/vendor/ai-forecast" element={<VendorAIForecastPage />} />
      {/* <Route path="/vendor/register2" element={<RegisterVendor2 />} /> */}
      <Route path="/guide" element={<GuideAuthPage />} />
      <Route path="/guide/register2" element={<GuideRegisterSinglePage />} />
      <Route path="/guide/tour-packages" element={<TourPackageManager />} />
      <Route path="/tourist/login" element={<TouristAuthPage />} />
      <Route path="/vendor/login" element={<VendorAuthPage />} />
      <Route path="/guide/login" element={<GuideRegisterSinglePage />} />
      <Route path="/guide/profile" element={<GuideProfilePage />} />
      <Route path="/tours" element={<AllTours />} />
      <Route path="/tours/:id" element={<TourPackageDetail />} />
  <Route path="/guide/manage-bookings" element={<GuideManageBookings />} />
  <Route path="/guide/calendar-notes" element={<GuideCalendarNotes />} />
  <Route path="/guide/tourist-forecast" element={<TouristForecast />} />
  {/* Tourist personal orders */}
  <Route path="/tourist/my-orders" element={<TouristOrdersPage />} />
  <Route path="/tourist/my-orders/:orderId" element={<TouristOrderDetailPage />} />
  {/* Tourist my tours */}
  <Route path="/tourist/my-tours" element={<TouristMyToursPage />} />
  {/* Public guide profile/portfolio */}
  <Route path="/guides/:id" element={<GuideProfile />} />
  <Route path="/smart-itinerary" element={<SmartItineraryDashboard />} />
    </Routes>
  );
}

export default App;
