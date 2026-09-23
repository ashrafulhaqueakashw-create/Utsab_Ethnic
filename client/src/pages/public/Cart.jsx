import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { Trash2, Minus, Plus, ShoppingBag, ChevronRight, ArrowRight, Truck, Shield } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const freeDeliveryThreshold = 3000;
  const freeDelivery = itemsPrice >= freeDeliveryThreshold;

  const updateQuantity = (item, newQty) => {
    if (newQty < 1 || newQty > item.stock) return;
    dispatch(addToCart({ ...item, quantity: newQty }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="container-custom text-center py-24 md:py-32">
        <div className="w-24 h-24 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our collection and find something you love.</p>
        <Link to="/" className="btn-primary text-sm uppercase tracking-wider">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-dark font-medium">Shopping Cart</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8">Shopping Cart <span className="text-gray-400 font-normal text-lg">({totalItems})</span></h1>

      {/* Free Delivery Progress */}
      {!freeDelivery && (
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-accent" />
            <p className="text-sm font-medium text-neutral-dark">
              Add <span className="text-primary font-bold">{formatCurrency(freeDeliveryThreshold - itemsPrice)}</span> more for free delivery
            </p>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (itemsPrice / freeDeliveryThreshold) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.variant.sku}
              className="flex gap-4 bg-white rounded-2xl p-4 md:p-5 shadow-card border border-gray-100/80 hover:shadow-soft transition-shadow duration-300"
            >
              <Link to={`/product/${item.slug}`} className="w-24 h-32 md:w-28 md:h-36 rounded-xl overflow-hidden bg-surface-muted flex-shrink-0">
                <img
                  src={item.image || '/images/cat-panjabi.jpg'}
                  alt={item.name}
                  onError={(e) => { e.currentTarget.src = '/images/cat-panjabi.jpg'; }}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <Link to={`/product/${item.slug}`} className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">
                    {item.variant.size} · {item.variant.color}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="px-2.5 py-1.5 hover:bg-gray-50 transition"
                    >
                      <Minus className="w-3 h-3" aria-hidden="true" />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-200 min-w-[40px] text-center" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="px-2.5 py-1.5 hover:bg-gray-50 transition"
                    >
                      <Plus className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="font-bold text-primary">{formatCurrency(item.price * item.quantity)}</p>
                  <button
                    onClick={() => dispatch(removeFromCart(item.variant.sku))}
                    aria-label={`Remove ${item.name} from cart`}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100/80 h-fit lg:sticky lg:top-28">
          <h2 className="font-serif text-lg font-bold mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal ({totalItems} items)</span>
              <span className="font-medium">{formatCurrency(itemsPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery</span>
              <span className={`font-medium ${freeDelivery ? 'text-emerald-600' : 'text-gray-500'}`}>
                {freeDelivery ? 'Free' : 'Calculated at checkout'}
              </span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between text-base font-bold pt-1">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(itemsPrice)}</span>
            </div>
          </div>

          <Link to="/checkout" className="btn-primary w-full mt-6 py-4 text-sm uppercase tracking-wider">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/" className="block text-center text-sm text-gray-500 hover:text-primary mt-4 transition-colors">
            Continue Shopping
          </Link>

          {/* Trust Signals */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Truck className="w-3.5 h-3.5" />
              <span>Free delivery over ৳3,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
