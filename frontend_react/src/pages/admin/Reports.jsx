import { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig';
import Loader from '../../components/Loader';
import { BarChart, DollarSign, ShoppingBag, CreditCard } from 'lucide-react';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching reports');
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
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <BarChart className="mr-3 text-primary-600" /> Executive Reports
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <DollarSign className="text-green-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-700">Financial Summary</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Gross Sales</span>
              <span className="font-black text-gray-900">${stats.totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Net Revenue</span>
              <span className="font-black text-green-600">${stats.revenue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <ShoppingBag className="text-blue-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-700">Order Status Summary</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Total Orders</span>
              <span className="font-bold text-gray-900">{stats.totalOrders}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Delivered</span>
              <span className="font-bold text-blue-600">{stats.deliveredOrders}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Cancelled</span>
              <span className="font-bold text-red-600">{stats.cancelledOrders}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <CreditCard className="text-purple-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-700">Payment Summary</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Successful</span>
              <span className="font-bold text-green-600">{stats.successfulPayments}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Failed</span>
              <span className="font-bold text-red-600">{stats.failedPayments}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Pending</span>
              <span className="font-bold text-yellow-600">{stats.pendingPayments}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Reports;
