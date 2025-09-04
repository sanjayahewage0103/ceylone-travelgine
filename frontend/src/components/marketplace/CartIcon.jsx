import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartIcon = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const count = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  return (
    <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9h-13z" stroke="#222" strokeWidth="1.5"/><circle cx="9" cy="21" r="1" fill="#222"/><circle cx="18" cy="21" r="1" fill="#222"/></svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{count}</span>
      )}
    </div>
  );
};

export default CartIcon;
