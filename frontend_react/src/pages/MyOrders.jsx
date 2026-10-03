import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import Loader from '../components/Loader';
import { Package, ChevronRight } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader fullScreen />;

  if (error) return (
    <div className="text-center py-20 text-red-500 font-bold">{error}</div>
  );

  return (
    <div className="container mx-auto px-4 max-w-6xl py-12 animate-fade-in">
      <div className="flex items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 shadow-sm border border-gray-100 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-[var(--color-bg-warm)] rounded-full flex items-center justify-center text-[var(--color-primary-300)] mb-6">
            <Package size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-display font-semibold text-gray-900 mb-3">No orders found</h2>
          <p className="text-gray-500 mb-8 max-w-md font-light">You haven't placed any orders yet. Discover our premium water purifiers.</p>
          <Link to="/products" className="btn-primary">
            EXPLORE PURIFIERS
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-bg-warm)] border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Order ID</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Amount</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Method</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Payment</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6 text-sm font-mono text-gray-500">
                      #{order._id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900 text-right">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {order.paymentMethod === 'COD' ? 'COD' : order.paymentMethod}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        order.orderStatus === 'Delivered' ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]' :
                        order.orderStatus === 'Pending Payment' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link to={`/order/${order._id}`} className="inline-flex items-center justify-center p-2 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors hover:bg-gray-100 rounded-full">
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-mono text-gray-400 mb-1">#{order._id.substring(0, 10).toUpperCase()}</p>
                    <p className="font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium text-gray-900">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        order.orderStatus === 'Delivered' ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]' :
                        order.orderStatus === 'Pending Payment' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
                
                <Link to={`/order/${order._id}`} className="btn-secondary w-full py-2.5 text-xs flex justify-center items-center">
                  VIEW DETAILS <ChevronRight size={14} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
