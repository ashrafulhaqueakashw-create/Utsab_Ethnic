const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  image: { 
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  },
  link: { type: String },
  position: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;
