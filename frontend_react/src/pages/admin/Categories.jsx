import { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig';
import Loader from '../../components/Loader';
import { Tag } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories');
        setCategories(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
          In this project, categories are dynamically generated from the assigned categories on existing products. 
          To add or edit a category, simply assign it to a product in the Products management section.
        </div>

        {loading ? <Loader /> : error ? <div className="text-red-500">{error}</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <div key={index} className="flex items-center p-4 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
                <div className="bg-primary-50 p-3 rounded-xl mr-4 text-primary-600">
                  <Tag size={20} />
                </div>
                <span className="font-bold text-gray-900">{cat}</span>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-500">No categories found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
