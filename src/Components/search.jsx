import React from 'react'
import { FiSearch } from "react-icons/fi";

const Search = ({ search, setSearch }) => {
  return (
    <div className="w-100 m-4 relative">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400">
          <FiSearch size={20} />
        </div>
        <input 
          type="text"
          placeholder="Search Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
      </div>
    </div>
  )
}

export default Search
