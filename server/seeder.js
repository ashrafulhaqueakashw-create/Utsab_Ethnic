require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const Order = require('./src/models/Order');
const connectDB = require('./src/config/db');

connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '01700000000',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '01800000000',
    password: 'password123',
  },
];

const categories = [
  {
    name: 'Panjabi',
    slug: 'panjabi',
    description: 'Traditional and trendy Panjabis for all occasions.',
  },
  {
    name: 'Pajama',
    slug: 'pajama',
    description: 'Comfortable and stylish Pajamas.',
  },
  {
    name: 'Koti',
    slug: 'koti',
    description: 'Elegant Kotis and Waistcoats.',
  },
  {
    name: 'Combo Set',
    slug: 'combo-set',
    description: 'Complete ethnic wear combo sets.',
  },
];

// Helper to generate variants
const generateVariants = (sizes, colors, baseSku) => {
  const variants = [];
  sizes.forEach(size => {
    colors.forEach(color => {
      variants.push({
        size,
        color,
        sku: `${baseSku}-${size}-${color.substring(0, 3).toUpperCase()}`,
        stock: Math.floor(Math.random() * 50) + 10 // 10 to 60 stock
      });
    });
  });
  return variants;
};

const getProductsData = (createdCategories) => {
  const panjabiId = createdCategories.find(c => c.slug === 'panjabi')._id;
  const pajamaId = createdCategories.find(c => c.slug === 'pajama')._id;
  const kotiId = createdCategories.find(c => c.slug === 'koti')._id;
  const comboId = createdCategories.find(c => c.slug === 'combo-set')._id;

  return [
    // Panjabis
    {
      name: 'Premium Cotton Panjabi - Maroon',
      slug: 'premium-cotton-panjabi-maroon',
      description: 'A classic maroon cotton panjabi perfect for casual wear and festivals.',
      category: panjabiId,
      fabric: 'Cotton',
      basePrice: 1850,
      tags: ['Eid', 'Casual'],
      collections: ['New Arrival'],
      images: [
        { url: '/images/cat-panjabi.jpg', publicId: 'cat-panjabi' },
        { url: '/images/hero-1.jpg', publicId: 'hero-1' }
      ],
      isPublished: true,
      variants: generateVariants(['38', '40', '42', '44'], ['Maroon'], 'PNJ-MRN-01'),
    },
    {
      name: 'Silk Jacquard Panjabi - Gold',
      slug: 'silk-jacquard-panjabi-gold',
      description: 'Luxurious silk jacquard panjabi for weddings and special events.',
      category: panjabiId,
      fabric: 'Silk Jacquard',
      basePrice: 4500,
      discountPrice: 4000,
      tags: ['Wedding'],
      collections: ['Premium'],
      images: [
        { url: '/images/panjabi-gold-silk-jacquard.jpg', publicId: 'panjabi-gold-silk-jacquard' },
        { url: '/images/hero-3.jpg', publicId: 'hero-3' }
      ],
      isPublished: true,
      variants: generateVariants(['38', '40', '42', '44'], ['Gold'], 'PNJ-GLD-02'),
    },
    {
      name: 'Endi Cotton Panjabi - Olive Green',
      slug: 'endi-cotton-panjabi-olive-green',
      description: 'Comfortable Endi cotton panjabi in a subtle olive green shade.',
      category: panjabiId,
      fabric: 'Endi Cotton',
      basePrice: 2200,
      tags: ['Casual'],
      collections: ['Best Seller'],
      images: [
        { url: '/images/panjabi-emerald-green-set.jpg', publicId: 'panjabi-emerald-green-set' },
        { url: '/images/cat-panjabi.jpg', publicId: 'cat-panjabi' }
      ],
      isPublished: true,
      variants: generateVariants(['38', '40', '42'], ['Olive Green'], 'PNJ-OLV-03'),
    },
    {
      name: 'Linen Minimalist Panjabi - White',
      slug: 'linen-minimalist-panjabi-white',
      description: 'Minimalist white linen panjabi for a clean, sharp look.',
      category: panjabiId,
      fabric: 'Linen',
      basePrice: 2500,
      tags: ['Formal', 'Casual'],
      collections: ['Summer Collection'],
      images: [
        { url: '/images/panjabi-white-minimalist.jpg', publicId: 'panjabi-white-minimalist' },
        { url: '/images/hero-2.jpg', publicId: 'hero-2' }
      ],
      isPublished: true,
      variants: generateVariants(['40', '42', '44'], ['White'], 'PNJ-WHT-04'),
    },
    {
      name: 'Embroidered Georgette Panjabi - Black',
      slug: 'embroidered-georgette-panjabi-black',
      description: 'Black georgette panjabi with intricate embroidery.',
      category: panjabiId,
      fabric: 'Georgette',
      basePrice: 3200,
      tags: ['Eid', 'Wedding'],
      collections: ['New Arrival'],
      images: [
        { url: '/images/panjabi-royal-blue-velvet.jpg', publicId: 'panjabi-royal-blue-velvet' },
        { url: '/images/cat-panjabi.jpg', publicId: 'cat-panjabi' }
      ],
      isPublished: true,
      variants: generateVariants(['38', '40', '42', '44'], ['Black'], 'PNJ-BLK-05'),
    },

    // Pajamas
    {
      name: 'Classic White Cotton Pajama',
      slug: 'classic-white-cotton-pajama',
      description: 'Standard fit white cotton pajama, pairs perfectly with any panjabi.',
      category: pajamaId,
      fabric: 'Cotton',
      basePrice: 600,
      tags: ['Casual'],
      collections: ['Best Seller'],
      images: [
        { url: '/images/cat-pajama.jpg', publicId: 'cat-pajama' },
        { url: '/images/panjabi-white-minimalist.jpg', publicId: 'panjabi-white-minimalist' }
      ],
      isPublished: true,
      variants: generateVariants(['S', 'M', 'L', 'XL'], ['White'], 'PJM-WHT-01'),
    },
    {
      name: 'Slim Fit Churidar Pajama - Off White',
      slug: 'slim-fit-churidar-pajama-off-white',
      description: 'Slim fit churidar for a more tailored look.',
      category: pajamaId,
      fabric: 'Cotton Blend',
      basePrice: 850,
      tags: ['Wedding', 'Formal'],
      collections: [],
      images: [
        { url: '/images/cat-pajama.jpg', publicId: 'cat-pajama' }
      ],
      isPublished: true,
      variants: generateVariants(['M', 'L', 'XL'], ['Off White'], 'PJM-OFW-02'),
    },
    {
      name: 'Premium Silk Pajama - Gold',
      slug: 'premium-silk-pajama-gold',
      description: 'Silk pajama designed to complement premium and wedding panjabis.',
      category: pajamaId,
      fabric: 'Silk',
      basePrice: 1500,
      tags: ['Wedding'],
      collections: ['Premium'],
      images: [
        { url: '/images/cat-pajama.jpg', publicId: 'cat-pajama' },
        { url: '/images/panjabi-gold-silk-jacquard.jpg', publicId: 'panjabi-gold-silk-jacquard' }
      ],
      isPublished: true,
      variants: generateVariants(['M', 'L', 'XL'], ['Gold'], 'PJM-GLD-03'),
    },
    {
      name: 'Straight Cut Pajama - Black',
      slug: 'straight-cut-pajama-black',
      description: 'Black straight cut pajama for dark outfits.',
      category: pajamaId,
      fabric: 'Cotton',
      basePrice: 650,
      tags: ['Casual'],
      collections: [],
      images: [
        { url: '/images/cat-pajama.jpg', publicId: 'cat-pajama' }
      ],
      isPublished: true,
      variants: generateVariants(['S', 'M', 'L', 'XL'], ['Black'], 'PJM-BLK-04'),
    },

    // Kotis
    {
      name: 'Velvet Embroidered Koti - Navy Blue',
      slug: 'velvet-embroidered-koti-navy-blue',
      description: 'Navy blue velvet koti with silver embroidery.',
      category: kotiId,
      fabric: 'Velvet',
      basePrice: 3800,
      tags: ['Wedding'],
      collections: ['Premium', 'Winter Collection'],
      images: [
        { url: '/images/koti-navy-blue-jacquard.jpg', publicId: 'koti-navy-blue-jacquard' },
        { url: '/images/cat-koti.jpg', publicId: 'cat-koti' }
      ],
      isPublished: true,
      variants: generateVariants(['38', '40', '42'], ['Navy Blue'], 'KOT-NVY-01'),
    },
    {
      name: 'Textured Linen Koti - Grey',
      slug: 'textured-linen-koti-grey',
      description: 'Lightweight grey linen koti for daytime events.',
      category: kotiId,
      fabric: 'Linen',
      basePrice: 2800,
      tags: ['Formal'],
      collections: ['New Arrival'],
      images: [
        { url: '/images/cat-koti.jpg', publicId: 'cat-koti' },
        { url: '/images/koti-navy-blue-jacquard.jpg', publicId: 'koti-navy-blue-jacquard' }
      ],
      isPublished: true,
      variants: generateVariants(['38', '40', '42', '44'], ['Grey'], 'KOT-GRY-02'),
    },
    {
      name: 'Jamdani Motif Koti - Maroon',
      slug: 'jamdani-motif-koti-maroon',
      description: 'Maroon koti featuring traditional Jamdani motifs.',
      category: kotiId,
      fabric: 'Cotton Blend',
      basePrice: 3500,
      discountPrice: 3200,
      tags: ['Pohela Boishakh', 'Eid'],
      collections: ['Best Seller'],
      images: [
        { url: '/images/cat-koti.jpg', publicId: 'cat-koti' },
        { url: '/images/hero-1.jpg', publicId: 'hero-1' }
      ],
      isPublished: true,
      variants: generateVariants(['40', '42', '44'], ['Maroon'], 'KOT-MRN-03'),
    },
    {
      name: 'Classic Suiting Koti - Black',
      slug: 'classic-suiting-koti-black',
      description: 'Formal black koti made from suiting fabric.',
      category: kotiId,
      fabric: 'Suiting Fabric',
      basePrice: 2600,
      tags: ['Formal'],
      collections: [],
      images: [
        { url: '/images/koti-navy-blue-jacquard.jpg', publicId: 'koti-navy-blue-jacquard' },
        { url: '/images/cat-koti.jpg', publicId: 'cat-koti' }
      ],
      isPublished: true,
      variants: generateVariants(['38', '40', '42', '44'], ['Black'], 'KOT-BLK-04'),
    },

    // Combo Sets
    {
      name: 'Eid Special 2-Piece Set - Navy Panjabi & White Pajama',
      slug: 'eid-special-2-piece-set-navy',
      description: 'Complete your Eid look with this matching navy cotton panjabi and white pajama set.',
      category: comboId,
      fabric: 'Cotton',
      basePrice: 2300,
      tags: ['Eid'],
      collections: ['Eid Collection'],
      images: [
        { url: '/images/panjabi-royal-blue-velvet.jpg', publicId: 'panjabi-royal-blue-velvet' },
        { url: '/images/cat-combo.jpg', publicId: 'cat-combo' }
      ],
      isPublished: true,
      variants: generateVariants(['38', '40', '42', '44'], ['Navy/White'], 'CMB-NVY-01'),
    },
    {
      name: 'Premium 3-Piece Wedding Combo - Gold & Maroon',
      slug: 'premium-3-piece-wedding-combo-gold-maroon',
      description: 'Ultimate wedding attire: Gold Silk Panjabi, Maroon Velvet Koti, and Gold Silk Pajama.',
      category: comboId,
      fabric: 'Silk & Velvet',
      basePrice: 9500,
      discountPrice: 8500,
      tags: ['Wedding'],
      collections: ['Premium'],
      images: [
        { url: '/images/panjabi-gold-silk-jacquard.jpg', publicId: 'panjabi-gold-silk-jacquard' },
        { url: '/images/koti-navy-blue-jacquard.jpg', publicId: 'koti-navy-blue-jacquard' }
      ],
      isPublished: true,
      variants: generateVariants(['40', '42', '44'], ['Gold/Maroon'], 'CMB-GLD-02'),
    },
    {
      name: 'Casual 2-Piece Set - Olive Endi Cotton',
      slug: 'casual-2-piece-set-olive',
      description: 'Matching olive green Endi cotton panjabi and off-white pajama.',
      category: comboId,
      fabric: 'Endi Cotton',
      basePrice: 2800,
      tags: ['Casual'],
      collections: [],
      images: [
        { url: '/images/panjabi-emerald-green-set.jpg', publicId: 'panjabi-emerald-green-set' },
        { url: '/images/cat-combo.jpg', publicId: 'cat-combo' }
      ],
      isPublished: true,
      variants: generateVariants(['38', '40', '42'], ['Olive/Off White'], 'CMB-OLV-03'),
    },
  ];
};

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    const createdUsers = await User.insertMany(users);
    const createdCategories = await Category.insertMany(categories);

    const sampleProducts = getProductsData(createdCategories);

    await Product.insertMany(sampleProducts);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
