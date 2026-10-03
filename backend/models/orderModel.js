import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'UPI', 'CARD', 'NET_BANKING'], default: 'COD' },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Cancelled', 'Refunded'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Payment Failed'],
      default: 'Pending Payment',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
