const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, trackOrder, updateOrderStatus, getOrderById, getOrders, updateOrderPayment } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Custom middleware to optionally authenticate for guest checkout
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .post(optionalProtect, createOrder)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/track').get(trackOrder);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/payment').put(protect, admin, updateOrderPayment);

module.exports = router;
