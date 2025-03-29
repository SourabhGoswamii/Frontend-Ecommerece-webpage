import React from "react";
import { Link } from "react-router-dom";

const Error403 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">403</h1>
      <p className="text-lg text-gray-600 mt-2">You don’t have permission to access this page.</p>
      <Link 
        to="/" 
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Error403;
