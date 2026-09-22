import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Public Pages
import Home from './pages/public/Home';
import ProductList from './pages/public/ProductList';
import ProductDetail from './pages/public/ProductDetail';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import OrderSuccess from './pages/public/OrderSuccess';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Profile from './pages/user/Profile';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminProductList from './pages/admin/ProductList';
import AdminOrderList from './pages/admin/OrderList';

// Components
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<ProductList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="search" element={<ProductList />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:id" element={<OrderSuccess />} />
          <Route path="order/:id" element={<OrderSuccess />} />
          <Route path="track-order" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          <Route path="" element={<PrivateRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<AdminProductList />} />
            <Route path="orders" element={<AdminOrderList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
