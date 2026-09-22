const Settings = require('../models/Settings');
const Banner = require('../models/Banner');

// @desc    Get all active banners
// @route   GET /api/settings/banners
// @access  Public
const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort('position');
    res.json(banners);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a banner
// @route   POST /api/settings/banners
// @access  Private/Admin
const createBanner = async (req, res, next) => {
  try {
    const banner = new Banner(req.body);
    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a banner
// @route   PUT /api/settings/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      Object.assign(banner, req.body);
      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404);
      throw new Error('Banner not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a banner
// @route   DELETE /api/settings/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await banner.deleteOne();
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404);
      throw new Error('Banner not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get delivery fees and other settings
// @route   GET /api/settings/delivery-fees
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if not exists
      const defaultSettings = await Settings.create({});
      return res.json(defaultSettings);
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery fees and other settings
// @route   PUT /api/settings/delivery-fees
// @access  Private/Admin
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (settings) {
      Object.assign(settings, req.body);
      const updatedSettings = await settings.save();
      res.json(updatedSettings);
    } else {
      const newSettings = await Settings.create(req.body);
      res.status(201).json(newSettings);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getSettings,
  updateSettings
};
