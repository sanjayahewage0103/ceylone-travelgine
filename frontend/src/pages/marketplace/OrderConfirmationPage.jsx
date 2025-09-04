import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  if (!state) return <div className="text-center py-20">No order found.</div>;
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md text-center">
        <div className="text-green-600 text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
        <div className="mb-2">Order ID: <span className="font-mono">{state.orderId}</span></div>
        <div className="mb-2">Pickup from: <span className="font-semibold">{state.shopName}</span></div>
        {state.deliveryMethod === 'Courier' && (
          <div className="mb-2">Delivery Address: <span className="font-semibold">{state.deliveryAddress}</span></div>
        )}
        <div className="mb-2">Total: <span className="font-bold">LKR {state.total}</span></div>
        <div className="mb-2">Contact: <span className="font-semibold">{state.contactNumber}</span></div>
        <div className="mb-2">Payment: <span className="font-semibold">{state.paymentMethod}</span></div>
        <div className="mt-4 text-green-700 font-semibold">You’ll be contacted for pickup or delivery.</div>
        <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
