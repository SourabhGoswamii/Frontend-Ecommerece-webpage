import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../Components/search";
import { FaGithub, FaLinkedin, FaTwitter, FaEllipsisV, FaShoppingCart,  FaMapMarkerAlt,FaEnvelope,FaPhone } from 'react-icons/fa';
import Card from "../Components/Card";
import Loading from "../Components/loading.jsx"
import { useDebounce } from "react-use";

const Home = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setdebouncedsearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const auth = JSON.parse(localStorage.getItem("auth")); 
  const token = auth?.token;
  const user = auth?.user;
  const navigate = useNavigate();

  useDebounce(() => {
    setdebouncedsearch(search);
  }, 500, [search]);

  const API_OPTIONS = {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
  };

  const handleNavigation = (route) => {
    navigate(`/${route.toLowerCase()}`);
    setMenuOpen(false);
  };

  const fetchProducts = async (query = "") => {
    setError(null);
    setLoading(true);
    try {
      const endpoint = query
        ? `${import.meta.env.VITE_BASE_URL}/products/name/${encodeURIComponent(query)}`
        : `${import.meta.env.VITE_BASE_URL}/products`;

      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch products");

      const productsData = data.data || data || [];
      setProducts(Array.isArray(productsData) ? productsData.slice(0, 20) : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch]);

  const handleImageError = (e) => {
    e.target.src = "/placeholder-product.png";
    e.target.onerror = null;
  };

  const features = [
    { title: "Fast Delivery", icon: "🚚", description: "Get your products delivered to your doorstep within 24 hours" },
    { title: "Secure Payment", icon: "🔒", description: "Multiple secure payment options for your convenience" },
    { title: "Premium Quality", icon: "⭐", description: "All our products go through rigorous quality checks" }
  ];

  const testimonials = [
    { name: "Sarah J.", avatar: "👩", text: "The quality of products exceeded my expectations. Fast delivery and great customer service!" },
    { name: "Michael T.", avatar: "👨", text: "Been shopping here for years. Best prices and the new website makes shopping even easier." },
    { name: "Emma W.", avatar: "👱‍♀️", text: "Love the secure payment options and the variety of products available. Highly recommend!" }
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/" },
    { name: "Orders", path: "/orders" },
    { name: "Cart", path: "/cart" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" }
  ];

  const menuItems = [
    { title: "My Account", icon: "👤", route: "Account" },
    { title: "My Orders", icon: "📦", route: "Order" },
    { title: "Shopping Cart", icon: "🛒", route: "Cart" }
  ];

  const helpItems = [
    { title: "Contact Us", route: "contact" },
    { title: "About Us", route: "about" },
    { title: "Privacy Policy", route: "privacy" },
    { title: "Refund Policy", route: "refunds" },
    { title: "Return Policy", route: "returns" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16 md:h-20">

            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              <div className="relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)} 
                  className="p-1.5 sm:p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Menu"
                >
                  <FaEllipsisV className="text-base sm:text-lg" />
                </button>
                
                {menuOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                    <div className="py-3">
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 px-4 mb-2">Quick Access</h3>
                      {menuItems.map(item => (
                        <div 
                          key={item.route} 
                          onClick={() => handleNavigation(item.route)}
                          className="px-4 py-2.5 hover:bg-slate-50 flex items-center cursor-pointer group"
                        >
                          <span className="mr-3 text-slate-400 group-hover:text-emerald-500 transition-colors">{item.icon}</span>
                          <span className="text-slate-700 group-hover:text-slate-900">{item.title}</span>
                        </div>
                      ))}
                      
                      <div className="border-t border-slate-100 my-2"></div>
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 px-4 mb-2">Help & Information</h3>
                      {helpItems.map(item => (
                        <div 
                          key={item.route} 
                          onClick={() => handleNavigation(item.route)}
                          className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-slate-700 hover:text-slate-900"
                        >
                          {item.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
  
              <Link to="/" className="flex items-center">
                <span className="text-base sm:text-xl font-extrabold text-slate-800 hover:text-emerald-600 transition-colors truncate">
                  DPT<span className="text-emerald-600">-</span>PRODUCTS
                </span>
              </Link>
            </div>
            
            {/* Desktop Search - adjusted with min-width and properly shrinking */}
            <div className="hidden md:block flex-1 min-w-0 max-w-xl mx-2 lg:mx-8">
              <Search 
                search={search} 
                setSearch={setSearch} 
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-500 transition-all" 
              />
            </div>
  
            {/* User Actions - with reduced padding and spacing */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
              {user && token ? (
                <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                  <div className="hidden md:flex items-center">
                    <span className="text-slate-700 font-medium text-sm truncate max-w-[80px] lg:max-w-[120px]">{user.name}</span>
                  </div>
                  <Link 
                    to="/cart" 
                    className="p-1.5 sm:p-2 text-slate-700 hover:text-emerald-600 transition-colors relative"
                    aria-label="Cart"
                  >
                    <FaShoppingCart className="text-lg sm:text-xl" />
                  </Link>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("auth");
                      window.location.reload();
                    }} 
                    className="px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-100 text-slate-700 rounded-full text-xs sm:text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link 
                    to="/login" 
                    className="px-2 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="hidden sm:inline-block px-2 sm:px-4 py-1.5 sm:py-2 border border-emerald-600 text-emerald-600 rounded-full text-xs sm:text-sm font-medium hover:bg-emerald-50 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Search - with more padding control */}
        <div className="md:hidden px-2 sm:px-4 pb-3">
          <Search 
            search={search} 
            setSearch={setSearch} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-500 transition-all" 
          />
        </div>
      </nav>
      
      <main className="flex-grow">
        {/* Hero Banner (only show when not searching) */}
        {!search && (
          <div className="relative h-[50vh] sm:h-[60vh] max-h-[500px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-slate-900/60 z-10"></div>
            <img 
              src="/BANNER.png" 
              alt="Banner" 
              onError={handleImageError}
              className="w-full h-full object-cover object-center" 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 z-20">
              <div className="max-w-3xl text-center">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4 tracking-tight drop-shadow-lg">
                  Discover Premium <span className="text-emerald-300">Products</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-xl mx-auto text-slate-100 drop-shadow-md">
                  Find the best deals on our exclusive collection with unmatched quality and value
                </p>
                <button 
                  onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 sm:px-8 py-2 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm sm:text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Products Section */}
        <section className="py-8 sm:py-12 md:py-16 px-4" id="products">
          <div className="container mx-auto">
            <div className="mb-6 sm:mb-10 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block">
                {search ? "Search Results" : "Featured Collections"}
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
              </h2>
            </div>
  
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loading />
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md max-w-2xl mx-auto">
                <p>{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {products.length > 0 ? (
                  products.map(product => (
                    <div key={product._id} className="group">
                      <Card product={product} handleImageError={handleImageError} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 sm:py-16">
                    <p className="text-slate-500 text-base sm:text-lg mb-4 sm:mb-6">No products found matching your criteria.</p>
                    <button 
                      onClick={() => setSearch("")}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:bg-emerald-700 shadow-md"
                    >
                      View All Products
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Features Section (only show when not searching) */}
        {!search && products.length > 0 && (
          <>
            <section className="py-8 sm:py-12 md:py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="mb-6 sm:mb-10 text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block">
                    Why Choose Us
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-slate-50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 sm:mb-5 text-xl sm:text-2xl">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-slate-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
  
            {/* Testimonials Section */}
            <section className="py-8 sm:py-12 md:py-16 bg-slate-50">
              <div className="container mx-auto px-4">
                <div className="mb-6 sm:mb-10 text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block">
                    What Our Customers Say
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow relative">
                      <div className="text-4xl sm:text-5xl text-emerald-200 absolute top-3 left-3 sm:top-4 sm:left-4">"</div>
                      <div className="relative z-10">
                        <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 italic">{testimonial.text}</p>
                        <div className="flex items-center">
                          <div className="text-2xl sm:text-3xl text-emerald-500 mr-3">{testimonial.avatar}</div>
                          <p className="text-sm sm:text-base font-semibold text-slate-800">{testimonial.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
  
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 lg:col-span-2">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">DPT-PRODUCTS</h3>
              <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6 max-w-md">
                We provide high-quality products at competitive prices. Our mission is to ensure customer satisfaction with every purchase.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                {[FaGithub, FaLinkedin, FaTwitter].map((Icon, index) => (
                  <a 
                    key={index} 
                    href="https://www.instagram.com/dro.pshipping001?igsh=NjNqenVyazQwcDN2" 
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    <Icon className="text-base sm:text-lg" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-emerald-400">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-3">
                {quickLinks.map(link => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors hover:underline underline-offset-4"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-emerald-400">Contact Us</h3>
              <address className="not-italic text-sm sm:text-base text-slate-300 space-y-2 sm:space-y-3">
                <p className="flex items-start">
                  <FaMapMarkerAlt className="mr-2 mt-1 text-emerald-400 flex-shrink-0" />
                  <span>Plaza Chowk Ranchi Jharkhand</span>
                </p>
                <p className="flex items-start">
                  <FaEnvelope className="mr-2 mt-1 text-emerald-400 flex-shrink-0" />
                  <span>dptproducts0@gmail.com</span>
                </p>
                <p className="flex items-start">
                  <FaPhone className="mr-2 mt-1 text-emerald-400 flex-shrink-0" />
                  <span>+917544970609</span>
                </p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-6 sm:mt-10 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} DPT-PRODUCTS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;