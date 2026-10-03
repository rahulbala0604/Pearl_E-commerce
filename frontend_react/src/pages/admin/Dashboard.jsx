import { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig';
import Loader from '../../components/Loader';
import { ShoppingCart, DollarSign, Users, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center">
    <div className={`p-4 rounded-xl mr-4 ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} icon={DollarSign} colorClass="bg-green-50 text-green-600" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Customers" value={stats.totalCustomers} icon={Users} colorClass="bg-purple-50 text-purple-600" />
        <StatCard title="Products" value={stats.totalProducts} icon={Package} colorClass="bg-orange-50 text-orange-600" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-10">Payment & Order Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">Successful</span>
          <span className="font-bold text-green-600">{stats.successfulPayments}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">Failed</span>
          <span className="font-bold text-red-600">{stats.failedPayments}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">Pending</span>
          <span className="font-bold text-yellow-600">{stats.pendingPayments}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">Cancelled</span>
          <span className="font-bold text-red-600">{stats.cancelledOrders}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">Delivered</span>
          <span className="font-bold text-blue-600">{stats.deliveredOrders}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Order ID</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Customer</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Amount</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Status</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium">{order._id.substring(18)}</td>
                  <td className="py-4 px-4 text-sm">{order.userId?.name || 'Unknown'}</td>
                  <td className="py-4 px-4 text-sm font-bold">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      order.orderStatus === 'Pending Payment' ? 'bg-yellow-50 text-yellow-700' :
                      order.orderStatus === 'Processing' ? 'bg-blue-50 text-blue-700' :
                      order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
