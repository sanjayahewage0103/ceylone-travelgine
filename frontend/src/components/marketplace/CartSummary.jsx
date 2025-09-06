
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';


const CartSummary = () => {
  const { cart } = useCart();
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  return (
    <div className="backdrop-blur-md bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8 w-full md:w-96">
      <h2 className="font-bold text-2xl mb-6 bg-gradient-to-r from-green-600 to-teal-500 text-transparent bg-clip-text">Order Summary</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
      </div>
      
      <div className="flex justify-between font-bold text-xl mt-6 mb-6 pt-3">
        <span>Total</span>
        <span className="text-green-600">Rs. {subtotal.toFixed(2)}</span>
      </div>
      
      <button
        className={`w-full py-3 rounded-xl font-bold text-base mt-2 transition-all duration-300 transform
          ${cart.items.length === 0 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-white hover:shadow-lg hover:-translate-y-1'
          }`}
        onClick={() => navigate('/marketplace/checkout')}
        disabled={cart.items.length === 0}
      >
        Proceed to Checkout →
      </button>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Need help? <a href="#" className="text-green-600 hover:underline">Contact support</a></p>
      </div>
    </div>
  );
};

export default CartSummary;
