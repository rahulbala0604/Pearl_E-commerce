import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address is required');
  }

  // 1. Get user's cart
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('No items in cart');
  }

  // 2. Validate stock and calculate prices securely on backend
  let subtotal = 0;
  let discountTotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }
    
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    subtotal += product.price * item.quantity;
    discountTotal += (product.discount || 0) * item.quantity;

    orderItems.push({
      productId: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price - (product.discount || 0), // The price they actually pay per item
    });
  }

  // 3. Calculate tax and total
  const tax = (subtotal - discountTotal) * 0.1; // Example 10% tax
  const totalAmount = (subtotal - discountTotal) + tax;

  const isCOD = paymentMethod === 'COD';
  const initialOrderStatus = isCOD ? 'Processing' : 'Pending Payment';

  // 4. Create the order
  const order = new Order({
    userId: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'COD',
    subtotal,
    discount: discountTotal,
    tax,
    totalAmount,
    orderStatus: initialOrderStatus,
    paymentStatus: 'Pending'
  });

  const createdOrder = await order.save();

  // Clear the user's cart after order creation
  cart.items = [];
  await cart.save();

  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('userId', 'name email');

  if (order) {
    // Only allow admin or the user who created the order to view it
    if (order.userId._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
      res.json(order);
    } else {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('userId', 'name email');
  res.json(orders);
});

export { createOrder, getOrderById, getMyOrders, getAllOrders };
