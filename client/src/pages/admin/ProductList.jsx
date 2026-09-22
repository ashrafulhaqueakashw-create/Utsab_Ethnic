import { Link } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation } from '../../features/products/productsApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { formatCurrency } from '../../utils/formatCurrency';
import { Edit, Trash2, Plus, ChevronRight } from 'lucide-react';

const ProductList = () => {
  const { data, isLoading, error, refetch } = useGetProductsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/admin/dashboard" className="hover:text-primary">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-dark font-medium">Products</span>
      </nav>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-serif">Manage Products</h1>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> Create Product
        </button>
      </div>

      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || 'Error loading products'}</Message>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">NAME</th>
                  <th className="px-6 py-4">PRICE</th>
                  <th className="px-6 py-4">CATEGORY</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.map((product) => (
                  <tr key={product._id} className="border-b last:border-0 hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono text-xs">{product._id.substring(0, 8)}</td>
                    <td className="px-6 py-4 font-medium max-w-xs truncate">{product.name}</td>
                    <td className="px-6 py-4">{formatCurrency(product.basePrice)}</td>
                    <td className="px-6 py-4">{product.category?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-blue-500 hover:text-blue-700 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

export default ProductList;
