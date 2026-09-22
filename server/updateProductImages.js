require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Product = require('./src/models/Product');

const imageUpdates = {
  'premium-cotton-panjabi-maroon': [
    { url: '/images/cat-panjabi.jpg', publicId: 'cat-panjabi' },
    { url: '/images/hero-1.jpg', publicId: 'hero-1' }
  ],
  'silk-jacquard-panjabi-gold': [
    { url: '/images/panjabi-gold-silk-jacquard.jpg', publicId: 'panjabi-gold-silk-jacquard' },
    { url: '/images/hero-3.jpg', publicId: 'hero-3' }
  ],
  'endi-cotton-panjabi-olive-green': [
    { url: '/images/panjabi-emerald-green-set.jpg', publicId: 'panjabi-emerald-green-set' },
    { url: '/images/cat-panjabi.jpg', publicId: 'cat-panjabi' }
  ],
  'linen-minimalist-panjabi-white': [
    { url: '/images/panjabi-white-minimalist.jpg', publicId: 'panjabi-white-minimalist' },
    { url: '/images/hero-2.jpg', publicId: 'hero-2' }
  ],
  'embroidered-georgette-panjabi-black': [
    { url: '/images/panjabi-royal-blue-velvet.jpg', publicId: 'panjabi-royal-blue-velvet' },
    { url: '/images/cat-panjabi.jpg', publicId: 'cat-panjabi' }
  ],
  'classic-white-cotton-pajama': [
    { url: '/images/cat-pajama.jpg', publicId: 'cat-pajama' },
    { url: '/images/panjabi-white-minimalist.jpg', publicId: 'panjabi-white-minimalist' }
  ],
  'slim-fit-churidar-pajama-off-white': [
    { url: '/images/cat-pajama.jpg', publicId: 'cat-pajama' }
  ],
  'premium-silk-pajama-gold': [
    { url: '/images/cat-pajama.jpg', publicId: 'cat-pajama' },
    { url: '/images/panjabi-gold-silk-jacquard.jpg', publicId: 'panjabi-gold-silk-jacquard' }
  ],
  'straight-cut-pajama-black': [
    { url: '/images/cat-pajama.jpg', publicId: 'cat-pajama' }
  ],
  'velvet-embroidered-koti-navy-blue': [
    { url: '/images/koti-navy-blue-jacquard.jpg', publicId: 'koti-navy-blue-jacquard' },
    { url: '/images/cat-koti.jpg', publicId: 'cat-koti' }
  ],
  'textured-linen-koti-grey': [
    { url: '/images/cat-koti.jpg', publicId: 'cat-koti' },
    { url: '/images/koti-navy-blue-jacquard.jpg', publicId: 'koti-navy-blue-jacquard' }
  ],
  'jamdani-motif-koti-maroon': [
    { url: '/images/cat-koti.jpg', publicId: 'cat-koti' },
    { url: '/images/hero-1.jpg', publicId: 'hero-1' }
  ],
  'classic-suiting-koti-black': [
    { url: '/images/koti-navy-blue-jacquard.jpg', publicId: 'koti-navy-blue-jacquard' },
    { url: '/images/cat-koti.jpg', publicId: 'cat-koti' }
  ],
  'eid-special-2-piece-set-navy': [
    { url: '/images/panjabi-royal-blue-velvet.jpg', publicId: 'panjabi-royal-blue-velvet' },
    { url: '/images/cat-combo.jpg', publicId: 'cat-combo' }
  ],
  'premium-3-piece-wedding-combo-gold-maroon': [
    { url: '/images/panjabi-gold-silk-jacquard.jpg', publicId: 'panjabi-gold-silk-jacquard' },
    { url: '/images/koti-navy-blue-jacquard.jpg', publicId: 'koti-navy-blue-jacquard' }
  ],
  'casual-2-piece-set-olive': [
    { url: '/images/panjabi-emerald-green-set.jpg', publicId: 'panjabi-emerald-green-set' },
    { url: '/images/cat-combo.jpg', publicId: 'cat-combo' }
  ]
};

const updateProducts = async () => {
  try {
    await connectDB();
    console.log('Connected to DB for updating product images...');

    let updatedCount = 0;
    for (const [slug, images] of Object.entries(imageUpdates)) {
      const result = await Product.updateOne(
        { slug },
        { $set: { images } }
      );
      if (result.matchedCount > 0) {
        console.log(`Updated images for: ${slug}`);
        updatedCount++;
      } else {
        console.warn(`Product not found for slug: ${slug}`);
      }
    }

    console.log(`Successfully updated ${updatedCount} products!`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating product images:', error);
    process.exit(1);
  }
};

updateProducts();
