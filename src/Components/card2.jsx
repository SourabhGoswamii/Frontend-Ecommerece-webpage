import React from "react";

const ProductCard = ({ name, description, price, category, stock, images }) => {
  return (
    <div className="max-w-lg bg-white shadow-md rounded-lg overflow-hidden border p-4">
      {/* Product Image */}
      <img src={images} alt={name} className="w-full h-48 object-cover rounded-md" />

      {/* Product Details */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="text-gray-600 text-sm mb-2">{description}</p>

        {/* Price & Stock */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-red-600">₹{price}</span>
          {stock > 0 ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Category */}
        <span className="text-sm text-gray-500 mt-2 block">Category: {category}</span>

        {/* Add to Cart Button */}
        <button className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
