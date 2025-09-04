import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState('Pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', exp: '', cvc: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      const res = await axios.post('/api/orders/checkout', {
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'Courier' ? deliveryAddress : '',
        contactNumber,
        paymentMethod,
        cardDetails: paymentMethod === 'Card' ? cardDetails : undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/order-confirmation', { state: res.data });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-8">
      <form className="bg-white rounded-lg shadow p-8 w-full max-w-lg" onSubmit={handlePlaceOrder}>
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <div className="mb-4">
          <div className="font-semibold mb-2">Order Summary</div>
          {cart.items.map(item => (
            <div key={item.productId._id} className="flex items-center gap-2 text-sm mb-1">
              <img src={item.productId.images?.[0]?.startsWith('/uploads') ? `http://localhost:5000${item.productId.images[0]}` : item.productId.images?.[0] || '/placeholder.png'} alt={item.productId.name} className="w-10 h-10 object-cover rounded" />
              <span>{item.productId.name}</span>
              <span className="text-gray-500">x{item.quantity}</span>
              <span className="ml-auto font-semibold">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between mt-2 font-bold text-lg">
            <span>Total</span>
            <span>Rs. {subtotal}</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Delivery Method</label>
          <select value={deliveryMethod} onChange={e => setDeliveryMethod(e.target.value)} className="border rounded px-2 py-1 w-full">
            <option value="Pickup">Pickup at vendor shop</option>
            <option value="Courier">Delivery via courier</option>
          </select>
        </div>
        {deliveryMethod === 'Courier' && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Delivery Address</label>
            <input type="text" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className="border rounded px-2 py-1 w-full" required={deliveryMethod === 'Courier'} />
          </div>
        )}
        <div className="mb-4">
          <label className="block font-medium mb-1">Contact Number</label>
          <input type="text" value={contactNumber} onChange={e => setContactNumber(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Payment Method</label>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="border rounded px-2 py-1 w-full">
            <option value="Cash">Cash on Pickup/Delivery</option>
            <option value="Card">Credit/Debit Card</option>
            <option value="Mobile">Mobile Payment (e.g., Dialog eZ Cash)</option>
          </select>
        </div>
        {paymentMethod === 'Card' && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            <input type="text" placeholder="Card Number" value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })} className="border rounded px-2 py-1 col-span-2" required />
            <input type="text" placeholder="Name on Card" value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })} className="border rounded px-2 py-1 col-span-2" required />
            <input type="text" placeholder="MM/YY" value={cardDetails.exp} onChange={e => setCardDetails({ ...cardDetails, exp: e.target.value })} className="border rounded px-2 py-1" required />
            <input type="text" placeholder="CVC" value={cardDetails.cvc} onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })} className="border rounded px-2 py-1" required />
          </div>
        )}
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold text-lg hover:bg-blue-700 transition" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
