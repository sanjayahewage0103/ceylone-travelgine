
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';


const CartSummary = () => {
  const { cart } = useCart();
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full md:w-80">
      <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
      <div className="flex justify-between font-bold text-lg mt-4 mb-2"><span>Total</span><span>Rs. {subtotal}</span></div>
      <button
        className="w-full bg-black text-white py-2 rounded-lg font-semibold text-base hover:bg-gray-900 transition mt-4"
        onClick={() => navigate('/checkout')}
        disabled={cart.items.length === 0}
      >Go to Checkout →</button>
    </div>
  );
};

export default CartSummary;
