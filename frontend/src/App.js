import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VendorApp from "./vendor/App";
// TODO: Import other role-based apps (TouristApp, GuideApp, AdminApp) when ready

function App() {
  return (
    <Router>
      <Routes>
        {/* Vendor onboarding flow */}
        <Route path="/vendor/*" element={<VendorApp />} />
        {/* TODO: Add routes for /tourist, /guide, /admin */}
        {/* <Route path="/tourist/*" element={<TouristApp />} /> */}
        {/* <Route path="/guide/*" element={<GuideApp />} /> */}
        {/* <Route path="/admin/*" element={<AdminApp />} /> */}
        {/* Default route can be a landing page or redirect */}
        <Route path="*" element={<div>Welcome to Ceylone Travelgine Platform</div>} />
      </Routes>
    </Router>
  );
}

export default App;
