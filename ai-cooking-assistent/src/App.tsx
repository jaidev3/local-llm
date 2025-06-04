import React, { useState, useCallback, useEffect } from "react";
import { ChefHat, Sparkles, Shield, AlertCircle } from "lucide-react";
import ImageUpload from "./components/ImageUpload";
import IngredientsList from "./components/IngredientsList";
import RecipeDisplay from "./components/RecipeDisplay";
import { aiService } from "./services/aiService";
import "./App.css";

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [apiStatus, setApiStatus] = useState<string>("");

  useEffect(() => {
    setApiStatus(aiService.getAPIStatus());
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError("");

    try {
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      // Detect ingredients using object detection
      const detectedIngredients = await aiService.detectIngredients(file);
      setIngredients(detectedIngredients);

      // Clean up URL
      URL.revokeObjectURL(imageUrl);

      if (detectedIngredients.length === 0) {
        setError(
          "No ingredients detected in the image. You can add them manually below."
        );
      }
    } catch (err) {
      console.error("Error processing image:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process image. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError("Please add some ingredients first.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Generate recipe suggestion locally
      const recipeSuggestion = aiService.generateRecipeSuggestion(ingredients);
      setRecipe(recipeSuggestion);
    } catch (err) {
      console.error("Error generating recipe:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate recipe. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setIngredients([]);
    setUploadedImage(null);
    setRecipe("");
    setError("");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <ChefHat size={32} />
          <h1>AI Cooking Assistant</h1>
        </div>
        <p>
          Upload a photo of your ingredients and get delicious recipe
          suggestions!
        </p>

        <div className="api-status">
          <div
            className={`status-indicator ${
              aiService.isTokenConfigured() ? "authenticated" : "free"
            }`}
          >
            <Shield size={16} />
            <span>{apiStatus}</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {!aiService.isTokenConfigured() && (
          <div className="token-notice">
            <AlertCircle size={20} />
            <div>
              <strong>Using Free API Tier</strong>
              <p>
                For faster processing and higher rate limits, add your Hugging
                Face token to a <code>.env.local</code> file:{" "}
                <code>VITE_HF_TOKEN=your_token</code>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <div className="workflow">
          <section className="upload-section">
            <ImageUpload
              onImageUpload={handleImageUpload}
              isProcessing={isProcessing}
            />

            {uploadedImage && (
              <div className="uploaded-image">
                <img src={uploadedImage} alt="Uploaded ingredients" />
                <p className="image-caption">
                  Image uploaded successfully! Check detected ingredients below.
                </p>
              </div>
            )}
          </section>

          <section className="ingredients-section">
            <IngredientsList
              ingredients={ingredients}
              onIngredientsChange={setIngredients}
              showWhenEmpty={!!uploadedImage}
            />

            {(ingredients.length > 0 || uploadedImage) && (
              <div className="action-buttons">
                <button
                  onClick={handleGenerateRecipe}
                  className="generate-btn"
                  disabled={isGenerating || ingredients.length === 0}
                >
                  <Sparkles size={20} />
                  {isGenerating ? "Generating..." : "Get Recipe Ideas"}
                </button>
                <button
                  onClick={handleReset}
                  className="reset-btn"
                  disabled={isProcessing || isGenerating}
                >
                  Start Over
                </button>
              </div>
            )}
          </section>

          <section className="recipe-section">
            <RecipeDisplay recipe={recipe} isGenerating={isGenerating} />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Powered by Hugging Face AI • Ingredient detection and smart recipe
          suggestions
        </p>
      </footer>
    </div>
  );
}

export default App;
