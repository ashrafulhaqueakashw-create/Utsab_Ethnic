import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../features/orders/ordersApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { formatCurrency } from '../../utils/formatCurrency';
import { Eye, ChevronRight } from 'lucide-react';

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/admin/dashboard" className="hover:text-primary">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-dark font-medium">Orders</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-serif mb-8">Manage Orders</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || 'Error loading orders'}</Message>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">USER</th>
                  <th className="px-6 py-4">DATE</th>
                  <th className="px-6 py-4">TOTAL</th>
                  <th className="px-6 py-4">PAID</th>
                  <th className="px-6 py-4">DELIVERED</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono text-xs">{order._id.substring(0, 8)}</td>
                    <td className="px-6 py-4 font-medium">{order.user?.name || order.guestInfo?.name || 'Guest'}</td>
                    <td className="px-6 py-4">{order.createdAt.substring(0, 10)}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">Yes</span>
                      ) : (
                        <span className="text-red-500 bg-red-50 px-2 py-1 rounded text-xs">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.isDelivered ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">Yes</span>
                      ) : (
                        <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded text-xs">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/order-success/${order._id}`} className="text-blue-500 hover:text-blue-700 transition inline-flex items-center gap-1">
                        <Eye className="w-4 h-4" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
