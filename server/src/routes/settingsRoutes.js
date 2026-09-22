const express = require('express');
const router = express.Router();
const { getBanners, createBanner, updateBanner, deleteBanner, getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/banners')
  .get(getBanners)
  .post(protect, admin, createBanner);

router.route('/banners/:id')
  .put(protect, admin, updateBanner)
  .delete(protect, admin, deleteBanner);

router.route('/delivery-fees')
  .get(getSettings)
  .put(protect, admin, updateSettings);

module.exports = router;
