import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../features/cart/cartSlice';
import { useCreateOrderMutation } from '../../features/orders/ordersApiSlice';
import Message from '../../components/common/Message';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import bdLocations from '../../utils/bdLocations';
import { ChevronRight, ArrowLeft, Lock, ShieldCheck, MapPin, Phone, User } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState(userInfo?.name || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [thana, setThana] = useState('Dhanmondi');
  const [address, setAddress] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errorMsg, setErrorMsg] = useState('');

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [userInfo, cartItems, navigate]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isInsideDhaka = division.toLowerCase() === 'dhaka';
  const deliveryFee = itemsPrice >= 3000 ? 0 : (isInsideDhaka ? 80 : 150);
  const totalPrice = itemsPrice + deliveryFee;

  const handleDivisionChange = (e) => {
    const newDiv = e.target.value;
    setDivision(newDiv);
    const districts = bdLocations[newDiv]?.districts || [];
    const firstDistrict = districts[0] || '';
    setDistrict(firstDistrict);
    const thanas = bdLocations[newDiv]?.thanas?.[firstDistrict] || ['Sadar'];
    setThana(thanas[0] || 'Sadar');
  };

  const handleDistrictChange = (e) => {
    const newDist = e.target.value;
    setDistrict(newDist);
    const thanas = bdLocations[division]?.thanas?.[newDist] || ['Sadar'];
    setThana(thanas[0] || 'Sadar');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !phone.trim() || !address.trim() || !division || !district || !thana) {
      return setErrorMsg('Please fill in all required shipping details');
    }

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
        shippingAddress: {
          division,
          district,
          thana,
          address,
        },
        guestInfo: {
          name: fullName,
          phone,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice: deliveryFee,
        totalPrice,
      };

      const res = await createOrder(orderData).unwrap();
      dispatch(clearCart());
      navigate(`/order-success/${res._id}`);
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="bg-surface-warm min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm">U</span>
            </div>
            <span className="font-serif font-bold tracking-wide text-neutral-dark">
              UTSAB <span className="font-light text-primary">ETHNIC</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            <Lock className="w-4 h-4" /> Secure Checkout
          </div>
        </div>
      </header>

      <div className="container-custom pt-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        {errorMsg && <div className="mb-6"><Message variant="danger">{errorMsg}</Message></div>}
        {error && <div className="mb-6"><Message variant="danger">{error.data?.message || 'Error occurred'}</Message></div>}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form Area */}
          <div className="lg:w-2/3 space-y-6">
            
            {/* Delivery Info Box */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Delivery Information
              </h2>
              
              <form id="checkout-form" onSubmit={submitHandler} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input-field pl-10"
                        required
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field pl-10"
                        required
                        placeholder="+880 1XXX-XXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Division *</label>
                    <select
                      value={division}
                      onChange={handleDivisionChange}
                      className="input-field py-3"
                      required
                    >
                      {Object.keys(bdLocations).map((div) => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">District *</label>
                    <select
                      value={district}
                      onChange={handleDistrictChange}
                      className="input-field py-3"
                      required
                    >
                      {(bdLocations[division]?.districts || []).map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Thana / Area *</label>
                    <select
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      className="input-field py-3"
                      required
                    >
                      {(bdLocations[division]?.thanas?.[district] || ['Sadar']).map((th) => (
                        <option key={th} value={th}>{th}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Detailed Street Address *</label>
                  <textarea
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="3"
                    className="input-field py-3 resize-none"
                    required
                    placeholder="House number, Road number, Block, Sector, Apartment..."
                  />
                </div>
              </form>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Payment Method
              </h2>
              
              <div className="space-y-3">
                {[
                  { id: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay with cash when your package arrives' },
                  { id: 'bKash', label: 'bKash Mobile Wallet', desc: 'Pay directly via bKash personal or merchant' },
                  { id: 'Nagad', label: 'Nagad Mobile Wallet', desc: 'Pay securely via Nagad' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-primary bg-primary-50 ring-1 ring-primary/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="mt-0.5 relative flex items-center justify-center w-5 h-5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-primary transition-all"
                      />
                      {paymentMethod === method.id && (
                        <span className="absolute w-2.5 h-2.5 bg-primary rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${paymentMethod === method.id ? 'text-primary-dark' : 'text-neutral-dark'}`}>
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 sticky top-24">
              <h3 className="font-serif text-lg font-bold mb-5">Order Summary</h3>
              
              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto hide-scrollbar pr-2">
                {cartItems.map((item) => (
                  <div key={item.variant.sku} className="flex gap-3 text-sm">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-surface-muted flex-shrink-0 border border-gray-100">
                      <img
                        src={item.image || '/images/cat-panjabi.jpg'}
                        alt={item.name}
                        onError={(e) => { e.currentTarget.src = '/images/cat-panjabi.jpg'; }}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <p className="font-medium text-neutral-dark truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.variant.size} · {item.variant.color}</p>
                      <p className="font-semibold text-primary mt-1">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 mb-4" />

              {/* Totals */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-emerald-600' : 'text-neutral-dark'}`}>
                    {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isLoading}
                className="btn-primary w-full py-4 text-sm uppercase tracking-wider relative overflow-hidden group disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">Place Order - {formatCurrency(totalPrice)}</span>
                    <div className="absolute inset-0 bg-black/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
