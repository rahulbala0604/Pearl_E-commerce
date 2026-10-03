import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import Loader from '../components/Loader';
import { ArrowLeft, CreditCard, Truck, CheckCircle, Clock, Package, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);



  if (loading) return <Loader fullScreen />;
  if (error) return <div className="text-center py-20 text-[var(--color-error)] font-semibold">{error}</div>;
  if (!order) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/orders" className="inline-flex items-center text-gray-500 hover:text-[var(--color-primary)] font-medium mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Orders
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-2">Order Confirmed</h1>
            <p className="text-gray-500 font-mono text-sm">#{order._id}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              order.orderStatus === 'Pending Payment' ? 'bg-yellow-100 text-yellow-800' :
              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
              order.orderStatus === 'Payment Failed' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {order.orderStatus}
            </span>
            <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="card p-6 md:p-8 mb-8 hidden md:block">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10"></div>
            
            {['Order Placed', 'Payment', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
              // Simple heuristic for demo. Real logic depends on strict orderStatus enum mapping.
              let isCompleted = false;
              let isCurrent = false;
              
              if (idx === 0) isCompleted = true; // Placed is always true
              
              if (idx === 1) { // Payment
                if (order.paymentStatus === 'Paid' || order.paymentMethod === 'COD') isCompleted = true;
                else if (order.orderStatus === 'Pending Payment') isCurrent = true;
              }
              
              if (idx === 2) { // Processing
                if (['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus)) isCompleted = true;
              }

              if (idx === 3) {
                if (['Shipped', 'Delivered'].includes(order.orderStatus)) isCompleted = true;
                else if (order.orderStatus === 'Processing' && idx===2) isCurrent = false;
              }

              if (idx === 4) {
                if (order.orderStatus === 'Delivered') isCompleted = true;
              }

              return (
                <div key={step} className="flex flex-col items-center bg-white px-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isCompleted ? 'bg-[var(--color-primary)] text-white' : 
                    isCurrent ? 'bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? <Check size={16} /> : <CircleDot size={12} />}
                  </div>
                  <span className={`text-xs font-semibold ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-8">
              <h2 className="text-lg font-display font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Items Ordered
              </h2>
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-20 h-24 bg-gray-50 border border-gray-100 rounded-md overflow-hidden flex-shrink-0">
                       {/* Mocking image since order items schema doesn't explicitly store image, if it does map it */}
                       <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={32} />
                       </div>
                    </div>
                    <div className="flex-grow">
                      <Link to={`/product/${item.productId}`} className="font-semibold text-gray-900 hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400 mt-1">${item.price.toFixed(2)} each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-lg font-display font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center">
                <Truck className="mr-3 text-[var(--color-primary)]" size={20} /> Delivery Details
              </h2>
              <div className="text-gray-700 text-sm space-y-1">
                <p className="font-semibold text-gray-900 mb-2 text-base">{order.userId?.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-8 sticky top-24">
              <h2 className="text-lg font-display font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center">
                <CreditCard className="mr-3 text-[var(--color-primary)]" size={20} /> Payment Summary
              </h2>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Method</p>
                <p className="font-medium text-gray-900 mb-3">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 
                   order.paymentMethod === 'UPI' ? 'UPI / Google Pay' : 
                   order.paymentMethod === 'CARD' ? 'Credit / Debit Card' : 
                   order.paymentMethod === 'NET_BANKING' ? 'Net Banking' : order.paymentMethod}
                </p>
                
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Status</p>
                <div className="flex items-center mb-3">
                  {order.paymentStatus === 'Paid' ? (
                    <span className="flex items-center text-[var(--color-success)] font-semibold"><CheckCircle size={16} className="mr-1" /> Paid</span>
                  ) : (
                    <span className="flex items-center text-yellow-600 font-semibold"><Clock size={16} className="mr-1" /> Pending</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[var(--color-success)]">
                    <span>Discount</span>
                    <span className="font-medium">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium text-gray-900">${order.tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-display font-semibold text-gray-900 text-lg">Total</span>
                  <span className="text-3xl font-display font-bold text-[var(--color-primary)]">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {order.paymentStatus === 'Pending' && order.paymentMethod !== 'COD' && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mt-4 text-sm font-medium">
                  Payment Pending. Your order has been placed successfully. Payment can be completed/confirmed separately.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for timeline icon fallback
const CircleDot = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>
  </svg>
)

export default OrderDetails;
