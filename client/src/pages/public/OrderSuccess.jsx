import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-serif font-bold mb-3">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-2">Thank you for your order.</p>
      <p className="text-sm text-gray-400 mb-8">
        Order ID: <span className="font-mono font-medium text-neutral-dark">{id}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition">
          Continue Shopping
        </Link>
        <Link to="/track-order" className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/5 transition">
          Track Order
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
