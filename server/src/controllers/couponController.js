const Coupon = require('../models/Coupon');

// @desc    Get all active coupons
// @route   GET /api/coupons
// @access  Public
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ isActive: true, expiryDate: { $gt: new Date() } });
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderValue } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      res.status(404);
      throw new Error('Invalid coupon code');
    }

    if (!coupon.isActive || new Date(coupon.expiryDate) < new Date()) {
      res.status(400);
      throw new Error('Coupon expired or inactive');
    }

    if (orderValue < coupon.minOrderValue) {
      res.status(400);
      throw new Error(`Minimum order value of ${coupon.minOrderValue} required`);
    }

    res.json(coupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
  try {
    const couponExists = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (couponExists) {
      res.status(400);
      throw new Error('Coupon code already exists');
    }
    const coupon = new Coupon(req.body);
    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      Object.assign(coupon, req.body);
      if (req.body.code) coupon.code = req.body.code.toUpperCase();
      const updatedCoupon = await coupon.save();
      res.json(updatedCoupon);
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon };
