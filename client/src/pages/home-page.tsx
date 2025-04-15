import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layouts/main-layout";
import ProductCard from "@/components/ui/product-card";
import CategoryCard from "@/components/ui/category-card";
import { Product, Category } from "@/lib/schema";

interface ProductWithCategory extends Product {
  category?: Category;
}
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Loader2,
  ShoppingBag,
  Shield,
  Truck,
  BadgePercent,
  Clock,
  Headphones,
  RefreshCcw,
  ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  // For countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  // Update countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch featured products
  const {
    data: featuredProducts = [],
    isLoading: isFeaturedLoading
  } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products/featured"],
  });

  // Fetch popular products
  const {
    data: popularProducts = [],
    isLoading: isPopularLoading
  } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products/popular"],
  });

  // Fetch categories
  const {
    data: categories = [],
    isLoading: isCategoriesLoading
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Loading state for sections
  const renderSectionLoading = () => (
    <div className="flex justify-center items-center h-64 w-full">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
        <p className="text-gray-500">Loading amazing products...</p>
      </div>
    </div>
  );

  // Timer unit component for countdown
  const TimerUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-primary text-white text-xl md:text-2xl font-bold rounded-lg w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-1">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative rounded-xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=90"
            alt="Luxury shopping experience"
            className="w-full h-[450px] md:h-[600px] object-cover"
          />
          {/* Overlay with multiple gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                {/* Animated decorative element */}
                <div className="flex items-center mb-6 animate-fade-in-slide-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                  <div className="h-px w-12 bg-amber-400 mr-4"></div>
                  <span className="text-amber-300 uppercase tracking-wider text-sm font-medium">Luxury Collection 2025</span>
                </div>

                {/* Main heading with animated reveal */}
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-slide-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                  Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Extraordinary</span> Elegance
                </h1>

                {/* Description with animated reveal */}
                <p className="text-white/90 mb-10 text-lg md:text-xl max-w-xl leading-relaxed animate-fade-in-slide-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
                  Curated collections of premium products that exemplify craftsmanship, quality, and timeless elegance. Experience luxury redefined.
                </p>

                {/* CTA buttons with animated reveal */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-slide-up opacity-0" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
                  <Link href="/category/1">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-md shadow-lg hover:shadow-amber-500/30 transition-all duration-300 text-md px-10 py-6"
                    >
                      Explore Collection
                    </Button>
                  </Link>
                  <Link href="/categories">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 hover:border-white/50 font-medium rounded-md text-md px-10 py-6"
                    >
                      View Categories
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        </div>
      </section>
      {/* We've moved animations to index.css */}

      {/* Promotional Banner */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 flex items-center shadow-md hover:shadow-lg hover:border-amber-200 transition-all duration-300 cursor-pointer">
            <div className="bg-amber-100 text-amber-800 rounded-xl p-3 mr-4">
              <Truck className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Free Premium Delivery</h3>
              <p className="text-slate-600 text-sm">On all orders over $100</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 flex items-center shadow-md hover:shadow-lg hover:border-amber-200 transition-all duration-300 cursor-pointer">
            <div className="bg-amber-100 text-amber-800 rounded-xl p-3 mr-4">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Secure Transactions</h3>
              <p className="text-slate-600 text-sm">Bank-level encryption for your safety</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 flex items-center shadow-md hover:shadow-lg hover:border-amber-200 transition-all duration-300 cursor-pointer">
            <div className="bg-amber-100 text-amber-800 rounded-xl p-3 mr-4">
              <Headphones className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">VIP Customer Service</h3>
              <p className="text-slate-600 text-sm">Personalized support anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale with Countdown */}
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-xl shadow-xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 p-8">
          <div className="absolute inset-0 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle fill="white" cx="10" cy="10" r="1"></circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)"></rect>
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center">
                  <div className="bg-amber-500 rounded-full p-2 mr-3">
                    <BadgePercent className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Exclusive Sale</h2>
                    <p className="text-amber-300 mt-1">Limited time offers on premium items</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-indigo-950/40 p-4 rounded-lg border border-indigo-700/30">
                <div className="flex gap-2">
                  <TimerUnit value={timeLeft.days} label="Days" />
                  <span className="text-2xl font-bold self-center mb-4 text-amber-300">:</span>
                  <TimerUnit value={timeLeft.hours} label="Hours" />
                  <span className="text-2xl font-bold self-center mb-4 text-amber-300">:</span>
                  <TimerUnit value={timeLeft.minutes} label="Mins" />
                  <span className="text-2xl font-bold self-center mb-4 text-amber-300">:</span>
                  <TimerUnit value={timeLeft.seconds} label="Secs" />
                </div>
              </div>
            </div>

            {isFeaturedLoading ? (
              renderSectionLoading()
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="flex justify-center mt-8">
              <Link href="/products">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                  Explore All Premium Deals <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-600 mt-1">Browse our popular categories</p>
          </div>
          <Link href="/categories" className="text-primary hover:underline text-sm font-medium flex items-center">
            All Categories <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {isCategoriesLoading ? (
          renderSectionLoading()
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Banner Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1 */}
          <div className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt="Electronics offer"
              className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md inline-block mb-2 w-fit">NEW ARRIVALS</span>
              <h3 className="text-white text-2xl font-bold mb-2">Latest Electronics</h3>
              <p className="text-white/80 mb-4">Cutting-edge technology at amazing prices</p>
              <Link href="/category/1">
                <Button className="bg-white text-primary hover:bg-primary hover:text-white transition-colors w-fit">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1505022610485-0249ba5b3675?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt="Home & Kitchen offer"
              className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md inline-block mb-2 w-fit">UP TO 40% OFF</span>
              <h3 className="text-white text-2xl font-bold mb-2">Home Decor Sale</h3>
              <p className="text-white/80 mb-4">Transform your space with stylish accessories</p>
              <Link href="/category/3">
                <Button className="bg-white text-primary hover:bg-primary hover:text-white transition-colors w-fit">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Products</h2>
            <p className="text-gray-600 mt-1">Top-rated items loved by our customers</p>
          </div>
          <Link href="/products" className="text-primary hover:underline text-sm font-medium flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {isPopularLoading ? (
          renderSectionLoading()
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 p-10 shadow-lg border border-slate-200">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">The Luxury Experience</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">We pride ourselves on delivering exceptional service and premium products to our discerning customers</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center border border-slate-100 group hover:border-amber-200">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 group-hover:bg-gradient-to-br group-hover:from-amber-100 group-hover:to-amber-200 transition-all">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Premium Delivery</h3>
              <p className="text-slate-600">White-glove delivery service with real-time tracking and precise delivery windows.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center border border-slate-100 group hover:border-amber-200">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 group-hover:bg-gradient-to-br group-hover:from-amber-100 group-hover:to-amber-200 transition-all">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Secure Transactions</h3>
              <p className="text-slate-600">Bank-level encryption and advanced fraud protection for your peace of mind.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center border border-slate-100 group hover:border-amber-200">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 group-hover:bg-gradient-to-br group-hover:from-amber-100 group-hover:to-amber-200 transition-all">
                <RefreshCcw className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Hassle-Free Returns</h3>
              <p className="text-slate-600">60-day return policy with complimentary pickup service and immediate refunds.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center border border-slate-100 group hover:border-amber-200">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 group-hover:bg-gradient-to-br group-hover:from-amber-100 group-hover:to-amber-200 transition-all">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Concierge Support</h3>
              <p className="text-slate-600">Dedicated personal shopping assistants available 24/7 for personalized service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mb-8">
        <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="p-8 md:p-12 md:w-3/5 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900">
              <div className="max-w-md">
                <span className="inline-block bg-amber-500/80 text-white text-sm uppercase tracking-wider font-semibold px-3 py-1 rounded-sm mb-6">Exclusive Access</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Join Our VIP Newsletter</h2>
                <p className="mb-8 text-white/80 leading-relaxed">
                  Be the first to know about new collections, private events, and exclusive offers.
                  Join our community of luxury shoppers and receive early access to limited edition products.
                </p>
                <form className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <input
                      type="email"
                      placeholder="Your email address"
                      required
                      className="w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800 border-0"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-md px-6 py-3 rounded-md shadow-lg hover:shadow-xl transition-all"
                  >
                    Subscribe & Get 15% Off
                  </Button>
                  <p className="text-xs text-white/60 text-center mt-2">
                    By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                  </p>
                </form>
              </div>
            </div>
            <div className="hidden md:block md:w-2/5 h-auto relative">
              <img
                src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                alt="Luxury shopping experience"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
