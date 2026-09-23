import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, ChevronDown, Heart, MapPin, Phone, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const totalItems = cartItems.reduce((a, c) => a + c.quantity, 0);

  const categories = [
    { name: 'Panjabi', slug: 'panjabi' },
    { name: 'Pajama', slug: 'pajama' },
    { name: 'Koti', slug: 'koti' },
    { name: 'Combo Sets', slug: 'combo-set' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-white text-xs">
        <div className="container-custom py-2 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-white/80">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> +880 1700-000000
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Dhaka, Bangladesh
            </span>
          </div>
          <div className="w-full md:w-auto overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex gap-16">
              <span>🎉 Free Delivery on orders over ৳3,000</span>
              <span>✨ New Eid Collection 2026 — Shop Now</span>
              <span>🔄 Easy 7-Day Returns</span>
              <span>🎉 Free Delivery on orders over ৳3,000</span>
              <span>✨ New Eid Collection 2026 — Shop Now</span>
              <span>🔄 Easy 7-Day Returns</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {userInfo ? (
              <Link to="/profile" className="hover:text-accent transition-colors">
                My Account
              </Link>
            ) : (
              <>
                <Link to="/login" className="hover:text-accent transition-colors">
                  Login
                </Link>
                <span className="text-white/30">|</span>
                <Link to="/register" className="hover:text-accent transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft'
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-serif font-bold text-sm">U</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg md:text-xl font-serif font-bold tracking-wide text-neutral-dark">
                  UTSAB
                </span>
                <span className="text-xs sm:text-sm md:text-base font-serif font-light tracking-wider text-primary ml-1">
                  ETHNIC
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className={`px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors rounded-lg ${
                    location.pathname.includes(cat.slug)
                      ? 'text-primary bg-primary-50'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* Wishlist */}
              <button
                className="hidden md:flex p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-gray-600" aria-hidden="true" />
              </button>

              {/* User */}
              <Link
                to={userInfo ? '/profile' : '/login'}
                aria-label={userInfo ? 'My Account' : 'Login'}
                className="hidden md:flex p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" aria-hidden="true" />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                aria-label={totalItems > 0 ? `Shopping Cart, ${totalItems} item${totalItems > 1 ? 's' : ''}` : 'Shopping Cart'}
                className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" aria-hidden="true" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {searchOpen && (
          <div className="border-t bg-white animate-fade-in-down">
            <div className="container-custom py-4">
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Panjabi, Pajama, Koti..."
                  aria-label="Search products"
                  className="input-field pl-12 pr-12"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-[60] animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-[70] animate-slide-in-left shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-sm">U</span>
                </div>
                <span className="font-serif font-bold tracking-wide text-neutral-dark">
                  UTSAB <span className="font-light text-primary">ETHNIC</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Drawer Search */}
            <div className="p-4 border-b bg-gray-50">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </form>
            </div>

            <nav className="p-5 space-y-1">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                Categories
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname.includes(cat.slug)
                      ? 'bg-primary-50 text-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            <div className="p-5 border-t space-y-1">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                Account
              </p>
              {userInfo ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile ({userInfo.name})
                  </Link>
                  {userInfo?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      dispatch(logout());
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
