import { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useLocation } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products');
        
        let fetchedProducts = data.products || data || [];
        if (categoryFilter) {
          fetchedProducts = fetchedProducts.filter(p => p.category === categoryFilter);
        }
        
        setProducts(fetchedProducts);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter]);

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900">
          {categoryFilter ? `${categoryFilter} Water Purifiers` : 'All Water Purifiers'}
        </h1>
        <p className="text-gray-500 mt-3 font-light max-w-2xl mx-auto">
          Explore our range of premium water purifiers equipped with advanced multi-stage filtration technology.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n} className="aspect-[3/4] skeleton rounded-2xl"></div>)}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-8 rounded-xl text-center">
          <p className="font-semibold">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-bg-warm)] rounded-2xl border border-gray-100">
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">No Products Found</h2>
          <p className="text-gray-500">We couldn't find any water purifiers matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
