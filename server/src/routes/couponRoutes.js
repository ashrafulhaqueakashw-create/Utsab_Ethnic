const express = require('express');
const router = express.Router();
const { getCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getCoupons)
  .post(protect, admin, createCoupon);

router.post('/validate', validateCoupon);

router.route('/:id')
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

module.exports = router;
