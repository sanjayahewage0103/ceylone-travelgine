import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VendorApp from "./vendor/App";
import GuideApp from "./tourGuide/App";
import TouristApp from "./tourist/TouristApp";
import AdminApp from "./admin/AdminApp";

function App() {
  return (
    <Router>
      <Routes>
        {/* Vendor onboarding flow */}
        <Route path="/vendor/*" element={<VendorApp />} />
        {/* Tour Guide onboarding flow */}
        <Route path="/guide/*" element={<GuideApp />} />
        {/* Tourist login & registration flow */}
        <Route path="/tourist/*" element={<TouristApp />} />
        {/* Admin login flow */}
        <Route path="/admin/*" element={<AdminApp />} />
        {/* Homepage with navigation links */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-white">
            <div className="bg-white bg-opacity-90 rounded-xl shadow-2xl p-10 w-full max-w-lg border border-gray-200 animate-fade-in">
              <h1 className="text-3xl font-extrabold text-primary mb-6 text-center">Welcome to Ceylone Travelgine</h1>
              <p className="text-gray-600 mb-8 text-center">Select your portal to login or register:</p>
              <div className="grid grid-cols-1 gap-4">
                <Link to="/tourist" className="block w-full bg-primary text-white py-3 rounded-lg font-semibold text-center shadow hover:bg-secondary transition">Tourist Portal</Link>
                <Link to="/vendor" className="block w-full bg-secondary text-white py-3 rounded-lg font-semibold text-center shadow hover:bg-primary transition">Vendor Portal</Link>
                <Link to="/guide" className="block w-full bg-teal-600 text-white py-3 rounded-lg font-semibold text-center shadow hover:bg-primary transition">Tour Guide Portal</Link>
                <Link to="/admin" className="block w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-center shadow hover:bg-primary transition">Admin Portal</Link>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
