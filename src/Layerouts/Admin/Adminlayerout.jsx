import React, { useState, useEffect } from 'react';
import { FaHome, FaBox, FaUsers, FaCog, FaBars, FaSearch, FaUserCircle, FaCloudUploadAlt } from 'react-icons/fa';
import Loading from "../../Components/Loading";
import {Link} from "react-router-dom"

const AdminLayout = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState("Dashboard");
  const [updateOrder, setupdateOrder] = useState("");
  const auth = JSON.parse(localStorage.getItem("auth")); 
  const token = auth?.token;
  const user = auth?.user;


  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  
  // New state for image file and preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSelectItem = (item) => {
    setSelected(item);
  };

  const handleInitiateUpdate = async () => {
    try {
      const auth = localStorage.getItem("auth");
      if (!auth) throw new Error("User not logged in.");

      const { token, user: storedUser } = JSON.parse(auth);

      const updatedFields = {};
      Object.keys(user).forEach((key) => {
        if (user[key] !== storedUser[key]) {
          updatedFields[key] = user[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        alert("No changes detected.");
        return;
      }

      // In a real app, this would make an API call to send an OTP to the user's email or phone
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowOtpVerification(true);
      }, 1500);
    } catch (error) {
      console.error("Update Initiation Error:", error.message);
      alert(error.message || "Could not initiate profile update.");
    }
  };


  const handleAddProductClick = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      stock: product.stock || product.countInStock || '',
    });
    // Set image preview if the product has an image
    setImagePreview(product.imageUrl || product.images);
    setImageFile(null); // Reset image file since we're only showing preview from existing URL
    setShowProductForm(true);
  };

  // Function to handle form input changes
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: value
    });
  };

  // Function to handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
  };

  // Function to handle form submission
  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData instance for multipart/form-data submission
      const formData = new FormData();
      formData.append('name', productFormData.name);
      formData.append('description', productFormData.description);
      formData.append('price', productFormData.price);
      formData.append('category', productFormData.category);
      formData.append('stock', productFormData.stock);

      // Append image file if one was selected
      if (imageFile) {
        formData.append('productImage', imageFile);
      }

      if (editingProduct) {
        // Update existing product
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${editingProduct._id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData // Send as FormData instead of JSON
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update product");
        }

        alert("Product updated successfully");
      } else {
        // Add new product
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData // Send as FormData instead of JSON
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add product");
        }

        alert("Product added successfully");
      }

      setShowProductForm(false);
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error("Product submission error:", error);
      setError(error.message || "Something went wrong");
      alert(error.message || "Error processing your request");
    } finally {
      setLoading(false);
    }
  };

  const Sidebar = () => {
    return (
      <div className="bg-white w-64 h-screen shadow-lg p-5 flex flex-col fixed">
        <h2 className="text-xl font-bold text-green-600 mb-5">DPT Admin</h2>
        <ul className="space-y-4">
          <li 
            className={`flex items-center space-x-3 p-2 ${selected === "Dashboard" ? "bg-green-100" : "hover:bg-gray-200"} rounded cursor-pointer`} 
            onClick={() => handleSelectItem("Dashboard")}
          >
            <FaHome /> <span>Dashboard</span>
          </li>
          <li 
            className={`flex items-center space-x-3 p-2 ${selected === "Products" ? "bg-green-100" : "hover:bg-gray-200"} rounded cursor-pointer`} 
            onClick={() => handleSelectItem("Products")}
          >
            <FaBox /> <span>Products</span>
          </li>
          <li 
            className={`flex items-center space-x-3 p-2 ${selected === "Customers" ? "bg-green-100" : "hover:bg-gray-200"} rounded cursor-pointer`} 
            onClick={() => handleSelectItem("Orders")}
          >
            <FaUsers /> <span>Orders</span>
          </li>
          <li 
            className={`flex items-center space-x-3 p-2 ${selected === "Setting" ? "bg-green-100" : "hover:bg-gray-200"} rounded cursor-pointer`} 
            onClick={() => handleSelectItem("Setting")}
          >
            <FaCog /> <span>Edit Profile</span>
          </li>
          
        </ul>
      </div>
    );
  };

  
const Navbar = () => {
  return (
    <div className="bg-white h-16 shadow-md flex items-center justify-between px-6 fixed w-full top-0 left-0 ml-64 z-10 pr-80">
      
      {/* Left Section - Back to Home Button */}
      <div>
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium w-full md:w-auto text-center"
        >
          Back to Home
        </Link>
      </div>

      {/* Right Section - Date & User Info */}
      <div className="flex items-center space-x-6 pl-10">
        {/* Current Date */}
        <span className="text-gray-700 text-sm font-medium">
          {new Date().toLocaleDateString()}
        </span>

        {/* User Info */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 text-sm font-medium">
            {user?.name || "Admin"}
          </span>
          <FaUserCircle className="text-gray-600 text-2xl cursor-pointer" />
        </div>
      </div>
      
    </div>
  );
};

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_OPTIONS = {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      };
      
      const endpoint = `${import.meta.env.VITE_BASE_URL}/products`;
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      const productsData = data.data || data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Error fetching products");
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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      console.error("Users Fetch Error:", err);
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

  const handleUpdateStatus = async (orderId) => {
    try {
      const updateOrder2 = {
        status: updateOrder,
      }
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          
        },body: JSON.stringify(updateOrder2),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      setOrders(orders.filter(order => order._id !== orderId));
      alert("Order Update successfully");
      setupdateOrder("");
    } catch (err) {
      console.error("Cancel Update Error:", err);
      alert(err.message || "Could not Update the order");
    }
  }

  const handelDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      alert("Product deleted successfully");
      fetchProducts(); // Refresh the products list
    } catch (err) {
      console.error("Delete Product Error:", err);
      alert(err.message || "Could not Delete the product");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, [selected, updateOrder]);


  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-red-100 p-4 rounded-md text-red-700 border border-red-300">
          <p className="font-medium">{error}</p>
        </div>
      );
    }
  
    switch (selected) {
      case "Dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Total Products</h3>
              <p className="text-3xl font-bold text-green-600">{products?.length || 0}</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-600">{orders?.length || 0}</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-purple-600">{users?.length || 0}</p>
            </div>
            
          </div>
        );
        case "Products":
          return (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Products Management</h2>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2" 
                  onClick={handleAddProductClick}
                >
                  <span>Add New Product</span>
                </button>
              </div>
  
              {/* Product Form Modal */}
              {showProductForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                      <button 
                        onClick={() => setShowProductForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <form onSubmit={handleProductFormSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                          <input
                            type="text"
                            name="name"
                            value={productFormData.name}
                            onChange={handleProductInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                          <input
                            type="number"
                            name="price"
                            value={productFormData.price}
                            onChange={handleProductInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <input
                            type="text"
                            name="category"
                            value={productFormData.category}
                            onChange={handleProductInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                          <input
                            type="number"
                            name="stock"
                            value={productFormData.stock}
                            onChange={handleProductInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                          {imagePreview ? (
                            <div className="relative">
                              <img 
                                src={imagePreview} 
                                alt="Product preview" 
                                className="h-48 object-contain mx-auto mb-4" 
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImageFile(null);
                                  setImagePreview(null);
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                                title="Remove image"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-600">
                                Click or drag and drop to upload image
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </div>
                          )}
                          
                          <input
                            type="file"
                            name="productImage"
                            id="productImage"
                            onChange={handleImageChange}
                            accept="image/*"
                            className={imagePreview ? "sr-only" : "mt-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"}
                          />
                          
                          {imagePreview && (
                            <button
                              type="button"
                              onClick={() => document.getElementById('productImage').click()}
                              className="mt-3 px-3 py-1.5 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition-colors"
                            >
                              Change Image
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          value={productFormData.description}
                          onChange={handleProductInputChange}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowProductForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
  
              {products?.length > 0 ? (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product, index) => (
                        <tr key={product._id || index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._id?.slice(-4) || index}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                              <img
                                src={product.imageUrl || product.images || '/placeholder-product.png'}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => e.target.src = '/placeholder-product.png'}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(product.price).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock || product.countInStock || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors" 
                              onClick={() => handleEditProduct(product)}
                            >
                              Edit
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 transition-colors" 
                              onClick={() => handelDeleteProduct(product._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No products available.</p>
              )}
            </div>
          );
        case "Orders":
          return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Orders Management</h2>
              {orders?.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order, index) => (
                        <tr key={order._id || index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order._id?.slice(-4) || index}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {users.find(u => u._id === order?.user)?.name || 'Unknown'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {order?.shippingAddress || 'No address provided'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {Array.isArray(order?.products) && order.products.length > 0 ? (
                              order.products.map((item, idx) => {
                                const productId = typeof item.product === 'object' ? item.product._id : item.product;
                                const productDetails = products.find(p => p._id === productId);
        
                                return (
                                  <div key={idx} className="mb-1">
                                    {productDetails?.name || `Product: ${productId?.slice(-6) || 'Unknown'}`}
                                    {item?.quantity ? ` × ${item.quantity}` : ''}
                                  </div>
                                );
                              })
                            ) : (
                              'No products'
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${(order?.totalAmount || 0).toFixed(2)}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              order?.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                              order?.status === 'Shipped' ? 'bg-blue-200 text-blue-800' :
                              order?.status === 'Cancelled' ? 'bg-red-200 text-red-800' :
                              'bg-yellow-200 text-yellow-800'
                            }`}>
                              {order?.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <select 
                                value={updateOrder || order?.status}
                                onChange={(e) => setupdateOrder(e.target.value)}
                                className="px-2 py-1 border rounded text-sm"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              <button 
                                onClick={() => handleUpdateStatus(order?._id)}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                              >
                                Update
                              </button>
                              <button 
                                                                onClick={() => handleCancelOrder(order?._id)}
                                                                className={`px-3 py-1 ${order?.status === 'Cancelled' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 transition-colors'} text-white rounded text-sm`}
                                                                disabled={order?.status === 'Cancelled'}
                                                              >
                                                                Cancel
                                                              </button>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      ))}
                                                    </tbody>
                                                  </table>
                                                </div>
                                              ) : (
                                                <p className="text-gray-500">No orders available.</p>
                                              )}
                                            </div>
                                          );
                                      case "Setting":
                                        return (
                                          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                                            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                                            <form>
                                              <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                                  Name
                                                </label>
                                                <input
                                                  className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  id="name"
                                                  type="text"
                                                  placeholder="Name"
                                                  defaultValue={user?.name || ""}
                                                />
                                              </div>
                                              <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                                  Email
                                                </label>
                                                <input
                                                  className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  id="email"
                                                  type="email"
                                                  placeholder="Email"
                                                  defaultValue={user?.email || ""}
                                                />
                                              </div>
                                              <div className="mb-6">
                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                                  New Password
                                                </label>
                                                <input
                                                  className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  id="password"
                                                  type="password"
                                                  placeholder="Leave blank to keep current password"
                                                />
                                              </div>
                                              <div className="flex items-center justify-end">
                                                <button
                                                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                  type="button" onClick={handleInitiateUpdate}
                                                >
                                                  Update Profile
                                                </button>
                                              </div>
                                            </form>
                                          </div>
                                        );
                                      default:
                                        return (
                                          <div className="text-center p-10">
                                            <h2 className="text-2xl font-bold text-gray-700">Select an option from the sidebar</h2>
                                            <p className="text-gray-500 mt-2">Choose a section from the navigation menu to get started</p>
                                          </div>
                                        );
                                    }
                                  };
                                  
                                  return (
                                    <div className="flex bg-gray-100 min-h-screen">
                                      <Sidebar />
                                      <div className="ml-64 w-full">
                                        <Navbar />
                                        <div className="p-6 mt-16">
                                          {renderContent()}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                };
                                
                                export default AdminLayout; 