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
let categoryId = '';
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
  console.log('--- STARTING APP FLOW TESTS ---');

  // 1. Verify MongoDB Connectivity
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB Connected successfully.');
  
  await User.deleteMany({ email: { $in: ['test_admin@example.com', 'test_customer@example.com'] } });
  
  // Register customer
  const custRes = await apiFetch(`${API}/auth/register`, {
    method: 'POST',
    body: {
      name: 'Test Customer',
      email: 'test_customer@example.com',
      password: 'password123'
    }
  });
  console.log('Customer registered:', custRes.data.email);

  // Login customer
  const custLogin = await apiFetch(`${API}/auth/login`, {
    method: 'POST',
    body: {
      email: 'test_customer@example.com',
      password: 'password123'
    }
  });
  customerToken = custLogin.data.token || (custLogin.headers.get('set-cookie') && custLogin.headers.get('set-cookie').split(';')[0].split('=')[1]);

  // Admin login
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
  console.log('✅ Authentications successful.');

  const getCustConfig = () => ({ headers: { Cookie: `jwt=${customerToken}`, Authorization: `Bearer ${customerToken}` } });
  const getAdminConfig = () => ({ headers: { Cookie: `jwt=${adminToken}`, Authorization: `Bearer ${adminToken}` } });

  // Admin Categories (Admin Panel testing)
  console.log('\\n--- ADMIN PANEL TESTING ---');
  // In the real code, category endpoint might not exist, but we will test admin endpoints
  const dashboard = await apiFetch(`${API}/admin/dashboard`, { method: 'GET', ...getAdminConfig() });
  console.log('✅ Admin Dashboard Sales:', dashboard.data.totalSales);
  
  const allOrders = await apiFetch(`${API}/admin/orders`, { method: 'GET', ...getAdminConfig() }).catch(e => console.log(e.message));
  if (allOrders?.data) console.log(`✅ Admin Orders fetched. Count: ${allOrders.data.length}`);

  // Products Testing
  console.log('\\n--- PRODUCTS ---');
  const productRes = await apiFetch(`${API}/products`, {
    method: 'POST',
    ...getAdminConfig(),
    body: {
      name: 'Flow Test Product',
      description: 'Testing',
      price: 150,
      category: 'Electronics',
      stock: 20,
      images: ['test_img.jpg']
    }
  });
  productId = productRes.data._id;
  console.log('✅ Admin created product:', productId);

  const getProducts = await apiFetch(`${API}/products`);
  console.log('✅ Customer fetched products, total:', getProducts.data.products.length);
  
  const getSingleProduct = await apiFetch(`${API}/products/${productId}`);
  console.log('✅ Customer fetched single product details:', getSingleProduct.data.name);

  // Cart Testing
  console.log('\\n--- CART ---');
  const cartAddRes = await apiFetch(`${API}/cart`, {
    method: 'POST',
    ...getCustConfig(),
    body: { productId, quantity: 2 }
  });
  console.log('✅ Customer added to cart, items:', cartAddRes.data.items?.length || 0);

  // Order Testing
  console.log('\\n--- ORDERS ---');
  const orderRes = await apiFetch(`${API}/orders`, {
    method: 'POST',
    ...getCustConfig(),
    body: {
      orderItems: [{ product: productId, name: 'Flow Test Product', image: 'test.jpg', price: 150, quantity: 2 }],
      shippingAddress: { address: '123 Test St', city: 'Testville', postalCode: '12345', country: 'Testland' },
      paymentMethod: 'COD',
      itemsPrice: 300,
      taxPrice: 30,
      shippingPrice: 0,
      totalPrice: 330
    }
  });
  orderId = orderRes.data._id;
  const orderCheck = await Order.findById(orderId);
  if (orderCheck.orderStatus === 'Pending Payment') {
    console.log(`✅ Order created successfully. Status correctly remains: ${orderCheck.orderStatus}`);
  } else {
    console.log(`❌ Order status mismatch. Status: ${orderCheck.orderStatus}`);
  }
  
  const orderDetails = await apiFetch(`${API}/orders/${orderId}`, { method: 'GET', ...getCustConfig() });
  console.log(`✅ Customer fetched Order Details successfully. Amount: ${orderDetails.data.totalAmount}`);

  console.log('\\n✅ ALL APP FLOW TESTS COMPLETED');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed:', err.message);
  process.exit(1);
});
