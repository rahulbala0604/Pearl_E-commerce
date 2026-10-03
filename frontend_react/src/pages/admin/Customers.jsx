import { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig';
import Loader from '../../components/Loader';
import { Search } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await api.get('/admin/customers');
        setCustomers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 relative">
          <input 
            type="text" 
            placeholder="Search customers..." 
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
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Name</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Email</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Role</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Orders</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Registered</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium">{customer.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 capitalize">{customer.role}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 font-bold">{customer.orderCount || 0}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">No customers found.</td>
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

export default Customers;
