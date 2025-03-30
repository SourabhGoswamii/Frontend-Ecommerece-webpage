import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaHome, FaEnvelope, FaLock, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Loading from "../components/Loading";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: {
      street: "",
      houseNumber: "",
      wardNumber: "",
      city: "",
      district: "",
      state: "",
      pinCode: ""
    },
    phone: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle address fields separately
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create a copy of form data with properly formatted address
      const submissionData = {
        ...formData,
        // Convert the address object to a string as expected by the server
        address: JSON.stringify(formData.address)
      };

      const endpoint = `${import.meta.env.VITE_BASE_URL}/auth/signup`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
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
              <Link to="/login" className="px-3 py-1 bg-white text-blue-700 rounded-md font-medium hover:bg-gray-100 transition-all duration-300 text-sm">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-4xl mx-auto">
          <div className="md:flex">
            {/* Left side banner */}
            <div className="hidden md:block w-1/3 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
                  <p className="mb-4">Join our community of shoppers and enjoy:</p>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="mr-2 text-indigo-200">✓</div>
                      Fast and secure checkout
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 text-indigo-200">✓</div>
                      Order tracking and history
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 text-indigo-200">✓</div>
                      Special member-only offers
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 text-indigo-200">✓</div>
                      Personalized recommendations
                    </li>
                  </ul>
                </div>
                
                <div className="text-sm text-indigo-200">
                  <p>
                    Already have an account?{" "}
                    <Link to="/login" className="text-white font-medium underline hover:text-indigo-200">
                      Log In
                    </Link>
                  </p>
                  <p className="mt-2">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side form */}
            <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto max-h-screen">
              <div className="flex items-center mb-6">
                <FaUserPlus className="text-blue-600 text-2xl mr-3" />
                <h1 className="text-2xl font-bold text-gray-800">Sign Up</h1>
              </div>
              
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-3 pb-1 border-b border-gray-200">
                    Basic Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserPlus className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                    
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
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
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhoneAlt className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Address Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-3 pb-1 border-b border-gray-200 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-600" /> Address Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">House/Building No.</label>
                      <input
                        type="text"
                        name="address.houseNumber"
                        value={formData.address.houseNumber}
                        onChange={handleChange}
                        placeholder="123"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Street</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        placeholder="Main Street"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Ward No.</label>
                      <input
                        type="text"
                        name="address.wardNumber"
                        value={formData.address.wardNumber}
                        onChange={handleChange}
                        placeholder="Ward Number"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">City/Town</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="City or Town"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">PIN Code</label>
                      <input
                        type="text"
                        name="address.pinCode"
                        value={formData.address.pinCode}
                        onChange={handleChange}
                        placeholder="PIN Code"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">District</label>
                      <input
                        type="text"
                        name="address.district"
                        value={formData.address.district}
                        onChange={handleChange}
                        placeholder="District"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">State/Province</label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
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
                        Creating Account...
                      </span>
                    ) : 'Create Account'}
                  </button>
                </div>
                
                <div className="text-center mt-4 md:hidden">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                      Log In
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} DPT-PRODUCTS. All rights reserved.
              </p>
            </div>
            <div className="flex justify-start md:justify-end space-x-4 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignupPage;