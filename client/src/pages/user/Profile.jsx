import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../../features/users/usersApiSlice';
import { useGetMyOrdersQuery } from '../../features/orders/ordersApiSlice';
import { setCredentials, logout } from '../../features/auth/authSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { formatCurrency } from '../../utils/formatCurrency';
import { User, Package, Settings, LogOut, ChevronRight, Eye } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('settings');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: userProfile, isLoading, error } = useGetUserProfileQuery();
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
    }
  }, [userProfile]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const res = await updateProfile({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res, token: userInfo.token }));
      setMessage('');
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setMessage(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || 'Error loading profile'}</Message>;

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-dark font-medium">My Account</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-serif mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2 flex md:flex-col gap-2 md:gap-0 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition text-left flex-shrink-0 md:flex-shrink ${
              activeTab === 'settings'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 bg-white border md:border-0'
            }`}
          >
            <User className="w-5 h-5" /> Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition text-left flex-shrink-0 md:flex-shrink ${
              activeTab === 'orders'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 bg-white border md:border-0'
            }`}
          >
            <Package className="w-5 h-5" /> My Orders ({orders?.length || 0})
          </button>
          <button
            onClick={() => {
              dispatch(logout());
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 bg-white md:bg-transparent border md:border-0 rounded-lg transition text-left flex-shrink-0 md:flex-shrink"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        <div className="md:col-span-3 space-y-8">
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl p-6 border shadow-sm animate-fade-in">
              <h2 className="text-xl font-serif font-bold mb-4">Profile Settings</h2>
              
              {message && <Message variant="danger">{message}</Message>}
              {success && <Message variant="success">Profile updated successfully</Message>}
              
              <form onSubmit={submitHandler} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep unchanged"
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl p-6 border shadow-sm animate-fade-in">
              <h2 className="text-xl font-serif font-bold mb-4">Order History</h2>
              {loadingOrders ? (
                <Loader />
              ) : errorOrders ? (
                <Message variant="danger">{errorOrders?.data?.message || 'Failed to load orders'}</Message>
              ) : orders?.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <Link to="/" className="btn-primary text-xs uppercase tracking-wider">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left min-w-[500px]">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">ID</th>
                        <th className="px-4 py-3">DATE</th>
                        <th className="px-4 py-3">TOTAL</th>
                        <th className="px-4 py-3">PAID</th>
                        <th className="px-4 py-3">STATUS</th>
                        <th className="px-4 py-3 rounded-r-lg text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50/50">
                          <td className="px-4 py-4 font-mono text-xs">{order._id.substring(0, 8)}...</td>
                          <td className="px-4 py-4">{order.createdAt.substring(0, 10)}</td>
                          <td className="px-4 py-4 font-medium">{formatCurrency(order.totalPrice)}</td>
                          <td className="px-4 py-4">
                            {order.isPaid ? (
                              <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">Yes</span>
                            ) : (
                              <span className="text-red-500 bg-red-50 px-2 py-1 rounded text-xs font-medium">No</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-neutral-dark bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                              {order.orderStatus || 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Link
                              to={`/order-success/${order._id}`}
                              className="text-primary hover:text-primary-dark font-medium text-xs inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
