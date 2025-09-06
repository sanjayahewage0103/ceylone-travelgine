
import { Link, useLocation } from 'react-router-dom';

const VendorSidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="w-64 fixed left-0 top-0 h-screen z-20 flex flex-col min-h-screen backdrop-blur-lg bg-white/70 border-r border-green-100 shadow-xl">
      <div className="p-6 text-2xl font-bold border-b border-green-200 text-green-700 bg-white/80 shadow">Vendor Dashboard</div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/vendor/dashboard"
          className={`block px-4 py-2 rounded-lg transition font-semibold ${pathname === '/vendor/dashboard' ? 'bg-green-100 text-green-800 shadow' : 'hover:bg-green-50 hover:text-green-700'}`}
        >
          My Products
        </Link>
        <Link
          to="/vendor/orders"
          className={`block px-4 py-2 rounded-lg transition font-semibold ${pathname === '/vendor/orders' ? 'bg-green-50 text-green-800 shadow' : 'hover:bg-green-50 hover:text-green-700'}`}
        >
          Manage Orders
        </Link>
        <Link
          to="/vendor/sales-dashboard"
          className={`block px-4 py-2 rounded-lg transition font-semibold ${pathname === '/vendor/sales-dashboard' ? 'bg-green-50 text-green-800 shadow' : 'hover:bg-green-50 hover:text-green-700'}`}
        >
          Sales Dashboard
        </Link>
        <Link
          to="/vendor/ai-forecast"
          className={`block px-4 py-2 rounded-lg transition font-semibold ${pathname === '/vendor/ai-forecast' ? 'bg-green-50 text-green-800 shadow' : 'hover:bg-green-50 hover:text-green-700'}`}
        >
          AI Demand Forecast
        </Link>
      </nav>
    </aside>
  );
};

export default VendorSidebar;
