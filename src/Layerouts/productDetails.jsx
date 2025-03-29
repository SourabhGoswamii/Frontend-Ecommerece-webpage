import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaGithub, FaLinkedin, FaTwitter, FaUserCircle, FaEllipsisV, FaArrowLeft, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import Card from "../Components/Card";
import Loading from "../Components/Loading";
import Search from "../Components/search";
import { useDebounce } from "react-use";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const auth = (() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      return storedAuth ? JSON.parse(storedAuth) : null;
    } catch (error) {
      console.error("Error parsing auth data:", error);
      return null;
    }
  })();
  
  const token = auth?.token;
  const user = auth?.user;

  useDebounce(() => {
    setDebouncedSearch(search);
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

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (debouncedSearch) {
      navigate(`/?search=${encodeURIComponent(debouncedSearch)}`);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${id}`, API_OPTIONS);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch product details");
      }

      setProduct(data.data || data);

      if (data.data?.category) {
        fetchRelatedProducts(data.data.category);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/category/${category}`,
        API_OPTIONS
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch related products");
      }

      // Filter out the current product and limit to 4 items
      const filteredProducts = (data.data || [])
        .filter(item => item._id !== id)
        .slice(0, 4);
      
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Related products fetch error:", error);
    }
  };

  const addToCart = async () => {
    try {
      setLoading(true);
      const auth = localStorage.getItem("auth");
      if (!auth) {
        navigate("/login");
        return;
      }
  
      const { token, user } = JSON.parse(auth);
      if (!user || !user._id) throw new Error("Invalid user data.");
  
      const endpoint = `${import.meta.env.VITE_BASE_URL}/cart/add`;
      const bodyData = {
        user: user._id,
        productId: product._id,
        quantity: quantity,
      };
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }
  
      showNotification("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      showNotification(error.message || "Failed to add to cart", "error");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      const auth = localStorage.getItem("auth");
      if (!auth) {
        navigate("/login");
        return;
      }

      const { token, user } = JSON.parse(auth);
      if (!user || !user._id) throw new Error("Invalid user data.");

      const orderData = {
        user: user._id,
        username: user.name,
        products: [{ product: product._id, quantity: quantity }],
        totalAmount: product.price * quantity,
        status: "Pending",
        shippingAddress: user.address || "Default Address", // Fallback if no address
      };
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      showNotification("Order placed successfully!");
      setTimeout(() => navigate("/order"), 1500);
    } catch (error) {
      console.error("Order Error:", error.message);
      showNotification(error.message || "Could not place the order", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = "/placeholder-product.png";
    e.target.onerror = null;
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      setQuantity(1);
    }
  }, [id]);

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

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/" },
    { name: "Orders", path: "/orders" },
    { name: "Cart", path: "/cart" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Modern Navbar with fixed search box */}
      <nav className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo and Menu - reduced min-width */}
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
                onSubmit={handleSearchSubmit}
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
            onSubmit={handleSearchSubmit}
            className="w-full bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-500 transition-all" 
          />
        </div>
      </nav>
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Products
            </button>
          </div>
          
          {/* Notification */}
          {notification.show && (
            <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
            } transition-opacity duration-300 opacity-90`}>
              <p>{notification.message}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
              <p>{error}</p>
            </div>
          ) : product ? (
            <div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Image */}
                  <div className="flex justify-center items-center bg-slate-50 p-8">
                    <img 
                      src={product.imageUrl || product.images || "/placeholder-product.png"} 
                      alt={product.name}
                      className="max-h-80 object-contain transition-all duration-300 hover:scale-105" 
                      onError={handleImageError}
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-2xl font-bold text-emerald-600">
                        ₹{parseFloat(product.price).toFixed(2)}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                    
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Category</h3>
                      <p className="text-slate-700">{product.category}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Description</h3>
                      <p className="text-slate-600 whitespace-pre-line">{product.description}</p>
                    </div>
                    
                    {product.stock > 0 && (
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center mb-6">
                          <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 mr-3">Quantity</span>
                            <div className="flex border border-slate-200 rounded-lg">
                              <button 
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="px-3 py-1 text-slate-600 hover:bg-slate-50 transition-colors rounded-l-lg"
                                disabled={quantity <= 1}
                              >
                                -
                              </button>
                              <div className="px-4 py-1 border-x border-slate-200 min-w-[40px] text-center text-slate-800">
                                {quantity}
                              </div>
                              <button 
                                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                                className="px-3 py-1 text-slate-600 hover:bg-slate-50 transition-colors rounded-r-lg"
                                disabled={quantity >= product.stock}
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs text-slate-500 ml-3">
                              {product.stock} available
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <button 
                            onClick={addToCart}
                            disabled={product.stock <= 0}
                            className="px-6 py-3 bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-full font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <FaShoppingCart />
                            <span>Add to Cart</span>
                          </button>
                          
                          <button 
                            onClick={placeOrder}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Specifications section */}
              <div className="bg-white rounded-xl shadow-md p-6 my-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 relative inline-block">
                  Specifications
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Category</span>
                    <p className="font-medium text-slate-800">{product.category}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Stock</span>
                    <p className="font-medium text-slate-800">{product.stock || 0} units</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg md:col-span-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Product ID</span>
                    <p className="font-medium text-slate-800 break-all">{product._id}</p>
                  </div>
                </div>
              </div>
              
              {/* Related Products Section */}
              {relatedProducts.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 my-8">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 relative inline-block">
                    You May Also Like
                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {relatedProducts.map(relatedProduct => (
                      <div key={relatedProduct._id} className="group transform transition-transform duration-300 hover:-translate-y-1">
                        <Card product={relatedProduct} handleImageError={handleImageError} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg mb-6">Product not found.</p>
              <Link 
                to="/"
                className="px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors inline-block"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
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
                    href="#" 
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

export default ProductDetail;