import React, { useEffect, useState } from 'react';
import VendorSidebar from '../../components/vendor/VendorSidebar';
import orderService from '../../services/orderService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderService.getVendorOrders()
      .then(setOrders)
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Re-fetch orders to ensure status is up to date
      setLoading(true);
      orderService.getVendorOrders()
        .then(setOrders)
        .catch(() => setError('Failed to load orders.'))
        .finally(() => setLoading(false));
    } catch {
      setError('Failed to update order status.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <VendorSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>
        {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Items</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">No orders found.</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id} className="border-b">
                    <td className="px-4 py-2 font-mono">{order.orderId}</td>
                    <td className="px-4 py-2">{order.user?.fullName || order.userId?.fullName || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <ul className="text-xs">
                        {order.items.map(item => (
                          <li key={item.productId}>{item.name} x {item.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2 font-semibold">LKR {order.totalAmount}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>{order.orderStatus}</span>
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={order.orderStatus}
                        onChange={e => handleStatusChange(order.orderId, e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorOrdersPage;
