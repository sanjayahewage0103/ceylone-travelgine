import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/products/manage', label: 'Manage Products' },
];

const AdminLayout = () => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">Admin</div>
        <nav className="flex-1 p-4">
          {sidebarLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block py-2 px-3 rounded mb-2 ${location.pathname.startsWith(link.to) ? 'bg-gray-700' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
