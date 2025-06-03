import { Filter } from "lucide-react";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
        <Filter className="h-5 w-5 mr-2 text-primary-600" />
        News Categories
      </h2>

      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
              selectedCategory === category.id
                ? "bg-primary-100 text-primary-700 border border-primary-200"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <span className="text-lg mr-3">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          📊 Currently showing{" "}
          <strong>
            {categories.find((c) => c.id === selectedCategory)?.name}
          </strong>{" "}
          news
        </p>
      </div>
    </div>
  );
};

export default CategoryFilter;
