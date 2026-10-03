import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axiosConfig';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      setCart(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Error adding to cart';
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      setCart(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Error updating quantity';
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Error removing from cart';
    }
  };

  const clearCart = () => setCart(null);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
