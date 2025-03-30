import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FaSearch, FaAngleDown, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Orders = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const token = auth?.token;
  const user = auth?.user;

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("past 3 months");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const API_OPTIONS = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products`, API_OPTIONS);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      const productsData = data.data || data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      
    } catch (error) {
      console.error("Product Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?._id) {
        throw new Error("User not found. Please log in again.");
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/order/user/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error("Order Fetch Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/order/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      setOrders(orders.filter(order => order._id !== orderId));
      alert("Order cancelled successfully");
    } catch (err) {
      console.error("Cancel Order Error:", err);
      alert(err.message || "Could not cancel the order");
    }
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (e) {
      return dateString;
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : "Product not found";
  };

  const getProductDetails = (productId) => {
    const product = products.find(p => p._id === productId);
    return product || null;
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    
    if (filter === "past 3 months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      if (orderDate < threeMonthsAgo) return false;
    } else if (filter === "past 6 months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      if (orderDate < sixMonthsAgo) return false;
    } else if (filter === "2025") {
      if (orderDate.getFullYear() !== 2025) return false;
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      
      if (order._id.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      const hasMatchingProduct = order.products && order.products.some(item => {
        const product = getProductDetails(item.product);
        return product && product.name && product.name.toLowerCase().includes(searchLower);
      });
      
      if (!hasMatchingProduct) {
        return false;
      }
    }
    
    return true;
  });

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
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-slate-900/60 z-10"></div>
        <img 
          src="/orders-banner.jpg" 
          alt="Your Orders" 
          className="w-full h-48 sm:h-56 object-cover object-center"
          onError={(e) => {
            e.target.src = "/BANNER.png";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white p-4 z-20">
          <div className="max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 tracking-tight drop-shadow-lg">
              Your Orders
            </h1>
            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-slate-100 drop-shadow-md">
              Track and manage your purchase history
            </p>
            <div className="flex justify-center mt-4 sm:mt-6 text-sm">
              <Link to="/" className="text-white hover:text-emerald-200 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="font-medium">Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-8 sm:py-12 px-4">
        <div className="container mx-auto">
          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:max-w-md">
                <input
                  type="text"
                  placeholder="Search orders or products"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-slate-200 rounded-full p-3 w-full bg-slate-50 focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                <FaSearch className="w-5 h-5 absolute right-3 top-3.5 text-slate-400" />
              </div>
              
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="border border-slate-200 rounded-full p-3 w-full md:w-auto bg-slate-50 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="past 3 months">Past 3 months</option>
                <option value="past 6 months">Past 6 months</option>
                <option value="2025">2025</option>
                <option value="all">All orders</option>
              </select>
              
              <Link to="/" className="px-4 sm:px-8 py-2 sm:py-3 bg-emerald-600 text-white rounded-full text-sm sm:text-base font-medium hover:bg-emerald-700 transition-all duration-300 shadow-md w-full md:w-auto text-center">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md my-8">
              <p className="text-red-700 font-medium">{error}</p>
              <button 
                onClick={fetchOrders} 
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Try again
              </button>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block mb-6">
                Order History
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
              </h2>
              
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="p-5 bg-slate-50 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm">Order placed:</span>
                        <span className="font-medium text-slate-700">{formatDate(order.createdAt)}</span>
                      </div>
                      <p className="text-slate-500 text-sm mt-1">Order ID: <span className="font-mono text-emerald-600">{order._id}</span></p>
                    </div>
                    <div className="text-right sm:text-right">
                      <p className="font-semibold text-lg text-slate-800">₹{order.totalAmount.toLocaleString()}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-white border-b flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <button 
                      onClick={() => toggleOrderDetails(order._id)}
                      className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                    >
                      {expandedOrder === order._id ? "Hide details" : "View details"}
                      <FaAngleDown 
                        className={`w-4 h-4 ml-1 transform transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} 
                      />
                    </button>

                    {order.status !== "Cancelled" && order.status !== "Delivered" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="bg-red-50 text-red-700 hover:bg-red-100 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {expandedOrder === order._id && (
                    <div className="p-5 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-4 rounded-xl">
                          <h3 className="font-semibold text-slate-700 mb-2">Shipping Address</h3>
                          <p className="text-slate-600 whitespace-pre-line">{order.shippingAddress || "Not provided"}</p>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-xl">
                          <h3 className="font-semibold text-slate-700 mb-2">Order Information</h3>
                          <div className="space-y-1 text-sm">
                            <p className="text-slate-600">Username: <span className="font-medium">{order.username}</span></p>
                            <p className="text-slate-600">Created: {formatDate(order.createdAt)}</p>
                            <p className="text-slate-600">Last Updated: {formatDate(order.updatedAt)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-semibold text-slate-700 mb-3">Products</h3>
                        <div className="overflow-x-auto bg-slate-50 rounded-xl">
                          <table className="min-w-full divide-y divide-slate-200">
                            <thead>
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                  Product
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                  Quantity
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {order.products && order.products.map((item) => {
                                const productDetails = getProductDetails(item.product);
                                return (
                                  <tr key={item._id || item.product} className="hover:bg-slate-100 transition-colors">
                                    <td className="px-4 py-3 text-sm text-slate-700">
                                      <div className="flex items-center">
                                        {productDetails?.imageUrl && (
                                          <img 
                                            src={productDetails.imageUrl} 
                                            alt={productDetails?.name || "Product image"} 
                                            className="w-12 h-12 object-cover rounded-lg mr-3"
                                            onError={(e) => {
                                              e.target.src = "/placeholder-product.png";
                                              e.target.onerror = null;
                                            }}
                                          />
                                        )}
                                        <div>
                                          <p className="font-medium">
                                            {productDetails?.name || "Unknown Product"}
                                          </p>
                                          <p className="text-xs text-slate-500">
                                            {productDetails?.category || ""}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                      ₹{productDetails?.price || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                      {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                                      ₹{productDetails ? (productDetails.price * item.quantity).toLocaleString() : "N/A"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr className="bg-slate-100">
                                <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-slate-700">
                                  Order Total:
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-900">
                                  ₹{order.totalAmount.toLocaleString()}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-slate-700 mb-2">No orders found</h2>
              <p className="text-slate-500 mb-6">You haven't placed any orders yet or none match your search criteria.</p>
              <Link to="/" className="px-4 sm:px-8 py-2 sm:py-3 bg-emerald-600 text-white rounded-full text-sm sm:text-base font-medium hover:bg-emerald-700 transition-all duration-300 shadow-md inline-block">
                Continue Shopping
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

export default Orders;