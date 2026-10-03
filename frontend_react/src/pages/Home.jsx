import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import api from '../utils/axiosConfig';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import heroImage from '../assets/hero.png';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const featured = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  return (
    <div className="w-full -mt-8">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px] w-full bg-[#f3f4f6] overflow-hidden flex items-center pt-16">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={heroImage} 
            alt="Water Purifier Hero" 
            className="w-full h-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 sm:px-8">
          <div className="max-w-xl animate-fade-in">
            <span className="inline-block text-[var(--color-primary)] font-bold tracking-[0.2em] uppercase text-xs mb-4">
              Advanced Purification
            </span>
            <h1 className="text-5xl md:text-7xl font-display text-gray-900 leading-tight mb-6">
              PURE WATER.<br />
              <span className="font-light text-[var(--color-primary)]">EVERY SINGLE DAY.</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md font-light leading-relaxed">
              Advanced water purification designed for modern Indian homes.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/products" className="btn-primary text-center">
                EXPLORE PURIFIERS
              </Link>
              <Link to="/products?category=RO" className="btn-secondary text-center">
                FIND YOUR PURIFIER
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center bg-[var(--color-bg-warm)] p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck size={36} strokeWidth={1.5} className="text-[var(--color-primary-500)] mb-4" />
              <h4 className="font-display text-lg font-semibold mb-2 text-gray-900">Advanced Purification</h4>
              <p className="text-gray-500 text-sm">Multi-stage purification technology.</p>
            </div>
            <div className="flex flex-col items-center bg-[var(--color-bg-warm)] p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <RefreshCw size={36} strokeWidth={1.5} className="text-[var(--color-primary-500)] mb-4" />
              <h4 className="font-display text-lg font-semibold mb-2 text-gray-900">Quality Tested</h4>
              <p className="text-gray-500 text-sm">Designed for safe and reliable water.</p>
            </div>
            <div className="flex flex-col items-center bg-[var(--color-bg-warm)] p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <Truck size={36} strokeWidth={1.5} className="text-[var(--color-primary-500)] mb-4" />
              <h4 className="font-display text-lg font-semibold mb-2 text-gray-900">Easy Installation</h4>
              <p className="text-gray-500 text-sm">Professional installation support.</p>
            </div>
            <div className="flex flex-col items-center bg-[var(--color-bg-warm)] p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck size={36} strokeWidth={1.5} className="text-[var(--color-primary-500)] mb-4" />
              <h4 className="font-display text-lg font-semibold mb-2 text-gray-900">Warranty Support</h4>
              <p className="text-gray-500 text-sm">Reliable after-sales assistance.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-bg-warm)] py-20 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-[var(--color-text-main)]">FIND YOUR PURIFIER</h2>
            <p className="text-[var(--color-text-muted)] mt-2 font-light">Select the perfect purification technology for your home.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['RO + UV', 'RO + UF', 'Alkaline', 'Copper', 'Smart Purifiers'].map(tech => (
              <Link key={tech} to={`/products?category=${encodeURIComponent(tech)}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md hover:border-[var(--color-primary)] transition-all flex flex-col items-center group">
                <div className="h-12 w-12 rounded-full bg-[var(--color-secondary-light)] text-[var(--color-primary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-semibold text-sm text-[var(--color-text-main)]">{tech}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Featured Products */}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900">Popular Water Purifiers</h2>
              <p className="text-gray-500 mt-2 font-light">Advanced solutions for your daily hydration needs.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center text-[var(--color-primary)] font-medium hover:text-[var(--color-primary-dark)] transition-colors group">
              View All <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(n => <div key={n} className="aspect-[3/4] skeleton rounded-lg"></div>)}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 text-center">
              <p>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50">
              <p className="text-gray-500">No products available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="mt-8 sm:hidden flex justify-center">
            <Link to="/products" className="btn-secondary w-full text-center">View All</Link>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-24 h-[400px] flex items-center">
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center opacity-90"></div>
          </div>
          <div className="relative z-10 text-center w-full px-4">
            <h2 className="text-4xl md:text-5xl font-display text-white mb-4">Smart Purification Technology</h2>
            <p className="text-white/90 text-lg mb-8 max-w-lg mx-auto font-light">Experience the future of clean drinking water with our smart features and intelligent design.</p>
            <Link to="/products" className="inline-block bg-white text-[var(--color-primary-dark)] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Explore Technologies
            </Link>
          </div>
        </div>

        {/* New Arrivals (if enough products) */}
        {newArrivals.length > 0 && (
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900">Latest Purifiers</h2>
              <p className="text-gray-500 mt-2 font-light">The newest additions to our product lineup.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Newsletter */}
      <div className="bg-[var(--color-primary-light)]/40 py-24">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-display font-semibold text-gray-900 mb-4">Stay Hydrated, Stay Healthy</h2>
          <p className="text-gray-600 mb-8 font-light">Subscribe to receive exclusive offers, maintenance tips, and updates on new water purification technologies.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="px-6 py-4 rounded-md border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] sm:w-96"
            />
            <button type="submit" className="bg-gray-900 text-white px-8 py-4 rounded-md font-medium hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
