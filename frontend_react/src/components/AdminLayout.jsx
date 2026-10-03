import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, List, Users, ShoppingCart, CreditCard, BarChart } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: List },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Reports', path: '/admin/reports', icon: BarChart },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-200px)] gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--color-primary-dark)] rounded-3xl shadow-lg border border-transparent p-6 self-start sticky top-24">
        <h2 className="text-xl font-display font-black text-white mb-8 px-2 tracking-wide">Pearl Admin</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-[var(--color-primary)] text-white shadow-md' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
