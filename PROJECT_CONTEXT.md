# PROJECT_CONTEXT.md — Utsab Ethnic E-Commerce Platform

> **Purpose of this File**:  
> This file provides complete, authoritative context about the **Utsab Ethnic** e-commerce project. Provide or reference this document whenever prompting an AI assistant to generate code, components, endpoints, migrations, bug fixes, or documentation for this repository.

---

## 1. Project Overview

- **Project Name:** `utsab-ethnic`
- **Application Type:** Full-stack B2C E-Commerce Web Application
- **Domain / Niche:** Bangladeshi traditional & ethnic wear (Panjabi, Pajama, Koti / Waistcoats, Combo Sets, etc.)
- **Target Market & Localization:**
  - **Currency:** Bangladeshi Taka (BDT, symbol: `৳`, e.g. `৳1,850`)
  - **Shipping Structure:** Division → District → Thana hierarchical address model (Inside Dhaka: `৳80`, Outside Dhaka: `৳150`)
  - **Payment Gateways / Methods:** Cash on Delivery (COD), bKash, Nagad
- **Repository Architecture:** Monorepo containing two isolated sub-applications:
  - `/client` — React 19 SPA powered by Vite, Tailwind CSS, Redux Toolkit
  - `/server` — Express 5 REST API powered by Node.js, MongoDB (Mongoose), Cloudinary
- **Live Deployment:** `https://utsab-ethnic.vercel.app`

---

## 2. Tech Stack & Dependencies

### Frontend (`/client`)
- **Runtime & Build Tool:** Vite 8.3.0 (`@vitejs/plugin-react` 6.1.1)
- **Framework:** React 19.2.8 (`react`, `react-dom`)
- **Routing:** React Router v7 (`react-router-dom` 7.18.4)
- **State Management & Data Fetching:**
  - Redux Toolkit 2.12.0 (`@reduxjs/toolkit`)
  - React Redux 9.3.0 (`react-redux`)
  - RTK Query for caching, query deduping, and cache invalidation tags
- **Styling & UI:**
  - Tailwind CSS 3.4.0 (`tailwindcss`, `postcss`, `autoprefixer`)
  - Lucide React 1.47.0 (`lucide-react`) for icons
- **Linter:** Oxlint 1.81.0 (`oxlint`)
- **HTTP Client:** Axios 1.20.0 (RTK Query is primary; Axios also installed)

### Backend (`/server`)
- **Runtime:** Node.js (CommonJS, `type: "commonjs"`)
- **Web Framework:** Express 5.2.1 (`express`)
- **Database & ODM:** MongoDB with Mongoose 9.10.1 (`mongoose`)
- **Authentication & Security:**
  - JSON Web Tokens (`jsonwebtoken` 9.0.3)
  - Password hashing with `bcryptjs` 3.0.3
  - Cross-Origin Resource Sharing with `cors` 2.8.6
- **File Uploads & Media Storage:**
  - `multer` 2.4.0
  - `cloudinary` 1.41.3
  - `multer-storage-cloudinary` 4.0.0
- **Dev Tools:** Nodemon 3.1.14 (`nodemon`), Dotenv 18.0.1 (`dotenv`)

### Monorepo Orchestration (Root `/`)
- Concurrently 8.2.2 (`concurrently`) to run client and server together

---

## 3. Directory & File Structure

```
Utsab_Ethnic/
├── package.json               # Root scripts (dev, install:all, data:import, data:destroy)
├── package-lock.json
├── PROJECT_CONTEXT.md         # This context file
├── client/                    # React Frontend
│   ├── index.html             # HTML entry point (fonts: Inter, Playfair Display)
│   ├── vite.config.js         # Vite configuration with React plugin
│   ├── tailwind.config.js     # Custom theme (colors, fonts, keyframes, shadows)
│   ├── postcss.config.js
│   ├── .oxlintrc.json
│   ├── public/                # Static public assets (images, banners)
│   └── src/
│       ├── main.jsx           # React root with Redux Provider
│       ├── App.jsx            # BrowserRouter, Route definitions (Public, Private, Admin)
│       ├── index.css          # Tailwind directives & global utility classes
│       ├── store.js           # Redux configureStore (apiSlice, auth, cart)
│       ├── assets/            # App assets (hero images, svgs)
│       ├── components/
│       │   ├── common/
│       │   │   ├── AdminRoute.jsx     # Route protection for admin role
│       │   │   ├── PrivateRoute.jsx   # Route protection for authenticated users
│       │   │   ├── Loader.jsx         # Loading spinner component
│       │   │   └── Message.jsx        # Alert / Notification banners
│       │   ├── layout/
│       │   │   ├── Header.jsx         # Navigation bar, search, cart icon, user menu
│       │   │   ├── Footer.jsx         # Footer with links, trust badges, contact info
│       │   │   └── MainLayout.jsx     # Header + Outlet + Footer layout shell
│       │   └── product/
│       │       └── ProductCard.jsx    # Card showing image, title, price, ratings, badges
│       ├── features/
│       │   ├── api/
│       │   │   └── apiSlice.js        # RTK Query base slice (auth token header, tagTypes)
│       │   ├── auth/
│       │   │   ├── authSlice.js       # Auth state (userInfo, token, login/logout)
│       │   │   └── authApiSlice.js    # Login, register endpoints
│       │   ├── cart/
│       │   │   └── cartSlice.js       # Cart state (cartItems, shippingAddress, paymentMethod)
│       │   ├── categories/
│       │   │   └── categoriesApiSlice.js  # Category endpoints
│       │   ├── orders/
│       │   │   └── ordersApiSlice.js  # Order creation, order tracking, admin status updates
│       │   ├── products/
│       │   │   └── productsApiSlice.js# Product queries, filters, CRUD mutations, reviews
│       │   ├── settings/
│       │   │   └── settingsApiSlice.js# Banners, delivery fee settings endpoints
│       │   └── users/
│       │       └── usersApiSlice.js   # User profile endpoints
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx          # User login
│       │   │   └── Register.jsx       # User registration
│       │   ├── public/
│       │   │   ├── Home.jsx           # Hero carousel, category grid, featured products
│       │   │   ├── ProductList.jsx    # Category / search product listing with filters
│       │   │   ├── ProductDetail.jsx  # Single product details, variant selection, size chart
│       │   │   ├── Cart.jsx           # Cart view, quantity updates, order summary
│       │   │   ├── Checkout.jsx       # Shipping form (BD divisions), payment method
│       │   │   └── OrderSuccess.jsx   # Order confirmation & tracking link
│       │   ├── user/
│       │   │   └── Profile.jsx        # Customer profile, order history
│       │   └── admin/
│       │       ├── Dashboard.jsx      # Admin KPI stats & overview
│       │       ├── ProductList.jsx    # Product management (add, edit, delete)
│       │       └── OrderList.jsx      # Order management & status update
│       └── utils/
│           ├── bdLocations.js         # Bangladesh Division -> District -> Thana hierarchy
│           └── formatCurrency.js      # Formatter for Bangladeshi Taka (৳)
│
└── server/                    # Express Backend
    ├── index.js               # Entry point: loads .env, connects DB, starts listener
    ├── seeder.js              # Database seed script for users, categories, products
    ├── .env.example           # Environment variable template
    └── src/
        ├── app.js             # Express app: middleware (cors, json, urlencoded), routes, error handling
        ├── config/
        │   └── db.js          # Mongoose MongoDB connection
        ├── controllers/
        │   ├── authController.js      # Register & login logic
        │   ├── categoryController.js  # Category CRUD
        │   ├── couponController.js    # Coupon validation & CRUD
        │   ├── orderController.js     # Order creation (supports guest), tracking, status
        │   ├── productController.js   # Product filtering, sorting, pagination, CRUD, reviews
        │   ├── settingsController.js  # Banners & delivery fees configuration
        │   └── userController.js      # Profile retrieval & updates
        ├── middlewares/
        │   ├── authMiddleware.js      # JWT verification (`protect`), admin role check (`admin`)
        │   ├── errorMiddleware.js     # `notFound` (404) & `errorHandler` (500)
        │   └── uploadMiddleware.js    # Multer configuration with Cloudinary storage
        ├── models/
        │   ├── Banner.js              # Homepage carousel banners
        │   ├── Category.js            # Categories (Panjabi, Pajama, Koti, Combo Set)
        │   ├── Coupon.js              # Discount coupons
        │   ├── Order.js               # Orders, order items, variants, shipping, payments
        │   ├── Product.js             # Products, variants (size, color, SKU, stock), reviews
        │   ├── Settings.js            # Delivery fees & store contact information
        │   └── User.js                # Customer & Admin accounts, addresses, wishlist
        ├── routes/
        │   ├── authRoutes.js          # /api/auth
        │   ├── categoryRoutes.js      # /api/categories
        │   ├── couponRoutes.js        # /api/coupons
        │   ├── orderRoutes.js         # /api/orders
        │   ├── productRoutes.js       # /api/products
        │   ├── settingsRoutes.js      # /api/settings
        │   ├── uploadRoutes.js        # /api/upload
        │   └── userRoutes.js          # /api/users
        └── utils/
            └── generateToken.js       # JWT generation utility
```

---

## 4. Database Models & Schema Specifications

### `User` (`server/src/models/User.js`)
- `name`: String (required)
- `email`: String (sparse, unique)
- `phone`: String (sparse, unique)
- `password`: String (required, hashed via bcrypt pre-save hook)
- `role`: String enum `['user', 'admin']` (default: `'user'`)
- `addresses`: Array of `{ address, thana, district, division, isDefault }`
- `wishlist`: Array of ObjectIds referencing `Product`
- **Methods:** `matchPassword(enteredPassword)`

### `Product` (`server/src/models/Product.js`)
- `name`: String (required)
- `slug`: String (required, unique)
- `description`: String (required)
- `category`: ObjectId referencing `Category` (required)
- `fabric`: String (e.g., `'Cotton'`, `'Silk'`, `'Linen'`, `'Velvet'`)
- `basePrice`: Number (required)
- `discountPrice`: Number (optional)
- `tags`: Array of Strings
- `collections`: Array of Strings (e.g., `'Eid Collection'`, `'Summer Essentials'`, `'Premium'`)
- `images`: Array of `{ url: String, publicId: String }` (required)
- `sizeChartImage`: `{ url: String, publicId: String }`
- `isPublished`: Boolean (default: `true`)
- `variants`: Array of:
  - `size`: String (e.g., `'38'`, `'40'`, `'42'`, `'44'`, `'46'`)
  - `color`: String (e.g., `'Maroon'`, `'Navy Blue'`, `'White'`)
  - `sku`: String (required, unique, e.g. `'PAN-MAR-40'`)
  - `stock`: Number (default: `0`, min: `0`)
- `reviews`: Array of:
  - `user`: ObjectId referencing `User`
  - `name`: String
  - `rating`: Number (1 to 5)
  - `comment`: String
  - `isApproved`: Boolean (default: `true`)
- `averageRating`: Number (default: `0`)
- `numReviews`: Number (default: `0`)

### `Category` (`server/src/models/Category.js`)
- `name`: String (required, unique)
- `slug`: String (required, unique)
- `image`: `{ url: String, publicId: String }`
- `description`: String
- `parentCategory`: ObjectId referencing `Category` (default: `null`)

### `Order` (`server/src/models/Order.js`)
- `user`: ObjectId referencing `User` (optional for guest checkout)
- `guestInfo`: `{ name: String, phone: String, email: String }`
- `orderItems`: Array of:
  - `product`: ObjectId referencing `Product`
  - `name`: String
  - `image`: String
  - `variant`: `{ size: String, color: String, sku: String }`
  - `price`: Number
  - `quantity`: Number
- `shippingAddress`:
  - `address`: String (required)
  - `thana`: String (required)
  - `district`: String (required)
  - `division`: String (required)
- `paymentMethod`: String enum `['COD', 'bKash', 'Nagad']`
- `paymentDetails`:
  - `transactionId`: String
  - `status`: String enum `['Pending', 'Verified', 'Failed']` (default: `'Pending'`)
- `itemsPrice`: Number (default: `0.0`)
- `shippingPrice`: Number (default: `0.0`)
- `totalPrice`: Number (default: `0.0`)
- `orderStatus`: String enum `['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned']` (default: `'Pending'`)
- `deliveredAt`: Date

### `Coupon` (`server/src/models/Coupon.js`)
- `code`: String (required, unique, uppercase)
- `discountType`: String enum `['percentage', 'fixed']`
- `discountValue`: Number (required)
- `minOrderValue`: Number (default: `0`)
- `maxDiscount`: Number (optional cap for percentage discounts)
- `expiryDate`: Date (required)
- `isActive`: Boolean (default: `true`)

### `Settings` (`server/src/models/Settings.js`)
- `shippingInsideDhaka`: Number (default: `80`)
- `shippingOutsideDhaka`: Number (default: `150`)
- `contactPhone`: String
- `contactEmail`: String
- `storeAddress`: String

### `Banner` (`server/src/models/Banner.js`)
- `title`: String
- `subtitle`: String
- `image`: `{ url: String, publicId: String }` (required)
- `link`: String
- `position`: Number (default: `0`)
- `isActive`: Boolean (default: `true`)

---

## 5. REST API Routes Reference

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| **Auth** | | | |
| `POST` | `/api/auth/register` | Public | Register new customer (`name, email/phone, password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| **Users** | | | |
| `GET` | `/api/users/me` | Private | Get current user profile |
| `PUT` | `/api/users/me` | Private | Update current user profile / password |
| **Products** | | | |
| `GET` | `/api/products` | Public | List products (queries: `keyword`, `category`, `collection`, `sort`, `page`, `limit`, etc.) |
| `GET` | `/api/products/:slug` | Public | Get single product by slug |
| `POST` | `/api/products` | Private/Admin | Create a new product |
| `PUT` | `/api/products/:id` | Private/Admin | Update an existing product |
| `DELETE` | `/api/products/:id` | Private/Admin | Delete a product |
| `POST` | `/api/products/:id/reviews` | Private | Add review & rating to product |
| **Categories** | | | |
| `GET` | `/api/categories` | Public | List all categories |
| `POST` | `/api/categories` | Private/Admin | Create a category |
| `PUT` | `/api/categories/:id` | Private/Admin | Update a category |
| `DELETE` | `/api/categories/:id` | Private/Admin | Delete a category |
| **Orders** | | | |
| `POST` | `/api/orders` | Public/Private | Place order (guest or authenticated) |
| `GET` | `/api/orders/myorders` | Private | List current user's orders |
| `GET` | `/api/orders/track` | Public | Track order by order ID & phone |
| `GET` | `/api/orders/:id` | Private | Get single order details |
| `GET` | `/api/orders` | Private/Admin | List all orders with pagination & filters |
| `PUT` | `/api/orders/:id/status` | Private/Admin | Update order fulfillment status |
| `PUT` | `/api/orders/:id/payment` | Private/Admin | Update manual payment status (bKash/Nagad verification) |
| **Coupons** | | | |
| `GET` | `/api/coupons` | Private/Admin | List all coupons |
| `POST` | `/api/coupons` | Private/Admin | Create a coupon |
| `POST` | `/api/coupons/validate` | Public | Validate coupon code against cart value |
| `PUT` | `/api/coupons/:id` | Private/Admin | Update coupon |
| `DELETE` | `/api/coupons/:id` | Private/Admin | Delete coupon |
| **Settings & Banners** | | | |
| `GET` | `/api/settings/banners` | Public | Fetch active homepage banners |
| `POST` | `/api/settings/banners` | Private/Admin | Create a banner |
| `PUT` | `/api/settings/banners/:id` | Private/Admin | Update banner |
| `DELETE` | `/api/settings/banners/:id` | Private/Admin | Delete banner |
| `GET` | `/api/settings/delivery-fees` | Public | Fetch delivery fees and store info |
| `PUT` | `/api/settings/delivery-fees` | Private/Admin | Update delivery fees & store info |
| **Uploads** | | | |
| `POST` | `/api/upload` | Private/Admin | Upload single image to Cloudinary (`multipart/form-data`) |

---

## 6. Frontend Architecture & Design System

### 6.1 State Management Architecture
- **Root Store (`client/src/store.js`):** Combines `apiSlice`, `authReducer`, and `cartReducer`.
- **`apiSlice` (`client/src/features/api/apiSlice.js`):**
  - Base URL: `import.meta.env.VITE_API_URL || '/api'` (relative path proxies through Vite dev server to `http://localhost:5000` to allow seamless local network & mobile testing without CORS/localhost issues).
  - Automatically attaches `Authorization: Bearer <token>` from `auth.token`.
  - Tag types: `['Product', 'Order', 'User', 'Category', 'Coupon', 'Settings']`.
- **`authSlice` (`client/src/features/auth/authSlice.js`):**
  - Manages `userInfo`, `token`, and localStorage sync.
- **`cartSlice` (`client/src/features/cart/cartSlice.js`):**
  - Tracks `cartItems`, `shippingAddress`, `paymentMethod`, `itemsPrice`, `shippingPrice`, `totalPrice`.
  - Automatically persists cart items to `localStorage`.
  - Item structure in cart: `{ product: id, name, image, price, quantity, variant: { size, color, sku } }`.

### 6.2 Design System & Tailwind Configuration
- **Color Palette:**
  - `primary`: `#800000` (Deep Maroon — traditional ethnic feel)
    - `primary-light`: `#A52A2A`
    - `primary-dark`: `#4B0000`
    - Tints: `primary-50` (`#fdf2f2`) to `primary-700` (`#4B0000`)
  - `accent`: `#e07a5f` (Terracotta / warm clay)
    - `accent-light`: `#e89b85`, `accent-dark`: `#c65d3e`
  - `surface`:
    - Default: `#ffffff`
    - `surface-warm`: `#faf8f5`
    - `surface-muted`: `#f5f3f0`
  - `neutral`:
    - `neutral-light`: `#fafafa`
    - `neutral-dark`: `#222222`
- **Typography:**
  - Headings & Accents: `font-serif` (`Playfair Display`, `Georgia`, serif)
  - Body & UI: `font-sans` (`Inter`, system-ui, sans-serif)
- **Shadows:** `shadow-soft`, `shadow-elevated`, `shadow-card`, `shadow-card-hover`
- **Animations:** `animate-fade-in`, `animate-fade-in-up`, `animate-shimmer`, `animate-float`, `animate-marquee`

### 6.3 Routing & Protection Matrix
- **Public Routes:**
  - `/` — Home (Hero carousel, category highlights, featured products, trust badges)
  - `/category/:slug` — Product list filtered by category
  - `/product/:slug` — Single product page with variant/size selector & reviews
  - `/cart` — Shopping cart summary & quantity adjustment
  - `/checkout` — Shipping address with Bangladesh Division/District/Thana dropdowns & payment selector
  - `/order-success/:id` — Confirmation with order ID & receipt
  - `/login` — Customer login
  - `/register` — Customer registration
- **Private Routes (`<PrivateRoute>`):**
  - `/profile` — Order history, saved addresses, password update
- **Admin Routes (`<AdminRoute>`):**
  - `/admin/dashboard` — Analytics, revenue, recent orders
  - `/admin/products` — Product inventory table, create/edit modal
  - `/admin/orders` — Order status management & bKash/Nagad verification

---

## 7. Development & Environment Configuration

### Environment Variables

#### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shop
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (`client/.env` or `.env.development`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Essential Commands

| Command | Working Directory | Description |
|---|---|---|
| `npm run dev` | `/` (root) | Starts both frontend (`http://localhost:5173`) and backend (`http://localhost:5000`) concurrently |
| `npm run dev:server` | `/` or `/server` | Starts backend using Nodemon |
| `npm run dev:client` | `/` or `/client` | Starts frontend using Vite |
| `npm run install:all` | `/` (root) | Installs dependencies for both server and client |
| `npm run data:import` | `/` or `/server` | Seeds the database with default users, categories, and products (`seeder.js`) |
| `npm run data:destroy` | `/` or `/server` | Clears all data from the database |
| `npm run build` | `/client` | Creates optimized production build in `client/dist` |
| `npm run lint` | `/client` | Runs Oxlint on client source files |

---

## 8. Conventions & Best Practices for AI Assistants

When generating or editing code in this repository, always follow these rules:

1. **Maintain Architectural Separation:**
   - Keep backend business logic in controllers (`server/src/controllers/`), database queries in Mongoose models (`server/src/models/`), and route definitions clean (`server/src/routes/`).
   - Keep frontend network calls inside RTK Query slices (`client/src/features/*/*ApiSlice.js`), not raw `fetch` or `axios` inside components.
2. **Currency & Localization:**
   - Always display prices in BDT using `formatCurrency(amount)` from `client/src/utils/formatCurrency.js`.
   - Never hardcode `$`, always use `৳`.
   - Respect the Bangladesh location structure from `client/src/utils/bdLocations.js` (Division → District → Thana).
3. **Variants & Inventory:**
   - Products have multiple variants with specific `size`, `color`, `sku`, and `stock`. When adding products to cart, always include the variant object (`variant.sku`).
4. **Tailwind Design System:**
   - Stick to defined colors: `primary`, `accent`, `surface-warm`, `surface-muted`, and neutral shades.
   - Use `font-serif` for titles / hero headings, `font-sans` for body and interactive elements.
   - Use Lucide React icons (`lucide-react`) for UI icons.
5. **Route Protection & Roles:**
   - Wrap user-protected routes with `<PrivateRoute />`.
   - Wrap admin-only routes with `<AdminRoute />`.
   - Admin check on backend: always use `protect, admin` middlewares in routes.
6. **Error Handling:**
   - Backend: Use `next(error)` in async route handlers or pass errors to `errorHandler`.
   - Frontend: Handle RTK Query `isLoading`, `isError`, and `error` states gracefully using `<Loader />` and `<Message />` components.
7. **Image Management & Consolidation:**
   - All local static product and category images are consolidated in `client/public/images/`.
   - Express backend also serves `/images` via `express.static(path.join(__dirname, '../../client/public/images'))` in `server/src/app.js`.
   - The database seeder (`server/seeder.js`) and live database contain local `/images/...` paths for all products.
   - Cloudinary upload route (`/api/upload`) remains available for administrative product image uploads.
   - Brand monogram favicon is located at `client/public/favicon.svg` (and `client/dist/favicon.svg`).
8. **Mobile Responsiveness & Networking:**
   - Vite is configured with `server: { host: true, proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } } }`.
   - For local mobile testing over Wi-Fi, ensure the host Windows network profile is set to "Private" to allow port 5173 access.
   - Header brand logo (`[U] UTSAB ETHNIC`) is visible across all screen sizes.
   - Hero carousel navigation arrows are hidden on mobile (`hidden sm:flex`) to avoid overlapping description text.
9. **Accessibility (WCAG 2.1 AA) & Semantic Standards:**
   - **Color Contrast:** All text must strictly satisfy the 4.5:1 ratio requirement (and 3:1 for large text / graphical UI).
     - On `primary` (`#800000`) backgrounds: Use `text-white` (9.55:1) or `text-white/80` (> 6.5:1). Never use `text-accent` (`#e07a5f`, 3.71:1) or low-opacity white `text-white/60` (4.47:1) on primary dark maroon.
     - On `accent` (`#e07a5f`) elements: Use dark text (e.g. `text-neutral-900`) or use `bg-neutral-dark text-white` for buttons on primary banners (16.15:1). Pure white on `accent` yields 2.95:1 and fails WCAG AA.
     - On `neutral-dark` (`#222222`) backgrounds: Use `text-gray-400` (6.34:1) or `text-gray-300` (9.07:1). Avoid `text-gray-500` (3.29:1).
   - **Heading Hierarchy:** Maintain sequentially-descending heading outlines without skipping levels (`<h1>` → `<h2>` → `<h3>`).
     - Category/Page titles must be `<h1>`.
     - Primary section headings (Sidebar filters, product catalog, newsletter footer) must be `<h2>`. When a visual section title isn't needed, use `<h2 className="sr-only">Product Catalog</h2>`.
     - Subsections, filter options, individual product titles in `ProductCard`, and footer columns must be `<h3>`.
   - **Accessible Link & Button Names:** Every icon-only or text-free interactive link/button (e.g., shopping cart, wishlist, profile/login, modal close buttons, quantity adjusters) MUST include a descriptive `aria-label`. Mark decorative Lucide icons with `aria-hidden="true"`.
   - **Programmatic Form Labels:** Every `<select>` and `<input>` element must have an associated `<label>` (visually hidden with `sr-only` if not displayed in design) matching the input's `id`, alongside explicit `aria-label` attributes.

