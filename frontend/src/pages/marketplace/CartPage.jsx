import React from 'react';
import { useCart } from '../../context/CartContext';
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
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
          {cart.items.length === 0 ? (
            <div className="text-gray-500">Your cart is empty.</div>
          ) : (
            cart.items.map(item => (
              <CartItemCard key={item.productId._id} item={item} onRemove={handleRemove} onUpdate={handleUpdate} />
            ))
          )}
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default CartPage;
