import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useContext } from 'react';
import CartContext from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = async (e) => {
    e.preventDefault(); 
    if (product.stock === 0) {
      toast.error('This item is currently out of stock.');
      return;
    }
    
    try {
      await addToCart(product._id, 1);
      toast.success('Added to your cart');
    } catch (err) {
      toast.error(err.message || 'Could not add to cart');
    }
  };

  const finalPrice = product.price - (product.discount || 0);
  const isDiscounted = product.discount > 0;

  return (
    <Link to={`/product/${product._id}`} className="group flex flex-col h-full animate-fade-in">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
        {/* Product Image */}
        <img 
          src={product.images[0] || 'https://via.placeholder.com/400?text=PEARL'} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {isDiscounted && (
            <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1">
              Sale
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1">
              Sold Out
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center space-x-3">
          <button 
            onClick={(e) => { e.preventDefault(); toast.success('Added to wishlist'); }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-lg"
          >
            <Heart size={18} />
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 h-10 rounded-full flex items-center justify-center text-sm font-semibold tracking-wide transition-colors shadow-lg ${
              product.stock === 0 
                ? 'bg-white/80 text-gray-500 cursor-not-allowed backdrop-blur-sm' 
                : 'bg-white text-gray-900 hover:bg-[var(--color-primary)] hover:text-white'
            }`}
          >
            <ShoppingBag size={16} className="mr-2" />
            {product.stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}
          </button>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="flex flex-col flex-grow text-center">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em] mb-1">{product.category}</p>
        
        <h3 className="text-[15px] text-gray-900 font-medium mb-2 line-clamp-1 transition-colors group-hover:text-[var(--color-primary)]">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-center space-x-2">
          <span className={`text-[15px] font-semibold ${isDiscounted ? 'text-[var(--color-error)]' : 'text-gray-900'}`}>
            ${finalPrice.toFixed(2)}
          </span>
          {isDiscounted && (
            <span className="text-sm text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
