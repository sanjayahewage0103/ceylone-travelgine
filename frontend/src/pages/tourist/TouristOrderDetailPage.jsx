import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TouristOrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`/api/orders/user`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        const found = (Array.isArray(data) ? data : (data.orders || [])).find(o => (o.orderId || o._id) === orderId);
        if (!found) throw new Error('Order not found');
        setOrder(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-8">Loading order details...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow">
      <button className="mb-4 text-blue-600 hover:underline" onClick={() => navigate(-1)}>&larr; Back to Orders</button>
      <h2 className="text-2xl font-bold mb-2 text-blue-700">Order Details</h2>
      <div className="mb-4 text-gray-700">
        <div><span className="font-semibold">Order ID:</span> {order.orderId || order._id}</div>
        <div><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-700' : order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{order.orderStatus}</span></div>
        <div><span className="font-semibold">Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</div>
        <div><span className="font-semibold">Total Amount:</span> LKR {order.totalAmount?.toLocaleString()}</div>
        <div><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</div>
        <div><span className="font-semibold">Delivery Method:</span> {order.deliveryMethod}</div>
        {order.deliveryAddress && <div><span className="font-semibold">Delivery Address:</span> {order.deliveryAddress}</div>}
        {order.contactNumber && <div><span className="font-semibold">Contact Number:</span> {order.contactNumber}</div>}
      </div>
      <h3 className="text-lg font-bold mb-2">Order Items</h3>
      <div className="mb-6">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />}
                    <span>{item.name}</span>
                  </div>
                  <div className="text-xs text-gray-400">{item.shopName}</div>
                </td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">LKR {item.price?.toLocaleString()}</td>
                <td className="px-4 py-2">LKR {(item.price * item.quantity)?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add more details as needed, e.g. payment status, tracking, etc. */}
    </div>
  );
};

export default TouristOrderDetailPage;
