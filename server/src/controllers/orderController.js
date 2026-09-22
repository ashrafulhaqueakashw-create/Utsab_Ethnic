const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      guestInfo, // For guest checkout
      paymentDetails
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = new Order({
        orderItems,
        user: req.user ? req.user._id : null,
        guestInfo: req.user ? null : guestInfo,
        shippingAddress,
        paymentMethod,
        paymentDetails,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Track guest order
// @route   GET /api/orders/track
// @access  Public
const trackOrder = async (req, res, next) => {
  try {
    const { orderId, phone } = req.query;
    if (!orderId || !phone) {
      res.status(400);
      throw new Error('Order ID and Phone number required');
    }
    const order = await Order.findOne({ _id: orderId, 'guestInfo.phone': phone });
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = req.body.status;
      if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (order) {
      // Check if user is admin or the order belongs to the user
      if (
        (req.user && req.user.role === 'admin') ||
        (order.user && req.user && order.user._id.toString() === req.user._id.toString())
      ) {
        res.json(order);
      } else {
        res.status(401);
        throw new Error('Not authorized to view this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
const updateOrderPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.paymentDetails.status = req.body.status;
      if (req.body.transactionId) {
        order.paymentDetails.transactionId = req.body.transactionId;
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, trackOrder, updateOrderStatus, getOrderById, getOrders, updateOrderPayment };
