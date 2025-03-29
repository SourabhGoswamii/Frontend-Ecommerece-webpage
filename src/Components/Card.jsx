import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const addToCart = async () => {
    try {
      setIsLoading(true);
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
        quantity: 1,
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
      setIsLoading(false);
    }
  };
  
  const placeOrder = async () => {
    try {
      setIsLoading(true);
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
        products: [{ product: product._id, quantity: 1 }],
        totalAmount: product.price,
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
      setIsLoading(false);
    }
  };

  // Calculate discount percentage if originalPrice exists
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : null;

  const handleImageError = () => {
    setImageError(true);
  };

  const viewProductDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const getImageSource = () => {
    if (imageError) {
      return "/placeholder-product.png"; // Match the placeholder from Home component
    }
    
    return product.imageUrl || "/placeholder-product.png";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Notification */}
      {notification.show && (
        <div className={`absolute top-2 right-2 left-2 z-20 py-2 px-4 rounded-md ${
          notification.type === "error" ? "bg-red-500" : "bg-green-500"
        } text-white text-sm font-medium shadow-lg transition-opacity duration-300`}>
          {notification.message}
        </div>
      )}
      
      {/* Product Image with improved handling */}
      <div className="relative">
        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            {discountPercentage}% OFF
          </div>
        )}
        <div 
          className="h-48 overflow-hidden cursor-pointer"
          onClick={viewProductDetails}
        >
          <img
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            src={getImageSource()}
            alt={product.name}
            onError={handleImageError}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div onClick={viewProductDetails} className="cursor-pointer">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.name}
          </h2>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10">{product.description}</p>
        </div>

        {/* Category & Stock with badges matching the Home component style */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.stock > 10 ? "bg-green-50 text-green-700" : 
              product.stock > 0 ? "bg-yellow-50 text-yellow-700" : 
              "bg-red-50 text-red-700"
            }`}
          >
            {product.stock > 10 ? `In Stock (${product.stock})` : 
             product.stock > 0 ? `Low Stock (${product.stock})` : 
             "Out of Stock"}
          </span>
        </div>

        {/* Price with improved styling to match Home */}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-end">
            <span className="text-xl font-bold text-gray-800">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors duration-300 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={addToCart}
            disabled={isLoading || product.stock <= 0}
          >
            <FaShoppingCart className="text-sm" />
            <span>Add to Cart</span>
          </button>
          <button
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 rounded-md transition-colors duration-300 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={placeOrder}
            disabled={isLoading || product.stock <= 0}
          >
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;