const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
