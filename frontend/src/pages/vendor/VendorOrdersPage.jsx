import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BusinessNavbar from '../../components/common/BusinessNavbar';
import orderService from '../../services/orderService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};


const OrderDetailModal = ({ order, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div 
      className="bg-gradient-to-br from-white/95 via-white/90 to-green-50/90 rounded-xl shadow-xl border border-green-200/50 backdrop-blur-md w-full max-w-lg relative overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-yellow-400 to-green-500"></div>
      
      <div className="flex justify-between items-center border-b border-green-100 p-4 bg-green-50/50">
        <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Order: {order.orderId}
        </h2>
        <button 
          className="rounded-full h-8 w-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/70 rounded-lg p-3 border border-green-100 shadow-sm">
            <div className="text-xs uppercase text-gray-500 font-medium mb-1">Status</div>
            <div className="flex items-center">
              {order.orderStatus === 'Completed' && <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>}
              {order.orderStatus === 'Pending' && <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>}
              {order.orderStatus === 'Rejected' && <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>}
              {(order.orderStatus !== 'Completed' && order.orderStatus !== 'Pending' && order.orderStatus !== 'Rejected') && 
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>}
              <span className="font-medium text-gray-800">{order.orderStatus}</span>
            </div>
          </div>
          
          <div className="bg-white/70 rounded-lg p-3 border border-green-100 shadow-sm">
            <div className="text-xs uppercase text-gray-500 font-medium mb-1">Order Date</div>
            <div className="font-medium text-gray-800">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</div>
          </div>
          
          {order.orderStatus === 'Completed' && (
            <div className="bg-white/70 rounded-lg p-3 border border-green-100 shadow-sm">
              <div className="text-xs uppercase text-gray-500 font-medium mb-1">Completed At</div>
              <div className="font-medium text-gray-800">{order.updatedAt ? new Date(order.updatedAt).toLocaleString() : 'N/A'}</div>
            </div>
          )}
        </div>
        
        <div className="bg-white/70 rounded-lg p-4 border border-green-100 shadow-sm mb-4">
          <div className="text-sm font-semibold text-green-800 mb-2">Customer Information</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs uppercase text-gray-500 mb-0.5">Name</div>
              <div className="text-sm">{order.user?.fullName || order.userId?.fullName || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500 mb-0.5">Contact</div>
              <div className="text-sm">{order.contactNumber || 'N/A'}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs uppercase text-gray-500 mb-0.5">Delivery</div>
              <div className="text-sm">{order.deliveryMethod} {order.deliveryAddress && `- ${order.deliveryAddress}`}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/70 rounded-lg p-4 border border-green-100 shadow-sm mb-4">
          <div className="text-sm font-semibold text-green-800 mb-2">Payment Information</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs uppercase text-gray-500 mb-0.5">Method</div>
              <div className="text-sm">{order.paymentMethod || 'Cash'}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500 mb-0.5">Status</div>
              <div className="text-sm font-medium">
                {order.paymentStatus === 'Paid' && (
                  <span className="text-green-600">● Paid</span>
                )}
                {order.paymentStatus === 'Pending' && (
                  <span className="text-yellow-600">● Pending</span>
                )}
                {(!order.paymentStatus || order.paymentStatus === 'Unpaid') && (
                  <span className="text-red-600">● Unpaid</span>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-xs uppercase text-gray-500 mb-0.5">Total Amount</div>
              <div className="text-lg font-bold text-green-800">LKR {order.totalAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/70 rounded-lg p-4 border border-green-100 shadow-sm">
          <div className="text-sm font-semibold text-green-800 mb-3 flex items-center justify-between">
            <span>Order Items</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{order.items.length} Items</span>
          </div>
          <ul className="divide-y divide-green-100">
            {order.items.map(item => (
              <li key={item.productId} className="py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 text-xs font-bold text-green-800">
                    {item.quantity}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-gray-800">LKR {item.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-green-100 bg-gradient-to-r from-green-50 to-white/80 flex justify-end">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-white border border-green-300 rounded-md text-green-700 hover:bg-green-50 font-medium shadow-sm transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    orderService.getVendorOrders()
      .then(setOrders)
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setLoading(true);
      orderService.getVendorOrders()
        .then(setOrders)
        .catch(() => setError('Failed to load orders.'))
        .finally(() => setLoading(false));
    } catch {
      setError('Failed to update order status.');
    }
  };

  const handleViewDetails = (order) => setSelectedOrder(order);

  return (
    <>
      <BusinessNavbar />
  <div className="relative min-h-screen flex bg-gray-100">
        {/* Background image with blur and overlay */}
  <img src={'/Ceylon.png'} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" style={{ filter: 'blur(8px) brightness(0.85)' }} />
        <div className="fixed inset-0 bg-white bg-opacity-60 z-0" />
  <aside className="w-64 fixed left-0 top-0 h-screen z-20 flex flex-col min-h-screen backdrop-blur-lg bg-gradient-to-b from-white/90 via-white/80 to-green-50/80 border-r border-green-200 shadow-xl">
          <div className="p-6 text-center border-b border-green-200 bg-gradient-to-r from-green-50 to-white/90 shadow">
            <h2 className="text-2xl font-bold text-green-700">Vendor Dashboard</h2>
            <div className="h-0.5 w-20 bg-gradient-to-r from-green-500 to-yellow-400 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="py-6 px-3">
            <div className="text-xs text-green-700 font-semibold uppercase tracking-wider mb-2 px-3">Menu</div>
            <nav className="flex-1 space-y-2">
              <Link
                to="/vendor/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium hover:bg-green-50 hover:text-green-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                My Products
              </Link>
              <Link
                to="/vendor/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium bg-gradient-to-r from-green-100 to-green-50 text-green-800 shadow-md border border-green-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Manage Orders
              </Link>
              <Link
                to="/vendor/sales-dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium hover:bg-green-50 hover:text-green-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Sales Dashboard
              </Link>
              <Link
                to="/vendor/ai-forecast"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium hover:bg-green-50 hover:text-green-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Demand Forecast
              </Link>
            </nav>
          </div>
          
          <div className="mt-auto p-4 border-t border-green-100">
            <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-4 rounded-lg border border-green-200 shadow-sm mb-3">
              <div className="text-sm font-semibold text-green-800 mb-1">Need Help?</div>
              <p className="text-xs text-gray-600 mb-2">Contact our support team for assistance.</p>
              <a href="mailto:support@ceylone-travelgine.com" className="text-xs text-green-700 hover:underline">support@ceylone-travelgine.com</a>
            </div>
            
            <Link 
              to="/login" 
              onClick={() => localStorage.removeItem('token')}
              className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Link>
          </div>
        </aside>
  <main className="flex-1 relative z-10 p-4 md:p-8 flex flex-col gap-8 ml-64">
    <section className="max-w-6xl mx-auto w-full">
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/70 to-green-50/60 rounded-2xl shadow-xl p-4 md:p-8 border border-green-200/60 flex flex-col gap-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-700 tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Order Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">View and manage all your incoming orders</p>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-yellow-50 py-1.5 px-3 rounded-lg text-xs text-green-800 font-medium border border-green-200 shadow-sm">
            Total Orders: {orders.length}
          </div>
        </header>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="w-full bg-white/90 border border-green-100">
              <thead className="bg-gradient-to-r from-green-50/80 to-yellow-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="font-medium">No orders found</p>
                        <p className="text-xs mt-1">New orders will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : orders.map(order => (
                  <tr key={order._id} className="hover:bg-green-50/40 transition-all duration-150">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-medium text-green-800">{order.orderId}</div>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{order.user?.fullName || order.userId?.fullName || 'N/A'}</div>
                      {order.contactNumber && <div className="text-xs text-gray-500">{order.contactNumber}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <ul className="space-y-1">
                        {order.items.map(item => (
                          <li key={item.productId} className="flex items-center gap-2">
                            <span className="inline-block w-5 h-5 bg-gradient-to-br from-green-100 to-yellow-50 rounded-full flex items-center justify-center text-xs font-bold text-green-800">{item.quantity}</span>
                            <span className="text-sm">{item.name}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-green-800">LKR {order.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{order.paymentMethod || 'Cash'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {order.orderStatus === 'Completed' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200 shadow-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                          Completed
                        </span>
                      )}
                      {order.orderStatus === 'Pending' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></span>
                          Pending
                        </span>
                      )}
                      {order.orderStatus === 'Rejected' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200 shadow-sm">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                          Rejected
                        </span>
                      )}
                      {(order.orderStatus === 'Accepted' || order.orderStatus === 'Preparing' || order.orderStatus === 'Ready') && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
                          {order.orderStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <select
                          value={order.orderStatus}
                          onChange={e => handleStatusChange(order.orderId, e.target.value)}
                          className="border border-green-200 rounded-md px-3 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 w-full"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <button
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md text-sm hover:from-green-600 hover:to-green-700 transition shadow-sm font-medium"
                          onClick={() => handleViewDetails(order)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {selectedOrder && (
          <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </div>
    </section>
  </main>
      </div>
    </>
  );
};

export default VendorOrdersPage;
