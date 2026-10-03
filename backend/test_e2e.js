import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

dotenv.config();

const API = 'http://localhost:5000/api';
let customerToken = '';
let adminToken = '';
let productId = '';
let orderId = '';

const apiFetch = async (url, options = {}) => {
  options.headers = options.headers || {};
  options.headers['Content-Type'] = 'application/json';
  if (options.body) options.body = JSON.stringify(options.body);
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'API Error');
  return { data, headers: res.headers };
};

async function runTests() {
  console.log('--- STARTING E2E API TESTS ---');

  await mongoose.connect(process.env.MONGODB_URI);
  
  await User.deleteMany({ email: { $in: ['test_admin@example.com', 'test_customer@example.com'] } });
  
  const custRes = await apiFetch(`${API}/auth/register`, {
    method: 'POST',
    body: {
      name: 'Test Customer',
      email: 'test_customer@example.com',
      password: 'password123'
    }
  });
  console.log('Customer registered:', custRes.data.email);

  const custLogin = await apiFetch(`${API}/auth/login`, {
    method: 'POST',
    body: {
      email: 'test_customer@example.com',
      password: 'password123'
    }
  });
  customerToken = custLogin.data.token || (custLogin.headers.get('set-cookie') && custLogin.headers.get('set-cookie').split(';')[0].split('=')[1]);
  console.log('Customer Login successful.');

  await User.create({
    name: 'Test Admin',
    email: 'test_admin@example.com',
    password: 'password123',
    role: 'admin'
  });
  
  const adminLogin = await apiFetch(`${API}/auth/login`, {
    method: 'POST',
    body: {
      email: 'test_admin@example.com',
      password: 'password123'
    }
  });
  adminToken = adminLogin.data.token || (adminLogin.headers.get('set-cookie') && adminLogin.headers.get('set-cookie').split(';')[0].split('=')[1]);
  console.log('Admin Login successful.');

  const getCustConfig = () => ({ headers: { Cookie: `jwt=${customerToken}` } });
  const getAdminConfig = () => ({ headers: { Cookie: `jwt=${adminToken}` } });

  console.log('\\n--- PRODUCTS ---');
  const productRes = await apiFetch(`${API}/products`, {
    method: 'POST',
    ...getAdminConfig(),
    body: {
      name: 'E2E Test Product',
      description: 'Testing',
      price: 100,
      category: 'Test',
      stock: 10,
      images: ['test.jpg']
    }
  });
  productId = productRes.data._id;
  console.log('Admin created product:', productId);

  const getProducts = await apiFetch(`${API}/products`);
  console.log('Customer fetched products, total:', getProducts.data.products.length);

  console.log('\\n--- CART ---');
  const cartAddRes = await apiFetch(`${API}/cart`, {
    method: 'POST',
    ...getCustConfig(),
    body: {
      productId,
      quantity: 2
    }
  });
  console.log('Customer added to cart, total items:', cartAddRes.data.items?.length || 0);

  console.log('\\n--- ORDERS ---');
  const orderRes = await apiFetch(`${API}/orders`, {
    method: 'POST',
    ...getCustConfig(),
    body: {
      orderItems: [{ product: productId, name: 'E2E Test Product', image: 'test.jpg', price: 10, quantity: 2 }],
      shippingAddress: { address: '123 Test St', city: 'Testville', postalCode: '12345', country: 'Testland' },
      paymentMethod: 'Online',
      itemsPrice: 20,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: 20
    }
  });
  orderId = orderRes.data._id;
  console.log('Created order:', orderId, 'Total Amount:', orderRes.data.totalAmount);
  if (orderRes.data.totalAmount !== 200) {
    console.log('❌ PRICE AUTHORITY FAIL: Order total was manipulated! Expected 200, got', orderRes.data.totalAmount);
  } else {
    console.log('✅ Price Authority Verified: Order total is authoritative (200).');
  }



  console.log('\\n--- ADMIN ---');
  const dashboard = await apiFetch(`${API}/admin/dashboard`, { method: 'GET', ...getAdminConfig() });
  console.log('Admin Dashboard Sales:', dashboard.data.totalSales);

  console.log('\\n✅ ALL E2E API TESTS COMPLETED');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed:', err.message);
  process.exit(1);
});
