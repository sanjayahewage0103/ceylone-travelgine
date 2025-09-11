
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { path: '/admin/users', name: 'Manage Users', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { path: '/admin/products/manage', name: 'Manage Products', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { path: '/admin/products/pending', name: 'Pending Products', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
  ];

  return (
    <>
      <div className="relative min-h-screen flex bg-gray-100">
        <img src={'/Ceylon.png'} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" style={{ filter: 'blur(8px) brightness(0.7)' }} />
        <div className="fixed inset-0 bg-black bg-opacity-50 z-0" />
        <aside className="w-64 fixed left-0 top-0 h-screen z-20 flex flex-col min-h-screen backdrop-blur-lg bg-gradient-to-b from-gray-800/90 via-gray-800/80 to-gray-900/80 border-r border-gray-700 shadow-xl">
          <div className="p-6 text-center border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900/90 shadow">
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
            <div className="h-0.5 w-20 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="py-6 px-3">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 px-3">
              Menu
            </div>
            <nav className="flex-1 space-y-2">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md border border-blue-500'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white group'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-4 border-t border-gray-700">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600 shadow-sm mb-3">
              <div className="text-sm font-semibold text-white mb-1">Need Help?</div>
              <p className="text-xs text-gray-400 mb-2">Contact support for assistance.</p>
              <a href="mailto:support@ceylone-travelgine.com" className="text-xs text-blue-400 hover:underline">support@ceylone-travelgine.com</a>
            </div>
            
            <Link 
              to="/login" 
              onClick={() => localStorage.removeItem('token')}
              className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Link>
          </div>
        </aside>
        <main className="flex-1 relative z-10 p-4 md:p-8 flex flex-col gap-8 ml-64">
          {children}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
