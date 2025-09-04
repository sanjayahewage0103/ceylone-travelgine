import React, { useEffect, useState } from 'react';
import VendorSidebar from '../../components/vendor/VendorSidebar';
import orderService from '../../services/orderService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};


const OrderDetailModal = ({ order, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
      <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>✕</button>
      <h2 className="text-xl font-bold mb-2">Order Details: {order.orderId}</h2>
      <div className="mb-2"><strong>Status:</strong> {order.orderStatus}</div>
      {order.orderStatus === 'Completed' && (
        <div className="mb-2"><strong>Completed At:</strong> {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : 'N/A'}</div>
      )}
      <div className="mb-2"><strong>Customer:</strong> {order.user?.fullName || order.userId?.fullName || 'N/A'}</div>
      <div className="mb-2"><strong>Delivery:</strong> {order.deliveryMethod} {order.deliveryAddress && `- ${order.deliveryAddress}`}</div>
      <div className="mb-2"><strong>Contact:</strong> {order.contactNumber}</div>
      <div className="mb-2"><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</div>
      <div className="mb-2"><strong>Total:</strong> LKR {order.totalAmount}</div>
      <div className="mb-2"><strong>Items:</strong>
        <ul className="list-disc ml-6">
          {order.items.map(item => (
            <li key={item.productId}>{item.name} x {item.quantity} @ LKR {item.price}</li>
          ))}
        </ul>
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
                    <td className="px-4 py-2 flex gap-2">
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
                      <button
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        onClick={() => handleViewDetails(order)}
                      >View Details</button>
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
      </main>
    </div>
  );
};

export default VendorOrdersPage;
