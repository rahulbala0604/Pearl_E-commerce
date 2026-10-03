import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Helper to recalculate cart totals
const recalculateCart = async (cartItems) => {
  let subtotal = 0;
  let discountTotal = 0;
  const populatedItems = [];

  for (const item of cartItems) {
    const product = await Product.findById(item.productId);
    if (product) {
      const price = product.price;
      const discount = product.discount || 0;
      const qty = item.quantity;
      
      subtotal += price * qty;
      discountTotal += discount * qty;

      populatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        image: product.images[0] || '',
        stock: product.stock,
        quantity: qty
      });
    }
  }

  const tax = (subtotal - discountTotal) * 0.1; // Example 10% tax
  const total = (subtotal - discountTotal) + tax;

  return { items: populatedItems, subtotal, discount: discountTotal, tax, total };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id });
  
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }

  const cartDetails = await recalculateCart(cart.items);
  res.json({ _id: cart._id, ...cartDetails });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += Number(quantity);
    if (cart.items[existingItemIndex].quantity > product.stock) {
      res.status(400);
      throw new Error('Not enough stock available for the requested quantity');
    }
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  const cartDetails = await recalculateCart(cart.items);
  res.status(201).json(cartDetails);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;
  
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (existingItemIndex >= 0) {
    if (quantity <= 0) {
      cart.items.splice(existingItemIndex, 1);
    } else {
      cart.items[existingItemIndex].quantity = Number(quantity);
    }
    await cart.save();
    const cartDetails = await recalculateCart(cart.items);
    res.json(cartDetails);
  } else {
    res.status(404);
    throw new Error('Item not in cart');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  let cart = await Cart.findOne({ userId: req.user._id });
  
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(item => item.productId.toString() !== productId);
  await cart.save();
  
  const cartDetails = await recalculateCart(cart.items);
  res.json(cartDetails);
});

export { getCart, addToCart, updateCartItem, removeCartItem };
