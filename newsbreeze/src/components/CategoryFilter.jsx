import { Filter } from "lucide-react";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-base font-semibold text-gray-900 mb-3">
        News Categories
      </h2>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-left px-2 py-1 rounded transition-colors duration-200 font-medium ${
              selectedCategory === category.id
                ? "bg-primary-100 text-primary-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
      <div className="mt-3 p-2 bg-gray-50 rounded">
        <p className="text-xs text-gray-500">
          Showing{" "}
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
