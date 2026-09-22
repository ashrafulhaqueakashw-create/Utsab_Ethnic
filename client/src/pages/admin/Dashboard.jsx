import { useGetOrdersQuery } from '../../features/orders/ordersApiSlice';
import { useGetProductsQuery } from '../../features/products/productsApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { formatCurrency } from '../../utils/formatCurrency';
import { LayoutDashboard, Package, ShoppingCart, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetOrdersQuery();
  const { data: productsData, isLoading: loadingProducts } = useGetProductsQuery({ limit: 1 });

  if (loadingOrders || loadingProducts) return <Loader />;
  if (errorOrders) return <Message variant="danger">{errorOrders?.data?.message || 'Error loading dashboard'}</Message>;

  const totalSales = orders?.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = productsData?.total || 0;

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-dark font-medium">Admin Dashboard</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-serif mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary/10 text-primary rounded-lg">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Sales</p>
            <h3 className="text-2xl font-bold">{formatCurrency(totalSales)}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-500 rounded-lg">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold">{totalOrders}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-500 rounded-lg">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Products</p>
            <h3 className="text-2xl font-bold">{totalProducts}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-500 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Users</p>
            <h3 className="text-2xl font-bold">--</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold font-serif">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">DATE</th>
                  <th className="px-4 py-2">TOTAL</th>
                  <th className="px-4 py-2">PAID</th>
                </tr>
              </thead>
              <tbody>
                {orders?.slice(0, 5).map(order => (
                  <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs">{order._id.substring(0, 8)}...</td>
                    <td className="px-4 py-3">{order.createdAt.substring(0, 10)}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-4 py-3">
                      {order.isPaid ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">Yes</span>
                      ) : (
                        <span className="text-red-500 bg-red-50 px-2 py-1 rounded text-xs">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold font-serif mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/products" className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition text-center flex flex-col items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              <span className="font-medium">Manage Products</span>
            </Link>
            <Link to="/admin/orders" className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition text-center flex flex-col items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <span className="font-medium">Manage Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
