import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  User,
  ShoppingCart,
  Package,
  Search,
  Menu,
  LogOut,
  ShoppingBag
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import CartModal from "@/components/ui/cart-modal";
import { Badge } from "@/components/ui/badge";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { totalItems, setIsCartModalOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const categories = [
    { name: "Home", path: "/" },
    { name: "Electronics", path: "/category/1" },
    { name: "Fashion", path: "/category/2" },
    { name: "Home & Decor", path: "/category/3" },
    { name: "Books", path: "/category/4" },
    { name: "Jewelry", path: "/category/5" },
    { name: "Beauty", path: "/category/6" },
    { name: "Gourmet", path: "/category/7" },
    { name: "Travel", path: "/category/8" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Top Navigation Bar */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-slate-300 to-white rounded-full blur opacity-30"></div>
                  <div className="relative">
                    <ShoppingBag className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="ml-2">
                  <span className="text-2xl font-bold text-primary">Apex<span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-white">Luxe</span></span>
                </div>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                aria-label="Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            {/* Search Bar (Medium and larger screens) */}
            <div className="hidden md:flex flex-1 mx-6">
              <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Navigation Icons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/profile" className="text-gray-700 hover:text-primary flex items-center">
                    <User className="h-5 w-5 mr-1" />
                    <span className="hidden md:inline">{user.username}</span>
                  </Link>
                  <Link href="/orders" className="text-gray-700 hover:text-primary flex items-center">
                    <Package className="h-5 w-5 mr-1" />
                    <span className="hidden md:inline">Orders</span>
                  </Link>
                  {user.isAdmin && (
                    <Link href="/admin/dashboard" className="text-gray-700 hover:text-primary flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-1" />
                      <span className="hidden md:inline">Admin</span>
                    </Link>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-gray-700 hover:text-primary p-0"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    <span className="hidden md:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Link href="/auth" className="text-gray-700 hover:text-primary flex items-center">
                  <User className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline">Login</span>
                </Link>
              )}
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="text-gray-700 hover:text-primary relative flex items-center"
              >
                <ShoppingCart className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">Cart</span>
                {totalItems > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </Badge>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-3">
              {user ? (
                <>
                  <Link href="/profile" className="block py-2 text-gray-700 hover:text-primary flex items-center">
                    <User className="h-5 w-5 mr-2" /> Profile
                  </Link>
                  <Link href="/orders" className="block py-2 text-gray-700 hover:text-primary flex items-center">
                    <Package className="h-5 w-5 mr-2" /> Orders
                  </Link>
                  {user.isAdmin && (
                    <Link href="/admin/dashboard" className="block py-2 text-gray-700 hover:text-primary flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2" /> Admin
                    </Link>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:text-primary p-0 py-2"
                  >
                    <LogOut className="h-5 w-5 mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <Link href="/auth" className="block py-2 text-gray-700 hover:text-primary flex items-center">
                  <User className="h-5 w-5 mr-2" /> Login
                </Link>
              )}
              <button
                onClick={() => {
                  setIsCartModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-gray-700 hover:text-primary flex items-center relative"
              >
                <ShoppingCart className="h-5 w-5 mr-2" /> Cart
                {totalItems > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-accent text-white">
                    {totalItems}
                  </Badge>
                )}
              </button>
            </div>
          )}

          {/* Search Bar (Mobile) */}
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-3 overflow-x-auto py-3 scrollbar-hide">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={category.path}
                  className="px-3 py-1.5 text-sm whitespace-nowrap hover:bg-gradient-to-r hover:from-slate-300 hover:to-white hover:text-gray-900 rounded-md transition-all duration-300 flex items-center"
                >
                  {category.name}
                  {index === 1 && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-slate-300 text-gray-900 rounded-sm">New</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          {/* Decorative gold line */}
          <div className="w-full max-w-xs mx-auto mb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-5">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-slate-300 to-white rounded-full blur opacity-30"></div>
                  <div className="relative">
                    <ShoppingBag className="h-7 w-7 text-slate-200" />
                  </div>
                </div>
                <span className="text-xl font-bold ml-2">Apex<span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-white">Luxe</span></span>
              </div>
              <p className="text-gray-300 mb-4">Elevating the online shopping experience with curated premium products, exceptional service, and a commitment to excellence.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Returns & Refunds</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Shipping Information</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Order Status</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Information</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="not-italic text-gray-300">
                <p className="mb-2 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  1234 Commerce St, Suite 100
                </p>
                <p className="mb-2 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (555) 123-4567
                </p>
                <p className="mb-2 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@apexcommerce.com
                </p>
              </address>
              <p className="mt-4 text-gray-300 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mon-Fri: 9am-6pm EST
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">&copy; 2023 Apex Commerce. All rights reserved.</p>
              <div className="flex space-x-4">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-8" />
                <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-8" />
                <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="American Express" className="h-8" />
                <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      <CartModal />
    </div>
  );
}
