import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductBySlugQuery, useGetProductsQuery } from '../../features/products/productsApiSlice';
import { addToCart } from '../../features/cart/cartSlice';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { formatCurrency } from '../../utils/formatCurrency';
import { ChevronRight, Minus, Plus, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Check } from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { data: product, isLoading, error } = useGetProductBySlugQuery(slug);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  const [added, setAdded] = useState(false);

  const { data: relatedData } = useGetProductsQuery(
    { category: product?.category?._id, limit: 4 },
    { skip: !product?.category?._id }
  );

  // Auto-select first available color and size
  useEffect(() => {
    if (product) {
      const availColors = [...new Set(product.variants?.map((v) => v.color))];
      if (availColors.length > 0 && !selectedColor) {
        setSelectedColor(availColors[0]);
      }
      const availSizes = [...new Set(product.variants?.map((v) => v.size))];
      if (availSizes.length > 0 && !selectedSize) {
        const firstInStock = availSizes.find((s) => {
          const v = product.variants?.find((varItem) => varItem.size === s && varItem.color === (selectedColor || availColors[0]));
          return v && v.stock > 0;
        });
        setSelectedSize(firstInStock || availSizes[0]);
      }
    }
  }, [product]);

  if (isLoading) return <Loader />;
  if (error) return <div className="container-custom py-16"><Message variant="danger">{error?.data?.message || 'Product not found'}</Message></div>;

  const hasDiscount = product.discountPrice && product.discountPrice < product.basePrice;
  const price = hasDiscount ? product.discountPrice : product.basePrice;
  const sizes = [...new Set(product.variants?.map((v) => v.size))];
  const colors = [...new Set(product.variants?.map((v) => v.color))];
  const selectedVariant = product.variants?.find((v) => v.size === selectedSize && v.color === selectedColor);
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor || !selectedVariant) return;
    dispatch(addToCart({
      product: product._id, name: product.name,
      image: product.images?.[0]?.url || '/images/cat-panjabi.jpg', price,
      variant: { size: selectedSize, color: selectedColor, sku: selectedVariant.sku },
      stock: selectedVariant.stock, quantity, slug: product.slug,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2)' });
    setIsZooming(true);
  };

  const relatedProducts = relatedData?.products?.filter((p) => p._id !== product._id).slice(0, 4);

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'size-chart', label: 'Size Chart' },
    { id: 'shipping', label: 'Shipping & Returns' },
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/category/${product.category?.slug}`} className="hover:text-primary capitalize transition-colors">
              {product.category?.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-dark font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12 pb-24 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface-muted cursor-crosshair relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { setIsZooming(false); setZoomStyle({}); }}
              onTouchStart={() => { setIsZooming(false); setZoomStyle({}); }}
            >
              <img
                src={product.images?.[activeImage]?.url || '/images/cat-panjabi.jpg'}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = '/images/cat-panjabi.jpg'; }}
                className="w-full h-full object-cover transition-transform duration-200"
                style={isZooming ? zoomStyle : {}}
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 badge-primary">
                  -{Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)}% OFF
                </span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                      activeImage === i ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      onError={(e) => { e.currentTarget.src = '/images/cat-panjabi.jpg'; }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-[0.15em] font-medium mb-2">{product.fabric}</p>
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-balance">{product.name}</h1>

            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= product.averageRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <span className="text-3xl font-bold text-primary">{formatCurrency(price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatCurrency(product.basePrice)}</span>
                  <span className="bg-primary-50 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    Save {Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-surface-muted text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Color Selector */}
            {colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3">Color: <span className="font-normal text-gray-500">{selectedColor || 'Select'}</span></h3>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2.5 border rounded-xl text-sm transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-primary bg-primary-50 text-primary font-medium ring-1 ring-primary/30'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3">Size: <span className="font-normal text-gray-500">{selectedSize || 'Select'}</span></h3>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => {
                    const variant = product.variants?.find((v) => v.size === size && v.color === (selectedColor || colors[0]));
                    const isOutOfStock = variant ? variant.stock === 0 : true;
                    return (
                      <button
                        key={size}
                        onClick={() => !isOutOfStock && setSelectedSize(size)}
                        disabled={isOutOfStock}
                        className={`w-14 h-11 border rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedSize === size
                            ? 'border-primary bg-primary text-white shadow-md'
                            : isOutOfStock
                            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                            : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {selectedSize && selectedColor && (
              <div className="mb-5 animate-fade-in">
                {inStock ? (
                  <p className="text-emerald-600 text-sm font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    In Stock ({selectedVariant.stock} available)
                  </p>
                ) : (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Out of Stock
                  </p>
                )}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="px-3.5 py-3 hover:bg-gray-50 transition"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="px-5 py-3 font-semibold text-sm border-x border-gray-200 min-w-[50px] text-center" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}
                  aria-label="Increase quantity"
                  className="px-3.5 py-3 hover:bg-gray-50 transition"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || !inStock}
                className={`flex-1 btn-primary py-4 text-sm uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all ${
                  added ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" aria-hidden="true" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" aria-hidden="true" /> Add to Cart
                  </>
                )}
              </button>
              <button
                aria-label="Add to wishlist"
                className="border-2 border-gray-200 p-4 rounded-xl hover:bg-gray-50 hover:border-primary hover:text-primary transition-all duration-200"
              >
                <Heart className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Delivery Promises */}
            <div className="bg-surface-muted rounded-2xl p-5 space-y-3">
              {[
                { icon: Truck, text: 'Inside Dhaka: ৳80 · Outside Dhaka: ৳150' },
                { icon: RotateCcw, text: '7-day easy returns & exchanges' },
                { icon: Shield, text: 'Cash on Delivery available nationwide' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 border-t pt-8">
          <div className="flex gap-6 border-b mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-3xl animate-fade-in">
            {activeTab === 'description' && (
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            )}
            {activeTab === 'size-chart' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-surface-muted">
                      <th className="py-3 px-4 text-left font-semibold">Size</th>
                      <th className="py-3 px-4 text-left font-semibold">Chest (in)</th>
                      <th className="py-3 px-4 text-left font-semibold">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'S/36', chest: '36', length: '40' },
                      { size: 'M/38', chest: '38', length: '41' },
                      { size: 'L/40', chest: '40', length: '42' },
                      { size: 'XL/42', chest: '42', length: '43' },
                      { size: 'XXL/44', chest: '44', length: '44' },
                    ].map((row) => (
                      <tr key={row.size} className="border-b last:border-0 hover:bg-surface-muted transition-colors">
                        <td className="py-3 px-4 font-medium">{row.size}</td>
                        <td className="py-3 px-4 text-gray-600">{row.chest}</td>
                        <td className="py-3 px-4 text-gray-600">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-neutral-dark mb-1">Delivery</h4>
                  <p>Inside Dhaka: 2-3 business days (৳80) · Outside Dhaka: 3-5 business days (৳150)</p>
                  <p className="mt-1">Free delivery on orders above ৳3,000.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-dark mb-1">Returns</h4>
                  <p>We accept returns within 7 days of delivery. Items must be unworn, unwashed, and with original tags attached.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className="mt-16 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t p-4 flex gap-3 md:hidden z-40 shadow-elevated">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider text-gray-400">Total</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(price * quantity)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || !selectedColor || !inStock}
          className={`flex-1 btn-primary py-3 text-sm uppercase tracking-wider disabled:opacity-40 transition-all ${
            added ? 'bg-emerald-600' : ''
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> Added!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
