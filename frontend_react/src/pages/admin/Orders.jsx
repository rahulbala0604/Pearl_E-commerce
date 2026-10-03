import { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig';
import Loader from '../../components/Loader';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(search.toLowerCase()) || 
    (o.userId?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 relative">
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer Name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        </div>

        {loading ? <Loader /> : error ? <div className="text-red-500">{error}</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Order ID</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Customer</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Date</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Total</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Payment</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium">{order._id.substring(18)}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{order.userId?.name || 'Deleted User'}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-sm font-bold">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm">
                      <div className="font-medium text-gray-900 mb-1">
                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 
                         order.paymentMethod === 'UPI' ? 'UPI / Google Pay' : 
                         order.paymentMethod === 'CARD' ? 'Credit / Debit Card' : 
                         order.paymentMethod === 'NET_BANKING' ? 'Net Banking' : order.paymentMethod}
                      </div>
                      <span className={`text-xs font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="Pending Payment">Pending Payment</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Payment Failed">Payment Failed</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Link to={`/order/${order._id}`} className="text-primary-600 hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
