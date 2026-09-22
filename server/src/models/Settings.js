const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  shippingInsideDhaka: { type: Number, required: true, default: 80 },
  shippingOutsideDhaka: { type: Number, required: true, default: 150 },
  contactPhone: { type: String },
  contactEmail: { type: String },
  storeAddress: { type: String }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
