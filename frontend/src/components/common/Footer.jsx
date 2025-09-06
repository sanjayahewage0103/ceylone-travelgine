import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageCircle } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Top section with logo and main links */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and company info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img src="/ceylon-travelgine-logo.png" alt="Ceylon Travelgine" className="h-10 w-auto mr-3" 
                   onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = '/vite.svg'; // Fallback to vite logo if custom logo not found
                   }} 
              />
              <span className="text-xl font-bold text-teal-400">Ceylon Travelgine</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-sm">
              Your AI-Powered Smart Tourism Platform for Personalized Sri Lankan Experiences. Discover the beauty of Sri Lanka smarter, not harder.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.234.585 1.8 1.15.566.566.902 1.132 1.15 1.8.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.15 1.8c-.566.566-1.132.902-1.8 1.15-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.8-1.15 4.902 4.902 0 01-1.15-1.8c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.15-1.8A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/smart-itinerary" className="text-gray-300 hover:text-white transition-colors">Smart Itinerary</Link></li>
              <li><Link to="/tours" className="text-gray-300 hover:text-white transition-colors">Tour Packages</Link></li>
              <li><Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/marketplace/products" className="text-gray-300 hover:text-white transition-colors">Marketplace Products</Link></li>
              <li><Link to="/blogs" className="text-gray-300 hover:text-white transition-colors">Blogs</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Our Services</h3>
            <ul className="space-y-2">
              <li><Link to="/smart-itinerary" className="text-gray-300 hover:text-white transition-colors">AI Itinerary Planning</Link></li>
              <li><Link to="/business-intro" className="text-gray-300 hover:text-white transition-colors">Business Solutions</Link></li>
              <li><Link to="/guides" className="text-gray-300 hover:text-white transition-colors">Find Local Guides</Link></li>
              <li><Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">Sri Lankan Products</Link></li>
              <li><Link to="/marketplace/shops" className="text-gray-300 hover:text-white transition-colors">Local Vendors</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Temple Road, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-teal-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@ceylontravelgine.com</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-teal-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+94 11 234 5678</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Newsletter subscription */}
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400">Subscribe to our newsletter for travel tips and exclusive offers</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 w-full sm:w-64"
                />
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom footer */}
      <div className="bg-gray-950 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Ceylon Travelgine. All rights reserved.
          </div>
          <div className="flex space-x-6 items-center">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link>
            <span className="mx-2 text-gray-500">|</span>
            <Link to="/admin-login" className="text-teal-400 hover:text-white text-sm font-semibold transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Button (for all pages) */}
      <Link
        to="/chatbot-demo"
        className="fixed bottom-8 right-8 z-50 bg-teal-500 hover:bg-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200"
        aria-label="Open Chatbot Demo"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
      >
        <FiMessageCircle size={32} />
      </Link>
    </footer>
  );
};

export default Footer;
