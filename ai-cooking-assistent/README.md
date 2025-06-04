# AI Cooking Assistant 🍳🤖

An intelligent cooking assistant that analyzes your ingredient photos and suggests delicious recipes using Hugging Face AI APIs.

## Features

- **Image Upload**: Drag and drop or click to upload photos of your ingredients
- **AI Image Captioning**: Uses `nlpconnect/vit-gpt2-image-captioning` to describe your photos
- **Object Detection**: Employs `facebook/detr-resnet-50` to identify individual ingredients
- **Recipe Generation**: Leverages `mistralai/Mistral-7B-Instruct` to create personalized recipes
- **Interactive Ingredient Management**: Add or remove ingredients manually
- **Clean Minimalist UI**: Simple, responsive design without external CSS frameworks

## How It Works

1. **Upload Photo**: Take or upload a clear photo of your ingredients
2. **AI Analysis**: The app automatically:
   - Generates a description of your image using Hugging Face APIs
   - Detects and identifies individual ingredients
3. **Review & Edit**: Check the detected ingredients and add any missing ones
4. **Generate Recipe**: Get a custom recipe with step-by-step instructions
5. **Cook & Enjoy**: Follow the AI-generated recipe to create something delicious!

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **AI/ML**: Hugging Face Inference API
- **Image Processing**: Browser-native file handling
- **Styling**: Pure CSS (no external frameworks)
- **Icons**: Lucide React

## AI Models Used

- **Image Captioning**: `nlpconnect/vit-gpt2-image-captioning`
- **Object Detection**: `facebook/detr-resnet-50`
- **Text Generation**: `mistralai/Mistral-7B-Instruct-v0.1`

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Internet connection (for API calls)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd ai-cooking-assistent
```

2. Install dependencies

```bash
npm install
```

3. (Optional) Add Hugging Face token for higher rate limits

Create a `.env.local` file in the root directory:

```bash
# Optional: Get your free token from https://huggingface.co/settings/tokens
VITE_HF_TOKEN=your_huggingface_token_here
```

4. Start the development server

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### First Run

✅ **Instant Loading**: No model downloads required! The app uses Hugging Face's cloud APIs, so it starts working immediately.

## Usage Tips

- **Image Quality**: Use clear, well-lit photos for best ingredient detection
- **Multiple Ingredients**: Include multiple ingredients in one photo for more interesting recipes
- **Manual Additions**: Don't forget to add spices, seasonings, or ingredients the AI might miss
- **Experiment**: Try different combinations of ingredients for unique recipe suggestions
- **Rate Limits**: Without a Hugging Face token, you may encounter rate limits during heavy usage

## API Information

This app uses the free Hugging Face Inference API. Here's what you need to know:

- **Free Usage**: Works without any API key with basic rate limits
- **Enhanced Usage**: Add a free Hugging Face token for higher rate limits
- **Processing Time**: API calls typically complete in 2-10 seconds
- **Internet Required**: Requires active internet connection

## Project Structure

```
src/
├── components/
│   ├── ImageUpload.tsx      # Drag & drop image upload
│   ├── IngredientsList.tsx  # Ingredient management
│   └── RecipeDisplay.tsx    # Recipe formatting & display
├── services/
│   └── aiService.ts         # Hugging Face API integration
├── App.tsx                  # Main application
├── App.css                  # Component styles
└── index.css                # Global styles
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Modern browser with fetch API support required.

## Performance Notes

- **No Downloads**: No large model files to download
- **Fast Startup**: App loads instantly
- **Processing Time**: AI analysis takes 5-15 seconds via API
- **Memory Usage**: Lightweight - only ~50MB RAM usage
- **Always Online**: Requires internet connection for AI features

## Rate Limits & API Usage

- **Free Tier**: Limited requests per hour without token
- **With Token**: Significantly higher rate limits
- **Model Loading**: First API call to each model may take ~20 seconds (cold start)
- **Subsequent Calls**: Much faster after initial model warm-up

## Getting a Hugging Face Token (Optional)

1. Visit [Hugging Face](https://huggingface.co/join) and create a free account
2. Go to [Settings > Tokens](https://huggingface.co/settings/tokens)
3. Create a new token with "Read" permissions
4. Add it to your `.env.local` file as `VITE_HF_TOKEN=your_token_here`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Hugging Face for the amazing AI models and free API access
- React and Vite teams for excellent development tools
- Lucide for beautiful icons
