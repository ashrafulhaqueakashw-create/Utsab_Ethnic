import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../features/products/productsApiSlice';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { SlidersHorizontal, X, ChevronRight, Grid3X3, LayoutList, ChevronDown } from 'lucide-react';

const FABRICS = ['Cotton', 'Silk', 'Georgette', 'Endi Cotton', 'Jacquard', 'Linen', 'Velvet', 'Cotton Blend'];
const COLLECTIONS = ['New Arrival', 'Best Seller', 'Premium', 'Eid Collection', 'Winter Collection'];
const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'basePrice' },
  { label: 'Price: High to Low', value: '-basePrice' },
  { label: 'Best Rated', value: '-averageRating' },
];

const ProductList = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({ fabric: true, collection: true });

  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || '-createdAt';
  const fabric = searchParams.get('fabric') || '';
  const collection = searchParams.get('collection') || '';
  const keyword = searchParams.get('keyword') || searchParams.get('search') || '';

  const { data: categories } = useGetCategoriesQuery();
  const category = categories?.find((c) => c.slug === slug);

  const shouldSkip = !category && !keyword && slug && slug !== 'all';
  const { data, isLoading, error } = useGetProductsQuery({
    category: category?._id,
    page,
    sort,
    fabric,
    collection,
    keyword,
  }, { skip: shouldSkip });

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const categoryName = keyword
    ? `Search: "${keyword}"`
    : (category?.name || (slug && slug !== 'all' ? slug.replace('-', ' ') : 'All Products'));
  const activeFilterCount = [fabric, collection].filter(Boolean).length;

  return (
    <div>
      {/* Category Hero Banner */}
      <div className="bg-gradient-to-r from-neutral-dark to-primary-dark py-12 md:py-20">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white capitalize">{categoryName}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white capitalize">
            {categoryName}
          </h1>
          {data?.total > 0 && (
            <p className="text-white/60 text-sm mt-2">{data.total} products</p>
          )}
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden btn-ghost text-sm border border-gray-200 rounded-xl px-4 py-2.5 relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <label htmlFor="sort-products" className="sr-only">
              Sort products by
            </label>
            <select
              id="sort-products"
              aria-label="Sort products by"
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="input-field py-2.5 pr-10 text-sm w-auto"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters
                ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto animate-slide-in-left'
                : 'hidden'
            } md:block md:static md:w-56 flex-shrink-0`}
          >
            {/* Mobile Close Button */}
            <div className="flex justify-between items-center md:hidden mb-6">
              <h2 className="font-serif font-bold text-lg">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Fabric Filter */}
            <div className="mb-6">
              <button
                onClick={() => setExpandedFilters(prev => ({ ...prev, fabric: !prev.fabric }))}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold text-xs uppercase tracking-[0.15em] text-gray-500">
                  Fabric
                </h3>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedFilters.fabric ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {expandedFilters.fabric && (
                <div className="space-y-1 animate-fade-in">
                  {FABRICS.map((f) => (
                    <button
                      key={f}
                      onClick={() => updateFilter('fabric', fabric === f ? '' : f)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                        fabric === f
                          ? 'bg-primary text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-neutral-dark'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Collection Filter */}
            <div className="mb-6">
              <button
                onClick={() => setExpandedFilters(prev => ({ ...prev, collection: !prev.collection }))}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold text-xs uppercase tracking-[0.15em] text-gray-500">
                  Collection
                </h3>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedFilters.collection ? 'rotate-180' : ''}`} />
              </button>
              {expandedFilters.collection && (
                <div className="space-y-1 animate-fade-in">
                  {COLLECTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateFilter('collection', collection === c ? '' : c)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                        collection === c
                          ? 'bg-primary text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-neutral-dark'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters & Mobile Apply */}
            <div className="pt-4 border-t space-y-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={() => setSearchParams({ page: '1' })}
                  className="block w-full text-center text-sm text-primary font-medium hover:text-accent transition-colors"
                >
                  Clear All Filters
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden w-full btn-primary py-3 text-sm"
              >
                Apply Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {fabric && (
                  <button
                    onClick={() => updateFilter('fabric', '')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary text-xs rounded-full font-medium hover:bg-primary-100 transition-colors"
                  >
                    {fabric} <X className="w-3 h-3" />
                  </button>
                )}
                {collection && (
                  <button
                    onClick={() => updateFilter('collection', '')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary text-xs rounded-full font-medium hover:bg-primary-100 transition-colors"
                  >
                    {collection} <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error?.data?.message || 'Failed to load products'}</Message>
            ) : data?.products?.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-lg font-serif font-bold text-gray-700">No products found</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or browse another category</p>
              </div>
            ) : (
              <>
                <h2 className="sr-only">Product Catalog</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {data?.products?.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data?.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {[...Array(data.pages).keys()].map((x) => (
                      <button
                        key={x + 1}
                        onClick={() => updateFilter('page', String(x + 1))}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                          page === x + 1
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white border border-gray-200 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {x + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
