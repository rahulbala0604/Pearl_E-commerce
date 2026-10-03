import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import api from '../utils/axiosConfig';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { CreditCard, Truck, ShieldCheck, MapPin, Package, CircleDot, Circle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate]);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      toast.error('Please complete all delivery details');
      return;
    }

    setPlacingOrder(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: { address, city, postalCode, country },
        paymentMethod
      });
      toast.success('Order placed successfully!');
      await fetchCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error placing order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartLoading) return <Loader fullScreen />;
  if (!cart) return null;

  return (
    <div className="py-12 animate-fade-in bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-10 text-center">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="lg:w-3/5 space-y-8">
            {/* Delivery Information */}
            <div className="card p-8">
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-6 flex items-center border-b border-gray-100 pb-4">
                <MapPin className="mr-3 text-[var(--color-primary)]" size={24} /> 1. Delivery Information
              </h2>
              <form id="checkout-form" onSubmit={placeOrderHandler} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="123 Water Avenue, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="10001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="card p-8">
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-6 flex items-center border-b border-gray-100 pb-4">
                <CreditCard className="mr-3 text-[var(--color-primary)]" size={24} /> 2. Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* COD Option */}
                <div onClick={() => setPaymentMethod('COD')} className={`cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ${paymentMethod === 'COD' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <div className="flex items-center mb-3">
                    {paymentMethod === 'COD' ? <CircleDot className="text-[var(--color-primary)] mr-3" size={24} /> : <Circle className="text-gray-300 mr-3" size={24} />}
                    <span className="font-semibold text-gray-900 flex items-center gap-2"><span role="img" aria-label="cash">💵</span> Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Pay when your water purifier arrives</p>
                </div>

                {/* UPI Option */}
                <div onClick={() => setPaymentMethod('UPI')} className={`cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ${paymentMethod === 'UPI' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <div className="flex items-center mb-3">
                    {paymentMethod === 'UPI' ? <CircleDot className="text-[var(--color-primary)] mr-3" size={24} /> : <Circle className="text-gray-300 mr-3" size={24} />}
                    <span className="font-semibold text-gray-900 flex items-center gap-2"><span role="img" aria-label="phone">📱</span> UPI / Google Pay</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Select UPI as your payment method</p>
                </div>

                {/* Card Option */}
                <div onClick={() => setPaymentMethod('CARD')} className={`cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ${paymentMethod === 'CARD' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <div className="flex items-center mb-3">
                    {paymentMethod === 'CARD' ? <CircleDot className="text-[var(--color-primary)] mr-3" size={24} /> : <Circle className="text-gray-300 mr-3" size={24} />}
                    <span className="font-semibold text-gray-900 flex items-center gap-2"><span role="img" aria-label="card">💳</span> Credit / Debit Card</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Select card payment</p>
                </div>

                {/* Net Banking Option */}
                <div onClick={() => setPaymentMethod('NET_BANKING')} className={`cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ${paymentMethod === 'NET_BANKING' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <div className="flex items-center mb-3">
                    {paymentMethod === 'NET_BANKING' ? <CircleDot className="text-[var(--color-primary)] mr-3" size={24} /> : <Circle className="text-gray-300 mr-3" size={24} />}
                    <span className="font-semibold text-gray-900 flex items-center gap-2"><span role="img" aria-label="bank">🏦</span> Net Banking</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Select net banking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:w-2/5">
            <div className="card p-8 sticky top-24">
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-6 flex items-center border-b border-gray-100 pb-4">
                <Package className="mr-3 text-[var(--color-primary)]" size={24} /> 3. Order Summary
              </h2>
              
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-gray-50 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">
                      ${((item.price - (item.discount || 0)) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${cart.subtotal.toFixed(2)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-[var(--color-success)]">
                    <span>Discount</span>
                    <span className="font-medium">-${cart.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium text-gray-900">${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">Complimentary</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-display font-semibold text-gray-900">Total</span>
                  <span className="text-3xl font-display font-bold text-[var(--color-primary)]">${cart.total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                type="submit"
                form="checkout-form"
                disabled={placingOrder}
                className="w-full btn-primary text-lg h-14 flex items-center justify-center shadow-md hover:shadow-xl"
              >
                {placingOrder ? 'Processing...' : 'Place Order'}
              </button>

              <div className="mt-6 flex items-center justify-center space-x-2 text-gray-500 text-xs">
                <ShieldCheck size={16} />
                <span>Secure Checkout Process</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
