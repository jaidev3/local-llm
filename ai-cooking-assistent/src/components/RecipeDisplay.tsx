import React from "react";
import { ChefHat, Clock, Users } from "lucide-react";

interface RecipeDisplayProps {
  recipe: string;
  isGenerating: boolean;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
  recipe,
  isGenerating,
}) => {
  if (isGenerating) {
    return (
      <div className="recipe-container">
        <div className="recipe-loading">
          <div className="spinner"></div>
          <p>Generating your delicious recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  // Simple parsing to format the recipe nicely
  const formatRecipe = (recipeText: string) => {
    // Remove any instruction prefix from the model output
    const cleanedRecipe = recipeText
      .replace(/^\[INST\].*?\[\/INST\]/, "")
      .trim();

    // Split into sections
    const lines = cleanedRecipe.split("\n").filter((line) => line.trim());
    const formattedLines = lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Check if it's a title or heading
      if (
        trimmedLine.includes("Recipe") ||
        trimmedLine.includes("Dish") ||
        (index === 0 && trimmedLine.length < 50)
      ) {
        return { type: "title", content: trimmedLine };
      }

      // Check if it's a time/serving info
      if (
        trimmedLine.includes("min") ||
        trimmedLine.includes("hour") ||
        trimmedLine.includes("serves") ||
        trimmedLine.includes("serving")
      ) {
        return { type: "info", content: trimmedLine };
      }

      // Check if it's a section header
      if (
        trimmedLine.includes("Ingredients:") ||
        trimmedLine.includes("Instructions:") ||
        trimmedLine.includes("Steps:") ||
        trimmedLine.includes("Method:")
      ) {
        return { type: "header", content: trimmedLine };
      }

      // Check if it's a numbered step
      if (/^\d+\./.test(trimmedLine)) {
        return { type: "step", content: trimmedLine };
      }

      // Default to paragraph
      return { type: "paragraph", content: trimmedLine };
    });

    return formattedLines;
  };

  const formattedRecipe = formatRecipe(recipe);

  return (
    <div className="recipe-container">
      <div className="recipe-header">
        <ChefHat size={24} />
        <h2>Your AI-Generated Recipe</h2>
      </div>

      <div className="recipe-content">
        {formattedRecipe.map((line, index) => {
          switch (line.type) {
            case "title":
              return (
                <h3 key={index} className="recipe-title">
                  {line.content}
                </h3>
              );
            case "info":
              return (
                <div key={index} className="recipe-info">
                  {line.content.includes("min") ||
                  line.content.includes("hour") ? (
                    <>
                      <Clock size={16} /> {line.content}
                    </>
                  ) : (
                    <>
                      <Users size={16} /> {line.content}
                    </>
                  )}
                </div>
              );
            case "header":
              return (
                <h4 key={index} className="recipe-section-header">
                  {line.content}
                </h4>
              );
            case "step":
              return (
                <div key={index} className="recipe-step">
                  {line.content}
                </div>
              );
            default:
              return (
                <p key={index} className="recipe-paragraph">
                  {line.content}
                </p>
              );
          }
        })}
      </div>
    </div>
  );
};

export default RecipeDisplay;
