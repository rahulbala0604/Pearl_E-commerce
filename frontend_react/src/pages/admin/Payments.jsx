import { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchPayments = async () => {
    try {
      const { data } = await api.get('/admin/payments');
      setPayments(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/admin/payments/${id}/status`, { status: newStatus });
      toast.success('Payment status updated');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredPayments = filter === 'All' ? payments : payments.filter(p => p.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Payment Records</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
          {['All', 'Paid', 'Pending', 'Failed', 'Cancelled', 'Refunded'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === status 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : error ? <div className="text-red-500">{error}</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Payment ID</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Order ID</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Customer</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Method</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Amount</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-mono text-gray-600">{payment.paymentId}</td>
                    <td className="py-4 px-4 text-sm font-mono text-primary-600">
                      <a href={`/order/${payment.orderId}`} target="_blank" rel="noreferrer" className="hover:underline">
                        {payment.orderId.substring(18)}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{payment.userId?.name || 'Deleted'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{payment.method}</td>
                    <td className="py-4 px-4 text-sm font-bold">${payment.amount.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm">
                      <select 
                        value={payment.status}
                        onChange={(e) => handleStatusUpdate(payment.orderId, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{new Date(payment.transactionDate).toLocaleString()}</td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">No {filter !== 'All' ? filter : ''} payments found.</td>
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

export default Payments;
