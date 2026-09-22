const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      url: req.file.path,
      publicId: req.file.filename
    });
  } else {
    res.status(400);
    throw new Error('Image upload failed');
  }
});

module.exports = router;
