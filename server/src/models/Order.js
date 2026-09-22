const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  variant: {
    size: { type: String, required: true },
    color: { type: String, required: true },
    sku: { type: String, required: true }
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestInfo: {
    name: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    address: { type: String, required: true },
    thana: { type: String, required: true },
    district: { type: String, required: true },
    division: { type: String, required: true }
  },
  paymentMethod: { 
    type: String, 
    enum: ['COD', 'bKash', 'Nagad'], 
    required: true 
  },
  paymentDetails: {
    transactionId: { type: String },
    status: { type: String, enum: ['Pending', 'Verified', 'Failed'], default: 'Pending' }
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'], 
    default: 'Pending' 
  },
  deliveredAt: { type: Date }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
