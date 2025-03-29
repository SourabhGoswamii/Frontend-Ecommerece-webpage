import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", role: "", address: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/login");
      return;
    }
    const { user } = JSON.parse(auth);
    setUser({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      address: user.address || "",
      phone: user.phone || "",
    });
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow one character per input
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input after entering a digit
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
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
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowOtpVerification(true);
      }, 1500);
    } catch (error) {
      console.error("Update Initiation Error:", error.message);
      alert(error.message || "Could not initiate profile update.");
    }
  };

  const verifyOtp = () => {
    setIsLoading(true);
    const otpValue = otp.join("");
    
    // Simulate OTP verification - in a real app, this would be validated by your backend
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes: use "123456" as the valid OTP
      if (otpValue === "123456") {
        completeUpdate();
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    }, 1500);
  };

  const completeUpdate = async () => {
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

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${storedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed.");

      // Update local storage with new user data
      localStorage.setItem("auth", JSON.stringify({ token, user: data.data }));
      setUser(data.data);
      setShowOtpVerification(false);
      setIsEditing(false);
      setOtp(["", "", "", "", "", ""]);
      
      // Show success message
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update Error:", error.message);
      alert(error.message || "Could not update profile.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible!")) return;

    try {
      const auth = localStorage.getItem("auth");
      if (!auth) throw new Error("User not logged in.");

      const { token, user } = JSON.parse(auth);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed.");

      alert("Account deleted successfully!");
      localStorage.removeItem("auth");
      navigate("/signup");
    } catch (error) {
      console.error("Delete Error:", error.message);
      alert(error.message || "Could not delete account.");
    }
  };

  // Render OTP verification overlay
  const renderOtpVerification = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h3 className="text-xl font-bold text-center mb-4">Verify Your Identity</h3>
          <p className="text-gray-600 mb-6 text-center">
            We've sent a 6-digit verification code to your email. 
            Please enter it below to confirm your profile update.
          </p>
          
          <div className="flex justify-center space-x-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center text-xl font-bold border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
              />
            ))}
          </div>
          
          {otpError && <p className="text-red-500 text-center mb-4">{otpError}</p>}
          
          <div className="flex flex-col space-y-3">
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all disabled:bg-blue-300"
              onClick={verifyOtp}
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Update"}
            </button>
            <button
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-all"
              onClick={() => {
                setShowOtpVerification(false);
                setOtp(["", "", "", "", "", ""]);
                setOtpError("");
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Didn't receive a code? <button className="text-blue-500 hover:text-blue-700">Resend code</button>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white shadow-xl rounded-xl border">
      {showOtpVerification && renderOtpVerification()}
      
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Account Details</h2>
        <button
          className={`px-4 py-2 rounded-lg transition-all ${
            isEditing 
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg ${
                isEditing ? "border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500" : "bg-gray-50 cursor-not-allowed"
              }`}
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              readOnly={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className={`w-full p-3 border rounded-lg ${
                isEditing ? "border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500" : "bg-gray-50 cursor-not-allowed"
              }`}
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg bg-gray-50 cursor-not-allowed"
            value={user.role}
            disabled
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg ${
                isEditing ? "border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500" : "bg-gray-50 cursor-not-allowed"
              }`}
              placeholder="Enter your address"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              readOnly={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg ${
                isEditing ? "border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500" : "bg-gray-50 cursor-not-allowed"
              }`}
              placeholder="Enter your phone number"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4 pt-4">
          {isEditing ? (
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all disabled:bg-blue-300"
              onClick={handleInitiateUpdate}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Update Profile"}
            </button>
          ) : (
            <button
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all"
              onClick={handleDelete}
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;