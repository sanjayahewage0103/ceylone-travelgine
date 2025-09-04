import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Fetch cart on mount and after actions
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data || { items: [] });
    } catch (err) {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  // Add to cart
  const addToCart = async (productId, quantity = 1, selectedOptions = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/tourist/login';
        return false;
      }
      await axios.post('/api/cart/add', { productId, quantity, selectedOptions }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
      return true;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        window.location.href = '/tourist/login';
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/tourist/login';
        return;
      }
      await axios.delete(`/api/cart/item/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err) {}
    setLoading(false);
  };

  // Checkout
  const checkout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/tourist/login';
        return;
      }
      await axios.post('/api/cart/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart({ items: [] });
    } catch (err) {}
    setLoading(false);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, checkout, loading }}>
      {children}
    </CartContext.Provider>
  );
};
