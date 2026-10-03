import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Search, Menu, X, Heart } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <div className="fixed top-0 w-full z-50">
      {/* Announcement Bar */}
      <div className="bg-[var(--color-primary)] text-white text-center py-1.5 text-[11px] sm:text-xs font-semibold tracking-widest uppercase shadow-sm relative z-50">
        FREE INSTALLATION • WARRANTY SUPPORT • FAST DELIVERY
      </div>
      
      <nav className={`w-full transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white py-5'}`}>
        <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-700 hover:text-[var(--color-primary)]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-display font-bold text-[var(--color-primary)] tracking-tight">
            PEARL AQUA<span className="text-[var(--color-text-main)] font-light">.</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 font-sans text-[15px] font-medium text-gray-700">
            <Link to="/products" className="hover:text-[var(--color-primary)] transition-colors">Water Purifiers</Link>
            <Link to="/products?category=Technology" className="hover:text-[var(--color-primary)] transition-colors">Technology</Link>
            <Link to="/about" className="hover:text-[var(--color-primary)] transition-colors">Why Choose Us</Link>
            <Link to="/support" className="hover:text-[var(--color-primary)] transition-colors">Support</Link>
          </div>

          {/* Desktop Icons */}
          <div className="flex items-center space-x-5">
            <div className="hidden lg:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100 focus-within:border-[var(--color-primary)] focus-within:bg-white transition-all">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-40 focus:w-48 transition-all"
              />
            </div>
            
            <button className="hidden md:block text-gray-700 hover:text-[var(--color-primary)] transition-colors">
              <Search size={22} className="lg:hidden" />
            </button>
            
            <button className="hidden md:block text-gray-700 hover:text-[var(--color-primary)] transition-colors">
              <Heart size={22} />
            </button>

            <Link to="/cart" className="relative text-gray-700 hover:text-[var(--color-primary)] transition-colors">
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center text-gray-700 hover:text-[var(--color-primary)] transition-colors">
                  <User size={22} />
                </button>
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-xl shadow-xl py-2 hidden group-hover:block border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-4 py-3 border-b border-gray-50 mb-2">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:text-[var(--color-primary)] hover:bg-gray-50">My Account</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:text-[var(--color-primary)] hover:bg-gray-50">My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-[var(--color-accent)] font-semibold hover:bg-orange-50">Admin Dashboard</Link>
                  )}
                  <div className="border-t border-gray-50 mt-2 pt-2">
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block text-sm font-semibold text-gray-700 hover:text-[var(--color-primary)] transition-colors uppercase tracking-wider">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-fade-in" style={{ animationDuration: '0.2s' }}>
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <span className="text-2xl font-display font-bold text-[var(--color-primary)]">PEARL AQUA.</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-900 p-2">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-grow">
              <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..." className="w-full bg-gray-50 rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
              </div>
              
              <nav className="flex flex-col space-y-6 text-lg font-medium text-gray-800">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Water Purifiers</Link>
                <Link to="/products?category=RO" onClick={() => setMobileMenuOpen(false)}>RO Purifiers</Link>
                <Link to="/products?category=UV" onClick={() => setMobileMenuOpen(false)}>UV Purifiers</Link>
              </nav>

              <hr className="my-8 border-gray-100" />

              {user ? (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] h-10 w-10 rounded-full flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 font-medium">My Account</Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 font-medium">My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-[var(--color-accent)] font-semibold">Admin Dashboard</Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-secondary text-center">Create Account</Link>
                </div>
              )}
            </div>

            {user && (
              <div className="p-5 border-t border-gray-100">
                <button onClick={handleLogout} className="flex items-center text-red-600 font-medium w-full">
                  <LogOut size={20} className="mr-3" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </nav>
    </div>
  );
};

export default Navbar;
