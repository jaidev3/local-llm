interface HuggingFaceResponse {
  error?: string;
  estimated_time?: number;
  [key: string]: any;
}

class AIService {
  private readonly HF_API_URL = "https://api-inference.huggingface.co/models";
  private readonly HF_TOKEN = import.meta.env.VITE_HF_TOKEN || "";

  private async callHuggingFaceAPI(
    modelName: string,
    inputs: any,
    options: any = {}
  ): Promise<any> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token is available
    if (this.HF_TOKEN) {
      headers["Authorization"] = `Bearer ${this.HF_TOKEN}`;
      console.log("Using authenticated Hugging Face API with token");
    } else {
      console.log("Using free Hugging Face API (rate limited)");
    }

    const response = await fetch(`${this.HF_API_URL}/${modelName}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        inputs,
        options,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          "Rate limit exceeded. Please add a Hugging Face token or try again later."
        );
      } else if (response.status === 401) {
        throw new Error("Invalid Hugging Face token. Please check your token.");
      } else if (response.status === 503) {
        throw new Error(
          "Model is currently loading. Please wait a moment and try again."
        );
      } else if (response.status === 404) {
        throw new Error(
          "Model not found or unavailable. Please try again later."
        );
      }
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();

    if (result.error) {
      if (result.error.includes("loading")) {
        throw new Error(
          `Model is loading. Estimated time: ${
            result.estimated_time || "unknown"
          } seconds. Please try again in a moment.`
        );
      }
      throw new Error(result.error);
    }

    return result;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data:image/[type];base64, prefix
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async detectIngredients(imageFile: File): Promise<string[]> {
    try {
      console.log("Detecting ingredients in image...");
      const base64Image = await this.fileToBase64(imageFile);

      const result = await this.callHuggingFaceAPI(
        "facebook/detr-resnet-50",
        base64Image
      );

      // Extract unique ingredient names from detected objects
      const ingredients = result
        .filter((detection: any) => detection.score > 0.2) // Lower threshold for better detection
        .map((detection: any) => detection.label)
        .filter((label: string) => this.isIngredient(label))
        .filter(
          (value: string, index: number, self: string[]) =>
            self.indexOf(value) === index
        ); // Remove duplicates

      console.log("Detected ingredients:", ingredients);
      return ingredients;
    } catch (error) {
      console.error("Error detecting ingredients:", error);
      throw new Error(
        `Failed to detect ingredients: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  generateRecipeSuggestion(ingredients: string[]): string {
    if (ingredients.length === 0) return "";

    // Simple recipe suggestions based on ingredients
    const recipes = this.getRecipeSuggestions(ingredients);

    if (recipes.length === 0) {
      return `Here are some cooking ideas with ${ingredients.join(", ")}:

🍳 **Quick Stir-Fry**
- Heat oil in a pan
- Add your ingredients in order of cooking time (hardest first)
- Season with salt, pepper, and your favorite spices
- Cook until tender and serve hot

🥗 **Fresh Salad**
- Combine raw ingredients that work well together
- Add a simple dressing (olive oil, vinegar, salt)
- Toss and serve immediately

🍲 **Simple Soup**
- Sauté aromatics (onions, garlic if available)
- Add ingredients with liquid (broth or water)
- Simmer until everything is tender
- Season to taste

💡 **Tips:**
- Taste as you cook and adjust seasoning
- Cook harder vegetables longer than softer ones
- Don't be afraid to experiment with flavors!`;
    }

    return recipes[0];
  }

  private getRecipeSuggestions(ingredients: string[]): string[] {
    const suggestions: string[] = [];
    const ingredientSet = new Set(ingredients.map((i) => i.toLowerCase()));

    // Pasta dishes
    if (ingredientSet.has("pasta") || ingredientSet.has("spaghetti")) {
      if (ingredientSet.has("tomato") || ingredientSet.has("cheese")) {
        suggestions.push(`🍝 **Classic Pasta**
*Prep: 10 min | Cook: 15 min | Serves: 2-3*

**Ingredients:**
- ${ingredients.join(", ")}
- Salt, pepper, olive oil
- Garlic (if available)

**Instructions:**
1. Boil water in a large pot with salt
2. Cook pasta according to package directions
3. Meanwhile, heat olive oil in a pan
4. Add minced garlic (if available) and cook 1 minute
5. Add tomatoes and cook until soft
6. Drain pasta, reserving 1/2 cup pasta water
7. Toss pasta with sauce, adding pasta water if needed
8. Top with cheese and serve immediately

**Tips:**
- Save some pasta water - it helps bind the sauce
- Don't overcook the pasta - it should be al dente`);
      }
    }

    // Egg dishes
    if (ingredientSet.has("egg")) {
      suggestions.push(`🍳 **Delicious Scrambled Eggs**
*Prep: 5 min | Cook: 5 min | Serves: 1-2*

**Ingredients:**
- ${ingredients.join(", ")}
- Salt, pepper, butter

**Instructions:**
1. Crack eggs into a bowl and whisk with salt and pepper
2. Heat butter in a non-stick pan over medium-low heat
3. Add eggs and let sit for 20 seconds
4. Gently stir with a spatula, pushing eggs from edges to center
5. Add any vegetables in the last minute of cooking
6. Remove from heat when eggs are still slightly wet
7. Serve immediately

**Tips:**
- Low heat is key for creamy eggs
- Keep stirring gently for best texture`);
    }

    // Salad
    if (
      ingredientSet.has("lettuce") ||
      ingredientSet.has("spinach") ||
      ingredientSet.has("tomato")
    ) {
      suggestions.push(`🥗 **Fresh Garden Salad**
*Prep: 10 min | Serves: 2-3*

**Ingredients:**
- ${ingredients.join(", ")}
- Olive oil, vinegar, salt, pepper

**Instructions:**
1. Wash and dry all vegetables thoroughly
2. Chop vegetables into bite-sized pieces
3. Arrange in a large bowl
4. Make dressing: 3 parts olive oil to 1 part vinegar
5. Add salt and pepper to dressing and whisk
6. Drizzle dressing over salad just before serving
7. Toss gently and enjoy

**Tips:**
- Dry vegetables well to prevent watery salad
- Add dressing just before eating`);
    }

    // Rice dishes
    if (ingredientSet.has("rice")) {
      suggestions.push(`🍚 **Simple Fried Rice**
*Prep: 10 min | Cook: 10 min | Serves: 2-3*

**Ingredients:**
- ${ingredients.join(", ")}
- Soy sauce, oil, salt

**Instructions:**
1. Cook rice according to package directions and let cool
2. Heat oil in a large pan or wok
3. Add harder vegetables first and stir-fry 2-3 minutes
4. Add softer ingredients and cook 1-2 minutes
5. Add rice and stir-fry, breaking up clumps
6. Season with soy sauce and salt to taste
7. Serve hot

**Tips:**
- Use day-old rice for best texture
- Keep everything moving in the pan`);
    }

    return suggestions;
  }

  private isIngredient(label: string): boolean {
    // Comprehensive ingredient detection list
    const commonIngredients = [
      // Fruits
      "apple",
      "banana",
      "orange",
      "lemon",
      "lime",
      "strawberry",
      "blueberry",
      "raspberry",
      "grape",
      "pineapple",
      "mango",
      "kiwi",
      "peach",
      "pear",
      "cherry",
      "plum",
      "watermelon",
      "melon",
      "avocado",

      // Vegetables
      "tomato",
      "potato",
      "sweet potato",
      "onion",
      "carrot",
      "broccoli",
      "bell pepper",
      "pepper",
      "zucchini",
      "eggplant",
      "cabbage",
      "cauliflower",
      "celery",
      "radish",
      "butternut squash",
      "asparagus",
      "green beans",
      "pumpkin",
      "mushroom",
      "lettuce",
      "cucumber",
      "garlic",
      "spinach",
      "corn",
      "bean",
      "pea",

      // Proteins
      "chicken",
      "beef",
      "pork",
      "fish",
      "salmon",
      "tuna",
      "shrimp",
      "crab",
      "lobster",
      "scallop",
      "cod",
      "turkey",
      "duck",
      "lamb",
      "bacon",
      "ham",
      "sausage",
      "egg",

      // Dairy
      "milk",
      "cheese",
      "butter",
      "yogurt",
      "cream",
      "sour cream",
      "cottage cheese",
      "mozzarella",
      "cheddar",
      "parmesan",
      "feta",
      "goat cheese",
      "ricotta",

      // Grains & Starches
      "bread",
      "rice",
      "pasta",
      "spaghetti",
      "flour",
      "quinoa",
      "barley",
      "oats",
      "wheat",
      "rye",
      "buckwheat",

      // Legumes & Nuts
      "lentil",
      "chickpea",
      "black bean",
      "kidney bean",
      "pinto bean",
      "almond",
      "walnut",
      "pecan",
      "cashew",
      "pistachio",
      "hazelnut",
      "coconut",
      "sesame",
      "sunflower seed",
      "pumpkin seed",

      // Herbs & Spices
      "basil",
      "oregano",
      "thyme",
      "rosemary",
      "parsley",
      "cilantro",
      "mint",
      "dill",
      "sage",
      "chives",
      "ginger",
      "turmeric",
      "paprika",
      "cumin",
      "coriander",
      "cinnamon",
      "nutmeg",
      "cloves",
      "cardamom",

      // Pantry Items
      "sugar",
      "salt",
      "oil",
      "vinegar",
      "honey",
      "olive oil",
      "coconut oil",
    ];

    const labelLower = label.toLowerCase();

    return commonIngredients.some((ingredient) => {
      const ingredientLower = ingredient.toLowerCase();
      return (
        labelLower.includes(ingredientLower) ||
        ingredientLower.includes(labelLower) ||
        this.fuzzyMatch(labelLower, ingredientLower)
      );
    });
  }

  private fuzzyMatch(str1: string, str2: string): boolean {
    // Simple fuzzy matching for ingredient detection
    const threshold = 0.75;
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return true;
    if (shorter.length === 0) return false;

    const similarity =
      (longer.length - this.levenshteinDistance(longer, shorter)) /
      longer.length;
    return similarity >= threshold;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Method to check if token is configured
  isTokenConfigured(): boolean {
    return !!this.HF_TOKEN;
  }

  // Method to get API status
  getAPIStatus(): string {
    return this.HF_TOKEN
      ? "Authenticated (Higher rate limits)"
      : "Free tier (Rate limited)";
  }
}

export const aiService = new AIService();
