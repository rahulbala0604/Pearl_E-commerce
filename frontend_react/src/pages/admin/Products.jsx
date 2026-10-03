import { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig';
import Loader from '../../components/Loader';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    discount: '',
    image: ''
  });

  const fetchProducts = async (search = '') => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products?keyword=${search}&pageSize=100`);
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(keyword);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts(keyword);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        stock: product.stock,
        discount: product.discount || 0,
        image: product.images?.[0] || ''
      });
    } else {
      setCurrentProduct(null);
      setFormData({ name: '', price: '', description: '', category: '', stock: '', discount: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, images: [formData.image] };
      if (currentProduct) {
        await api.put(`/products/${currentProduct._id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
      fetchProducts(keyword);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <button 
          onClick={() => openModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSearch} className="mb-6 flex">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-4 py-2 hover:bg-gray-200">
            <Search size={20} className="text-gray-600" />
          </button>
        </form>

        {loading ? <Loader /> : error ? <div className="text-red-500">{error}</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Image</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Product</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Price</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Stock</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase">Category</th>
                  <th className="py-3 px-4 text-sm font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img src={product.images?.[0] || 'https://via.placeholder.com/50'} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-sm">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{product.category}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openModal(product)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-block mr-2">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-block">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">{currentProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" required min="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" required min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                  <input type="number" min="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
