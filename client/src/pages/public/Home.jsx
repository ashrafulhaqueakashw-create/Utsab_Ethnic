import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../features/products/productsApiSlice';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import {
  ChevronRight, ChevronLeft, Truck, ShieldCheck, RotateCcw, Headphones, ArrowRight,
} from 'lucide-react';

/* ─── Hero Carousel Data ─── */
const HERO_SLIDES = [
  {
    image: '/images/hero-1.jpg',
    subtitle: 'Eid Collection 2026',
    title: 'Tradition Meets\nModern Elegance',
    desc: 'Discover our curated collection of premium Panjabi crafted with the finest fabrics.',
    cta: { text: 'Shop Collection', link: '/category/panjabi' },
    align: 'left',
  },
  {
    image: '/images/hero-2.jpg',
    subtitle: 'Summer Essentials',
    title: 'Comfort\nRedefined',
    desc: 'Lightweight cotton & linen panjabi for the modern man. Breathe easy, look sharp.',
    cta: { text: 'Explore Now', link: '/category/panjabi' },
    align: 'left',
  },
  {
    image: '/images/hero-3.jpg',
    subtitle: 'Wedding Specials',
    title: 'For Your Most\nMemorable Day',
    desc: 'Hand-crafted silk and velvet ensembles for the groom and his entourage.',
    cta: { text: 'Shop Premium', link: '/category/combo-set?collection=Premium' },
    align: 'left',
  },
];

/* ─── Category Data ─── */
const CATEGORIES = [
  { name: 'Panjabi', slug: 'panjabi', image: '/images/cat-panjabi.jpg' },
  { name: 'Pajama', slug: 'pajama', image: '/images/cat-pajama.jpg' },
  { name: 'Koti', slug: 'koti', image: '/images/cat-koti.jpg' },
  { name: 'Combo Sets', slug: 'combo-set', image: '/images/cat-combo.jpg' },
];

/* ─── Trust Badge Data ─── */
const TRUST_BADGES = [
  { icon: Truck, title: 'Fast Delivery', desc: 'Inside Dhaka: 2-3 days' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: 'COD & bKash/Nagad' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Call us anytime' },
];

/* ─── Horizontal Scroll Hook ─── */
const useHorizontalScroll = () => {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8;
      ref.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  return { ref, scrollLeft: () => scroll('left'), scrollRight: () => scroll('right') };
};

/* ═══════════════════════════════ COMPONENT ═══════════════════════════════ */

const Home = () => {
  const { data: newArrivals, isLoading: loadingNew, error: errorNew } =
    useGetProductsQuery({ collection: 'New Arrival', limit: 8 });
  const { data: bestSellers, isLoading: loadingBest, error: errorBest } =
    useGetProductsQuery({ collection: 'Best Seller', limit: 8 });

  const [currentSlide, setCurrentSlide] = useState(0);
  const newScroll = useHorizontalScroll();
  const bestScroll = useHorizontalScroll();

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* ─── HERO CAROUSEL ─── */}
      <section className="relative h-[65vh] md:h-[85vh] overflow-hidden bg-neutral-dark">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              currentSlide === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.subtitle}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            {/* Content */}
            <div className="relative h-full container-custom flex items-center">
              <div
                className={`max-w-xl ${
                  currentSlide === i ? 'animate-fade-in-up' : ''
                }`}
              >
                <p className="text-accent font-medium tracking-[0.2em] uppercase text-xs md:text-sm mb-3 md:mb-4">
                  {slide.subtitle}
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-4 md:mb-6 whitespace-pre-line">
                  {slide.title}
                </h1>
                <p className="text-gray-300 text-sm md:text-base mb-6 md:mb-8 max-w-md leading-relaxed">
                  {slide.desc}
                </p>
                <Link
                  to={slide.cta.link}
                  className="group inline-flex items-center gap-3 bg-white text-neutral-dark px-7 py-3.5 rounded-lg font-semibold text-sm tracking-wide uppercase hover:bg-accent hover:text-white transition-all duration-300"
                >
                  {slide.cta.text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                currentSlide === i ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center hover:bg-white/20 transition-colors text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center hover:bg-white/20 transition-colors text-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="bg-white border-b">
        <div className="container-custom py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {TRUST_BADGES.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4 p-2">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-accent font-medium tracking-[0.2em] uppercase text-xs mb-2">
              Explore Our Range
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Shop By Category</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <h3 className="text-white text-xl md:text-2xl font-serif font-bold">{cat.name}</h3>
                  <p className="text-white/70 text-sm flex items-center gap-1 mt-1 group-hover:gap-2 group-hover:text-accent transition-all duration-300">
                    Shop Now <ChevronRight className="w-4 h-4" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      <section className="section-padding bg-surface-warm">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <p className="text-accent font-medium tracking-[0.2em] uppercase text-xs mb-2">
                Just Landed
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">New Arrivals</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={newScroll.scrollLeft}
                className="hidden md:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={newScroll.scrollRight}
                className="hidden md:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <Link
                to="/category/panjabi?collection=New Arrival"
                className="text-primary text-sm font-medium hover:text-accent flex items-center gap-1 transition-colors ml-2"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {loadingNew ? (
            <Loader />
          ) : errorNew ? (
            <Message variant="danger">{errorNew?.data?.message || 'Failed to load products'}</Message>
          ) : (
            <div
              ref={newScroll.ref}
              className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2"
            >
              {newArrivals?.products?.map((product) => (
                <div key={product._id} className="w-[48%] md:w-[24%] flex-shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── PREMIUM COLLECTION BANNER ─── */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src="/images/hero-3.jpg"
          alt="Premium Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative h-full container-custom flex items-center">
          <div className="max-w-lg animate-fade-in">
            <p className="text-accent font-medium tracking-[0.2em] uppercase text-xs mb-3">
              Premium Collection
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-4">
              Wedding Specials
            </h2>
            <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
              Hand-crafted silk and velvet ensembles for your most memorable occasions.
              Elevate your celebration wardrobe.
            </p>
            <Link
              to="/category/combo-set?collection=Premium"
              className="btn-accent text-sm uppercase tracking-wider"
            >
              Shop Premium <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BEST SELLERS ─── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <p className="text-accent font-medium tracking-[0.2em] uppercase text-xs mb-2">
                Most Popular
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Best Sellers</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={bestScroll.scrollLeft}
                className="hidden md:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={bestScroll.scrollRight}
                className="hidden md:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <Link
                to="/category/panjabi?collection=Best Seller"
                className="text-primary text-sm font-medium hover:text-accent flex items-center gap-1 transition-colors ml-2"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {loadingBest ? (
            <Loader />
          ) : errorBest ? (
            <Message variant="danger">{errorBest?.data?.message || 'Failed to load products'}</Message>
          ) : (
            <div
              ref={bestScroll.ref}
              className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2"
            >
              {bestSellers?.products?.map((product) => (
                <div key={product._id} className="w-[48%] md:w-[24%] flex-shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
