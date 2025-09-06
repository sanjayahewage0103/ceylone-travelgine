import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CartIcon = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const count = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  return (
    <motion.div 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer p-2.5 rounded-full backdrop-blur-sm bg-white/50 border border-white/20 text-gray-700 hover:bg-white/80 transition-all shadow-sm" 
      onClick={() => navigate('/cart')}
      aria-label="Shopping cart"
    >
      <FiShoppingCart size={20} className="text-gradient" />
      {count > 0 && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-teal-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm ring-2 ring-white"
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </motion.div>
  );
};

export default CartIcon;
