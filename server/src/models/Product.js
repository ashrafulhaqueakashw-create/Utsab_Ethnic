const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // Store name to avoid joining just for display
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: true }
}, {
  timestamps: true
});

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0, min: 0 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  fabric: { type: String },
  basePrice: { type: Number, required: true },
  discountPrice: { type: Number },
  tags: [{ type: String }],
  collections: [{ type: String }],
  images: [{ 
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  }],
  sizeChartImage: { 
    url: { type: String },
    publicId: { type: String }
  },
  isPublished: { type: Boolean, default: true },
  variants: [variantSchema],
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
