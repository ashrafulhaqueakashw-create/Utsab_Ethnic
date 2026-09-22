import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const [isWished, setIsWished] = useState(false);

  const hasDiscount = product.discountPrice && product.discountPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)
    : 0;

  const fallbackImage = '/images/cat-panjabi.jpg';
  const primaryImage = product.images?.[0]?.url || fallbackImage;
  const secondaryImage = product.images?.[1]?.url || null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const variant = product.variants?.find((v) => v.stock > 0) || product.variants?.[0];
    if (variant) {
      dispatch(addToCart({
        product: product._id,
        name: product.name,
        image: primaryImage,
        price: hasDiscount ? product.discountPrice : product.basePrice,
        variant: { size: variant.size, color: variant.color, sku: variant.sku },
        stock: variant.stock,
        quantity: 1,
        slug: product.slug,
      }));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsWished(!isWished);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="product-card group block"
    >
      {/* Image Container */}
      <div className="product-card-image">
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = fallbackImage; }}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
          }`}
        />
        {/* Secondary Image (hover swap) */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="badge-primary text-[10px]">
              -{discountPercent}%
            </span>
          )}
          {product.collections?.includes('New Arrival') && (
            <span className="badge-dark text-[10px]">
              NEW
            </span>
          )}
          {product.collections?.includes('Best Seller') && (
            <span className="badge-accent text-[10px]">
              HOT
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center
                       transition-all duration-300 shadow-sm ${
                         isWished
                           ? 'bg-red-50 text-red-500 opacity-100'
                           : 'bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white'
                       }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500' : ''}`} />
          </button>
        </div>

        {/* Bottom Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider rounded-lg
                       transition-all duration-300 flex items-center justify-center gap-2 ${
                         added
                           ? 'bg-emerald-600 opacity-100 translate-y-0'
                           : 'bg-neutral-dark/90 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 hover:bg-primary'
                       }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-medium mb-1.5">
          {product.fabric}
        </p>
        <h3 className="font-sans text-sm font-medium text-neutral-dark leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-base">
            {formatCurrency(hasDiscount ? product.discountPrice : product.basePrice)}
          </span>
          {hasDiscount && (
            <span className="text-gray-400 text-xs line-through">
              {formatCurrency(product.basePrice)}
            </span>
          )}
        </div>
        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xs ${star <= Math.round(product.averageRating) ? 'text-amber-400' : 'text-gray-200'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({product.numReviews})</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
