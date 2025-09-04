
import { Link, useLocation } from 'react-router-dom';

const VendorSidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="w-64 bg-purple-800 text-white flex flex-col min-h-screen">
      <div className="p-6 text-2xl font-bold border-b border-purple-700">Vendor Dashboard</div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/vendor/dashboard"
          className={`block px-4 py-2 rounded ${pathname === '/vendor/dashboard' ? 'bg-purple-700 font-bold' : 'hover:bg-purple-700'}`}
        >
          My Products
        </Link>
        <Link
          to="/vendor/orders"
          className={`block px-4 py-2 rounded ${pathname === '/vendor/orders' ? 'bg-purple-700 font-bold' : 'hover:bg-purple-700'}`}
        >
          Manage Orders
        </Link>
        <Link
          to="/vendor/sales-dashboard"
          className={`block px-4 py-2 rounded ${pathname === '/vendor/sales-dashboard' ? 'bg-purple-700 font-bold' : 'hover:bg-purple-700'}`}
        >
          Sales Dashboard
        </Link>
      </nav>
    </aside>
  );
};

export default VendorSidebar;
