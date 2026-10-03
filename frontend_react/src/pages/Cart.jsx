import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, loading, removeFromCart, updateCartQuantity, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err.message || 'Error removing item');
    }
  };

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    try {
      await updateCartQuantity(productId, newQuantity);
    } catch (err) {
      toast.error(err.message || 'Error updating quantity');
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 animate-fade-in px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
          <ShoppingBag size={48} strokeWidth={1} />
        </div>
        <h2 className="text-3xl font-display font-semibold text-gray-900 mb-4 text-center">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center font-light">Looks like you haven't added anything to your cart yet. Discover our latest purifiers.</p>
        <Link to="/products" className="btn-primary w-full sm:w-auto text-center">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-10">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-4 mb-6">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="space-y-8 md:space-y-6">
              {cart.items.map((item) => {
                const finalPrice = item.price - (item.discount || 0);
                const itemTotal = finalPrice * item.quantity;
                
                return (
                  <div key={item.productId} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center border-b border-gray-50 pb-6 last:border-0">
                    
                    <div className="col-span-6 flex items-start gap-6 w-full">
                      <Link to={`/product/${item.productId}`} className="w-24 h-32 bg-gray-50 flex-shrink-0 border border-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={item.image || 'https://via.placeholder.com/200?text=PEARL'} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="flex flex-col pt-1">
                        <Link to={`/product/${item.productId}`} className="text-base font-medium text-gray-900 hover:text-[var(--color-primary)] transition-colors mb-1">
                          {item.name}
                        </Link>
                        <span className="text-sm text-gray-500 mb-2">${finalPrice.toFixed(2)}</span>
                        {item.discount > 0 && (
                          <span className="text-xs text-[var(--color-success)] font-medium">Includes discount</span>
                        )}
                        {/* Mobile remove and qty */}
                        <div className="md:hidden flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-200 rounded-md h-9 w-24">
                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)} className="px-2 text-gray-500 hover:bg-gray-50 h-full">-</button>
                            <span className="flex-1 text-center text-sm font-semibold">{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)} className="px-2 text-gray-500 hover:bg-gray-50 h-full">+</button>
                          </div>
                          <button onClick={() => handleRemove(item.productId)} className="text-gray-400 hover:text-[var(--color-error)] transition-colors p-2">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3 hidden md:flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded-md h-10 w-28">
                        <button onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)} className="w-8 flex justify-center text-gray-500 hover:bg-gray-50 h-full items-center transition-colors">-</button>
                        <span className="flex-1 text-center text-sm font-semibold bg-white">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)} className="w-8 flex justify-center text-gray-500 hover:bg-gray-50 h-full items-center transition-colors">+</button>
                      </div>
                    </div>

                    <div className="col-span-2 hidden md:block text-right">
                      <span className="font-semibold text-gray-900">${itemTotal.toFixed(2)}</span>
                    </div>

                    <div className="col-span-1 hidden md:flex justify-end">
                      <button 
                        onClick={() => handleRemove(item.productId)}
                        className="text-gray-400 hover:text-[var(--color-error)] transition-colors p-2"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 rounded-xl p-8 sticky top-24">
              <h2 className="text-lg font-display font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${cart.subtotal.toFixed(2)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-[var(--color-success)]">
                    <span>Discount</span>
                    <span className="font-medium">-${cart.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-gray-900">${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-medium text-gray-900">Complimentary</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-3xl font-display font-bold text-[var(--color-primary)]">${cart.total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary h-14 flex justify-center items-center text-base tracking-wide shadow-md hover:shadow-xl"
              >
                Proceed to Checkout <ArrowRight size={18} className="ml-2" />
              </button>

              <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-xs text-gray-500 text-center">
                 <div className="flex items-center space-x-1">
                   <ShieldCheck size={14} />
                   <span>Secure Encrypted Checkout</span>
                 </div>
                 <p>Tax calculated dynamically based on regional nexus.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
