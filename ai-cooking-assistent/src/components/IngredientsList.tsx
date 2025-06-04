import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface IngredientsListProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  showWhenEmpty?: boolean;
}

const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  onIngredientsChange,
  showWhenEmpty = false,
}) => {
  const [newIngredient, setNewIngredient] = useState("");

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      onIngredientsChange([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    onIngredientsChange(
      ingredients.filter((ingredient) => ingredient !== ingredientToRemove)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  if (ingredients.length === 0 && !showWhenEmpty) {
    return null;
  }

  return (
    <div className="ingredients-container">
      <h3>
        {ingredients.length > 0
          ? "Detected Ingredients"
          : "Add Your Ingredients"}
      </h3>

      {ingredients.length > 0 && (
        <div className="ingredients-list">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-tag">
              <span>{ingredient}</span>
              <button
                onClick={() => removeIngredient(ingredient)}
                className="remove-ingredient"
                aria-label={`Remove ${ingredient}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="add-ingredient">
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            ingredients.length > 0
              ? "Add more ingredients..."
              : "Type an ingredient (e.g., tomato, chicken, rice)"
          }
          className="ingredient-input"
        />
        <button
          onClick={addIngredient}
          className="add-ingredient-btn"
          disabled={!newIngredient.trim()}
        >
          <Plus size={16} />
        </button>
      </div>

      {ingredients.length === 0 && showWhenEmpty && (
        <p className="ingredients-help">
          Start typing ingredients you have available. Common ingredients like
          vegetables, fruits, meats, grains, and spices work best for recipe
          suggestions.
        </p>
      )}
    </div>
  );
};

export default IngredientsList;
