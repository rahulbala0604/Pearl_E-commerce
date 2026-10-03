import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-8 max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="flex flex-col space-y-6">
            <Link to="/" className="text-3xl font-display font-bold text-[var(--color-primary)] tracking-tight">
              PEARL AQUA<span className="text-[var(--color-text-main)] font-light">.</span>
            </Link>
            <p className="text-gray-500 font-light text-sm leading-relaxed max-w-xs">
              Advanced water purification designed for modern Indian homes as well as Industrial Purpose. Ensuring your family's health with every single drop.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-[var(--color-text-main)] font-semibold text-sm tracking-wider uppercase mb-2">Shop</h4>
            <Link to="/products" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Water Purifiers</Link>
            <Link to="/products?category=RO" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">RO Technology</Link>
            <Link to="/products?category=UV" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">UV Technology</Link>
            <Link to="/products?category=Alkaline" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Alkaline Purifiers</Link>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-[var(--color-text-main)] font-semibold text-sm tracking-wider uppercase mb-2">Support</h4>
            <Link to="#" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Customer Support</Link>
            <Link to="#" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Installation Support</Link>
            <Link to="#" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Warranty Information</Link>
            <Link to="/orders" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Track Orders</Link>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-[var(--color-text-main)] font-semibold text-sm tracking-wider uppercase mb-2">Legal</h4>
            <Link to="#" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Privacy Policy</Link>
            <Link to="#" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Terms of Service</Link>
            <Link to="#" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm">Cancellation & Refunds</Link>
          </div>
          
        </div>

        <div className="border-t border-gray-100 pt-8 mb-8 flex flex-col md:flex-row justify-between text-sm text-gray-500">
          <div className="flex flex-col space-y-2 mb-6 md:mb-0">
            <h4 className="text-[var(--color-text-main)] font-semibold text-sm tracking-wider uppercase mb-1">Contact Us</h4>
            <p>12/55 five star complex, puthiamputhur</p>
            <p>Phone: 9443841435, 9894991683</p>
            <p>Email: rahulbala0604@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pearl Aqua. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
