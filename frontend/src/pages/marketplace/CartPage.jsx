import React from 'react';
import { useCart } from '../../context/CartContext';
import MarketplaceLayout from '../../components/marketplace/MarketplaceLayout';
import CartItemCard from '../../components/marketplace/CartItemCard';
import CartSummary from '../../components/marketplace/CartSummary';

const CartPage = () => {
  const { cart, removeFromCart, addToCart } = useCart();

  const handleRemove = (item) => {
    removeFromCart(item.productId._id);
  };

  const handleUpdate = (item, newQty) => {
    if (newQty < 1) return;
    // Set quantity to newQty (not increment)
    const diff = newQty - item.quantity;
    if (diff === 0) return;
    addToCart(item.productId._id, diff, item.selectedOptions);
  };

  return (
    <MarketplaceLayout>
      <div className="py-12 px-4 md:px-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 transform transition-all">
          <div className="flex-1 backdrop-blur-md bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-all duration-300">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="bg-gradient-to-r from-green-600 to-teal-500 text-transparent bg-clip-text">Your Cart</span>
              <span className="ml-2 text-lg text-gray-400">({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})</span>
            </h1>
            {cart.items.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-xl">Your cart is empty.</p>
                <p className="mt-2 text-gray-400">Add some amazing Sri Lankan products!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map(item => (
                  <div 
                    key={item.productId._id}
                    className="transform transition-all duration-300 hover:-translate-y-1"
                  >
                    <CartItemCard item={item} onRemove={handleRemove} onUpdate={handleUpdate} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="transform transition-all duration-300 hover:-translate-y-2">
            <CartSummary />
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default CartPage;
