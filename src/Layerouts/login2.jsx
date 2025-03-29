import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaHome, FaEnvelope, FaLock, FaPhoneAlt, FaSms,FaGithub,FaLinkedin,FaTwitter} from "react-icons/fa";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("email"); // "email" or "phone"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const quickLinks = [
    { name: "Home", url: "/" },
    { name: "Profile", url: "/profile" },
    { name: "Settings", url: "/settings" },
];
  const [phoneData, setPhoneData] = useState({
    phone: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // For email/password login
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // For phone/OTP login
  const handlePhoneChange = (e) => {
    setPhoneData({
      ...phoneData,
      [e.target.name]: e.target.value,
    });
  };

  // Email/Password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = `${import.meta.env.VITE_BASE_URL}/auth/signin`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      const { password, ...userWithoutPassword } = data.data.user;
      localStorage.setItem('auth', JSON.stringify({
        token: data.data.token,
        user: userWithoutPassword
      }));         
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP handler
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!phoneData.phone || phoneData.phone.length < 10) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const endpoint = `${import.meta.env.VITE_BASE_URL}/auth/send-otp`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ phone: phoneData.phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setSuccess("OTP sent successfully! Please check your phone.");
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = `${import.meta.env.VITE_BASE_URL}/auth/verify-otp`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phone: phoneData.phone,
          otp: phoneData.otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Store auth data and navigate
      localStorage.setItem('auth', JSON.stringify({
        token: data.data.token,
        user: data.data.user
      }));
      
      // Clear OTP field
      setPhoneData({
        ...phoneData,
        otp: ""
      });
      
      // Navigate to home
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation header with logo */}
      <nav className="shadow-xl bg-gradient-to-r from-blue-600 to-indigo-700 sticky top-0 z-50 transform transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
              <FaHome className="mr-2" /> DPT-PRODUCTS
            </Link>
            
            <div className="space-x-2">
              <Link to="/signup" className="px-3 py-1 bg-transparent text-white border border-white rounded-md font-medium transition-all duration-300 text-sm">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-4xl mx-auto">
          <div className="md:flex">
            {/* Left side form */}
            <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto max-h-screen">
              <div className="flex items-center mb-6">
                <FaUserCircle className="text-blue-600 text-2xl mr-3" />
                <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
              </div>
              
              <p className="text-gray-600 mb-6">Sign in to access your account and continue shopping.</p>
              
              {/* Tab Navigation */}
              <div className="flex border-b mt-2 mb-6">
                <button 
                  className={`pb-2 px-4 font-medium transition-colors duration-300 ${activeTab === 'email' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('email')}
                >
                  <FaEnvelope className="inline mr-2" />
                  Email Login
                </button>
                <button 
                  className={`pb-2 px-4 font-medium transition-colors duration-300 ${activeTab === 'phone' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                  onClick={() => {
                    setActiveTab('phone');
                    setOtpSent(false);
                    setError("");
                    setSuccess("");
                  }}
                >
                  <FaPhoneAlt className="inline mr-2" />
                  Phone Login
                </button>
              </div>
              
              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md">
                  <p className="font-medium">Success</p>
                  <p>{success}</p>
                </div>
              )}
              
              {/* Email/Password Login Form */}
              {activeTab === 'email' && (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition shadow-md ${
                        loading 
                          ? 'opacity-70 cursor-not-allowed' 
                          : 'hover:from-blue-700 hover:to-indigo-800 hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing In...
                        </span>
                      ) : 'Sign In'}
                    </button>
                  </div>
                </form>
              )}
              
              {/* Phone/OTP Login Form */}
              {activeTab === 'phone' && (
                <div className="space-y-4">
                  {/* Phone Input and Send OTP */}
                  <form onSubmit={handleSendOTP}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhoneAlt className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={phoneData.phone}
                          onChange={handlePhoneChange}
                          placeholder="+1 (555) 123-4567"
                          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                          disabled={otpSent && loading}
                        />
                      </div>
                    </div>
                    
                    {!otpSent && (
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition shadow-md ${
                          loading 
                            ? 'opacity-70 cursor-not-allowed' 
                            : 'hover:from-blue-700 hover:to-indigo-800 hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending OTP...
                          </span>
                        ) : 'Send OTP'}
                      </button>
                    )}
                  </form>
                  
                  {/* OTP Verification */}
                  {otpSent && (
                    <form onSubmit={handleVerifyOTP} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Enter OTP</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSms className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="otp"
                            value={phoneData.otp}
                            onChange={handlePhoneChange}
                            placeholder="Enter 6-digit OTP"
                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                            maxLength="6"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={loading}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          Resend OTP
                        </button>
                        
                        <button
                          type="submit"
                          disabled={loading}
                          className={`bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-md ${
                            loading 
                              ? 'opacity-70 cursor-not-allowed' 
                              : 'hover:from-blue-700 hover:to-indigo-800 hover:shadow-lg transform hover:-translate-y-0.5'
                          }`}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Verifying...
                            </span>
                          ) : 'Verify OTP'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
            
            {/* Right side banner */}
            <div className="hidden md:block w-1/3 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
                  <p className="mb-4">Log in to access your account and enjoy:</p>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="mr-2 text-indigo-200">✓</div>
                      Quick checkout process
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 text-indigo-200">✓</div>
                      Order history & tracking
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 text-indigo-200">✓</div>
                      Personalized recommendations
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 text-indigo-200">✓</div>
                      Exclusive offers & discounts
                    </li>
                  </ul>
                </div>
                
                <div className="text-sm text-indigo-200">
                  <p>
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-white font-medium underline hover:text-indigo-200">
                      Sign Up
                    </Link>
                  </p>
                  <p className="mt-2">
                    By logging in, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About DPT-PRODUCTS</h3>
              <p className="text-gray-400 mb-4">
                We provide high-quality products at competitive prices. Our mission is to ensure customer satisfaction with every purchase.
              </p>
              <div className="flex space-x-4">
                {[FaGithub, FaLinkedin, FaTwitter].map((Icon, index) => (
                  <a key={index} href="https://www.instagram.com/dro.pshipping001?igsh=NjNqenVyazQwcDN2" className="text-gray-400 hover:text-white transition-colors">
                    <Icon className="text-xl" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us at +917544970609</h3>
              <address className="not-italic text-gray-400">
                <p className="mb-2">Plaza Chowk Ranchi Jharkhand</p>
                <p className="mb-2">Email: dptproducts0@gmail.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DPT-PRODUCTS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;