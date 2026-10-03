import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, Truck, ShieldCheck, Heart, Share2, RefreshCw } from 'lucide-react';
import api from '../utils/axiosConfig';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      navigate(`/login?redirect=/product/${id}`);
      return;
    }
    
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to your cart');
    } catch (err) {
      toast.error(err.message || 'Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
      await handleAddToCart();
      if(user) navigate('/cart');
  }

  if (loading) return <Loader fullScreen />;
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-3xl font-display font-semibold text-gray-800 mb-4">Product Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md text-center">The item you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/products" className="btn-primary">
        Back to Products
      </Link>
    </div>
  );

  const finalPrice = product.price - (product.discount || 0);
  const isDiscounted = product.discount > 0;
  // If product doesn't have multiple images, mock an array for UI display purposes
  const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/800?text=PEARL'];

  return (
    <div className="bg-white min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8 font-medium">
          <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-[var(--color-primary)] transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 line-clamp-1">{product.name}</span>
        </nav>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Image Gallery */}
          <div className="lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 flex-shrink-0 hide-scrollbar">
               {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-[3/4] rounded-md overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[var(--color-primary)]' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
               ))}
            </div>
            <div className="flex-grow aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden relative">
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
              {isDiscounted && (
                <div className="absolute top-4 left-4 bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5">
                  Sale
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 flex flex-col py-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] mb-3">{product.category}</p>
            <h1 className="text-3xl md:text-5xl font-display font-semibold text-gray-900 mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map(star => (
                   <Star key={star} size={18} className={star <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                ))}
                <span className="ml-2 text-sm text-gray-600 font-medium underline">({product.rating} Reviews)</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              {product.stock > 0 ? (
                <span className="text-[var(--color-success)] font-semibold text-sm flex items-center"><ShieldCheck size={16} className="mr-1" /> In Stock</span>
              ) : (
                <span className="text-[var(--color-error)] font-semibold text-sm">Out of Stock</span>
              )}
            </div>

            <div className="flex items-end space-x-4 mb-8">
              <span className={`text-4xl font-display font-bold ${isDiscounted ? 'text-[var(--color-error)]' : 'text-gray-900'}`}>
                ${finalPrice.toFixed(2)}
              </span>
              {isDiscounted && (
                <span className="text-xl text-gray-400 line-through mb-1">${product.price.toFixed(2)}</span>
              )}
            </div>

            <div className="prose prose-sm md:prose-base text-gray-600 mb-8 max-w-none font-light leading-relaxed">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Product Overview</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="mb-10">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Purification Technology</h3>
              <div className="flex flex-wrap gap-2">
                {product.category.split('+').map(tech => (
                  <span key={tech} className="bg-[var(--color-secondary-light)] text-[var(--color-primary-dark)] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border border-[var(--color-secondary)]/30">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-6 mb-10">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold uppercase tracking-wider text-gray-900">Quantity</span>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden h-12 w-32">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-full text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >-</button>
                    <input 
                      type="number" 
                      value={quantity} 
                      readOnly 
                      className="w-12 text-center font-semibold text-sm h-full border-x border-gray-300 bg-white focus:outline-none"
                    />
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="w-10 h-full text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >+</button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 btn-secondary h-14 flex justify-center items-center text-sm tracking-wider uppercase font-bold"
                  >
                    {addingToCart ? 'Adding...' : 'Add To Cart'}
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="flex-1 btn-primary h-14 flex justify-center items-center text-sm tracking-wider uppercase font-bold"
                  >
                    Buy It Now
                  </button>
                  <button className="w-14 h-14 border border-gray-300 rounded-md flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-[var(--color-primary)] transition-colors">
                     <Heart size={20} />
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-8 space-y-4 text-sm text-gray-600 font-medium">
              <div className="flex items-center">
                <Truck size={18} className="mr-3 text-gray-400" />
                <span>Complimentary standard shipping on all orders over $200.</span>
              </div>
              <div className="flex items-center">
                <RefreshCw size={18} className="mr-3 text-gray-400" />
                <span>30-day return policy. Exclusions apply.</span>
              </div>
              <div className="flex items-center">
                <Share2 size={18} className="mr-3 text-gray-400" />
                <button className="underline hover:text-gray-900 transition-colors">Share this product</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
