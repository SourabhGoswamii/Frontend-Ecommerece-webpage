import React, { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaMapMarkerAlt, FaEnvelope, FaPhone, FaShoppingCart, FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth")) || {};
  const token = auth?.token;
  const user = auth?.user;

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [refresh, setRefresh] = useState(false);
  
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user?._id) {
        throw new Error("User not found. Please log in again.");
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      console.log("Cart Data:", data);
      
      const cartItems = data.data?.products || [];
      const filteredCart = cartItems.filter((item) => item.product);
      setCart(filteredCart);

      const calculatedSubtotal = filteredCart.reduce(
        (acc, item) => acc + (item.product?.price || 0) * item.quantity,
        0
      );
      setSubtotal(calculatedSubtotal);
    } catch (err) {
      console.error("Error fetching cart:", err);
      // Don't set error to show to the user
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) fetchCart();
    } catch (err) {
      console.error("Error updating quantity", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: user._id }),
      });

      if (response.ok) fetchCart();
    } catch (err) {
      console.error("Error removing item", err);
    }
  };

  const placeOrder = async () => {
    try {
      
      const orderDetails = {
        username: user.name,
        user: user._id,
        products: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: user.address,
        totalAmount: subtotal,
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderDetails),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Order placement failed.");

      showNotification("Order placed successfully!");

      const checkoutResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,    
        },
      });

      if (!checkoutResponse.ok) {
        throw new Error("Failed to checkout");
      }
      setRefresh(!refresh);
      fetchCart()
      navigate("/order");
    } catch (err) {
      navigate("/order");
    }
  };
  
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/" },
    { name: "Orders", path: "/orders" },
    { name: "Cart", path: "/cart" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" }
  ];

  useEffect(() => {
    fetchCart();
  }, [refresh]);

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-slate-900/60 z-10"></div>
        <img 
          src="/cart-banner.jpg" 
          alt="Your Cart" 
          className="w-full h-48 sm:h-56 object-cover object-center"
          onError={(e) => {
            e.target.src = "/BANNER.png";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white p-4 z-20">
          <div className="max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 tracking-tight drop-shadow-lg">
              Your Shopping Cart
            </h1>
            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-slate-100 drop-shadow-md">
              Review and manage your selected items
            </p>
            <div className="flex justify-center mt-4 sm:mt-6 text-sm">
              <Link to="/" className="text-white hover:text-emerald-200 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="font-medium">Cart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-8 sm:py-12 px-4">
        <div className="container mx-auto">
          {/* Notification */}
          {notification.show && (
            <div className={`mb-6 p-4 rounded-xl ${notification.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-medium">{notification.message}</p>
            </div>
          )}

          {/* Customer Details */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block mb-6">
              Customer Details
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
            </h2>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-700"><span className="font-medium">Name:</span> {user.name}</p>
                  <p className="text-slate-700 mt-2"><span className="font-medium">Email:</span> {user.email}</p>
                </div>
                <div>
                  <p className="text-slate-700"><span className="font-medium">Shipping Address:</span></p>
                  <p className="text-slate-600 mt-1 whitespace-pre-line">{user.address || "No address provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : cart.length > 0 ? (
            <>
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block mb-6">
                  Cart Items ({cart.length})
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
                </h2>
                
                <div className="overflow-x-auto bg-slate-50 rounded-xl mb-6">
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
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {cart.map((item) => item.product && (
                        <tr key={item.product._id} className="hover:bg-slate-100 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-700">
                            <div className="flex items-center">
                              {item.product?.imageUrl && (
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name} 
                                  className="w-12 h-12 object-cover rounded-lg mr-3"
                                  onError={(e) => {
                                    e.target.src = "/placeholder-product.png";
                                    e.target.onerror = null;
                                  }}
                                />
                              )}
                              <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-xs text-slate-500">{item.product.category || ""}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                            ₹{item.product.price}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 flex items-center justify-center"
                              >
                                <FaMinus className="text-xs" />
                              </button>
                              <span className="font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center"
                              >
                                <FaPlus className="text-xs" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                            <button 
                              onClick={() => removeItem(item.product._id)}
                              className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100">
                        <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-slate-700">
                          Subtotal:
                        </td>
                        <td colSpan="2" className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-900">
                          ₹{subtotal.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="text-right">
                  <button
                    onClick={placeOrder}
                    className="px-4 sm:px-8 py-2 sm:py-3 bg-emerald-600 text-white rounded-full text-sm sm:text-base font-medium hover:bg-emerald-700 transition-all duration-300 shadow-md inline-flex items-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    Place Order
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-6">
                <FaShoppingCart className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-medium text-slate-700 mb-2">Your cart is empty</h2>
              <p className="text-slate-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
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

export default Cart;