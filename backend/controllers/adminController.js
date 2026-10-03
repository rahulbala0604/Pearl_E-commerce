import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  
  // Aggregate sales/revenue
  const orders = await Order.find({});
  let totalSales = 0;
  let revenue = 0;
  
  let cancelledOrders = 0;
  let deliveredOrders = 0;

  orders.forEach(order => {
    if (order.paymentStatus === 'Paid') {
      totalSales += order.totalAmount;
      revenue += order.totalAmount; // Simplified, assuming revenue = sales for now
    }
    if (order.orderStatus === 'Cancelled') cancelledOrders++;
    if (order.orderStatus === 'Delivered') deliveredOrders++;
  });

  const successfulPayments = await Order.countDocuments({ paymentStatus: 'Paid' });
  const failedPayments = await Order.countDocuments({ paymentStatus: 'Failed' });
  const pendingPayments = await Order.countDocuments({ paymentStatus: 'Pending' });

  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'name email');

  res.json({
    totalOrders,
    totalSales,
    totalCustomers,
    totalProducts,
    successfulPayments,
    failedPayments,
    pendingPayments,
    cancelledOrders,
    deliveredOrders,
    revenue,
    recentOrders
  });
});

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
  
  // optionally get order counts for each customer
  const customersWithOrderCount = await Promise.all(customers.map(async (customer) => {
    const orderCount = await Order.countDocuments({ userId: customer._id });
    return { ...customer.toObject(), orderCount };
  }));

  res.json(customersWithOrderCount);
});

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Basic validation to prevent arbitrary statuses
  const validStatuses = ['Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Payment Failed'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  order.orderStatus = status;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
export const getAdminPayments = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
  const payments = orders.map(order => ({
    _id: order._id,
    orderId: order._id,
    paymentId: `PAY-${order._id.toString().substring(18).toUpperCase()}`,
    userId: order.userId,
    method: order.paymentMethod,
    amount: order.totalAmount,
    status: order.paymentStatus,
    transactionDate: order.createdAt,
  }));
  res.json(payments);
});

// @desc    Update payment status
// @route   PUT /api/admin/payments/:id/status
// @access  Private/Admin
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const validStatuses = ['Pending', 'Paid', 'Failed', 'Cancelled', 'Refunded'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid payment status');
  }

  order.paymentStatus = status;
  // Sync order status if paid
  if (status === 'Paid' && order.orderStatus === 'Pending Payment') {
    order.orderStatus = 'Processing';
  }
  
  const updatedOrder = await order.save();
  res.json({ message: 'Payment status updated', order: updatedOrder });
});
