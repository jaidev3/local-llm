import React from "react";

const Header = ({ onRefresh }) => {
  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">NewsBreeze</h1>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-primary-600 bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
