import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Cart from './pages/Cart';
import About from './pages/About';
import Support from './pages/Support';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Customers from './pages/admin/Customers';
import Orders from './pages/admin/Orders';
import Payments from './pages/admin/Payments';
import Reports from './pages/admin/Reports';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 w-full max-w-[1440px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/order/:id" element={<OrderDetails />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="reports" element={<Reports />} />
                </Route>
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </Router>
    </CartProvider>
  );
}

export default App;
