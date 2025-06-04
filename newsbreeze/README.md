# NewsBreeze 🎭📰

**Celebrity-Powered Audio News Reader with AI Summarization**

NewsBreeze transforms the way you consume news by combining the latest CNN headlines with AI-powered celebrity voice synthesis and on-demand article summarization. Get your daily news updates read aloud by your favorite celebrities using cutting-edge voice cloning technology.

## 🚀 Features

### 📻 **Audio News Experience**

- **Celebrity Voices**: Choose from Morgan Freeman, David Attenborough, Samuel L. Jackson, Emma Stone, and Benedict Cumberbatch
- **Voice Cloning**: Advanced celebrity voice synthesis using coqui/XTTS-v2 model
- **Smart Playback**: Play summaries or full article content in celebrity voices

### 🤖 **AI-Powered Summarization**

- **On-Demand Summaries**: Click to summarize any article using Falconsai/text_summarization
- **Intelligent Processing**: AI analyzes article content and generates concise summaries
- **Visual Distinction**: Summarized content is clearly highlighted in the UI

### 📰 **News Aggregation**

- **Live CNN Feed**: Real-time headlines from CNN via saurav.tech NewsAPI
- **Category Filtering**: Technology, Business, Health, Science, Sports, Entertainment, and General news
- **Smart Content**: Full article text, descriptions, and metadata

### 🎨 **Modern UI/UX**

- **Responsive Design**: Beautiful interface built with Tailwind CSS
- **Interactive Controls**: Separate summarize and play buttons for each article
- **Real-time Feedback**: Loading states, progress indicators, and visual feedback
- **Mobile-Friendly**: Optimized for all device sizes

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **APIs**:
  - CNN News via saurav.tech for live headlines
  - Hugging Face Inference API for summarization (Falconsai/text_summarization)
  - Hugging Face coqui/XTTS-v2 for celebrity voice cloning
- **Fallback**: Web Speech API for demo mode

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Step-by-Step Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd local-llm/newsbreeze
```

2. **Navigate to the project directory**

**For Windows PowerShell:**

```powershell
cd newsbreeze
```

**For Command Prompt or Git Bash:**

```bash
cd newsbreeze
```

3. **Install dependencies**

```bash
npm install
```

4. **Set up environment variables (Optional but recommended)**

Create a `.env` file in the `newsbreeze` directory:

```env
# Required for AI summarization and voice cloning
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Optional - currently using free CNN endpoint
VITE_NEWS_API_KEY=your_news_api_key_here
```

5. **Start the development server**

```bash
npm run dev
```

6. **Open the application**

The app will be available at `http://localhost:5173`

### 🚀 Quick Start Commands

**For Windows PowerShell users:**

```powershell
# Navigate to project
cd local-llm
cd newsbreeze

# Install and run
npm install
npm run dev
```

**For Linux/Mac/Git Bash users:**

```bash
# Navigate to project
cd local-llm/newsbreeze

# Install and run
npm install && npm run dev
```

## 🔧 Development Commands

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## 🏃‍♂️ Running the Project

### Method 1: Standard Development

1. Open terminal/command prompt
2. Navigate to the newsbreeze directory:
   ```bash
   cd path/to/your/project/newsbreeze
   ```
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open browser and go to `http://localhost:5173`

### Method 2: Using PowerShell (Windows)

```powershell
# Open PowerShell as Administrator (recommended)
# Navigate to your project directory
Set-Location "C:\Users\YourUsername\path\to\project\newsbreeze"

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🐛 Common Issues & Solutions

### Issue: "package.json not found"

**Solution:** Make sure you're in the `newsbreeze` directory, not the parent directory.

```bash
# Wrong: Running from local-llm directory
cd local-llm
npm run dev  # ❌ This will fail

# Correct: Running from newsbreeze directory
cd local-llm/newsbreeze
npm run dev  # ✅ This works
```

### Issue: PowerShell "&&" not recognized

**Solution:** Use separate commands in PowerShell:

```powershell
# Instead of: cd newsbreeze && npm run dev
# Use separate commands:
cd newsbreeze
npm run dev
```

### Issue: Port already in use

**Solution:** Kill the process or use a different port:

```bash
# Kill process on port 5173
npx kill-port 5173

# Or specify different port
npm run dev -- --port 3000
```

### Issue: Dependencies not installing

**Solution:** Clear cache and reinstall:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 🌐 Browser Compatibility

- ✅ **Chrome** 60+
- ✅ **Firefox** 55+
- ✅ **Safari** 11+
- ✅ **Edge** 79+

### Web Speech API Support

Voice synthesis requires Web Speech API support:

- ✅ Chrome (full support)
- ✅ Safari (full support)
- ⚠️ Firefox (limited support)
- ✅ Edge (full support)

## 📁 Project Structure

```
newsbreeze/
├── 📂 src/                  # Source code
│   ├── 📂 components/       # React components
│   ├── 📂 services/         # API services
│   ├── 📄 App.jsx          # Main app component
│   └── 📄 main.jsx         # Entry point
├── 📂 public/              # Static assets
├── 📄 package.json         # Dependencies
├── 📄 vite.config.js       # Vite configuration
├── 📄 tailwind.config.js   # Tailwind CSS config
└── 📄 README.md            # This file
```

## 🎨 Customization

### Adding New Celebrity Voices

Edit `src/services/VoiceService.js` and add new voice configurations:

```javascript
{
  id: 'new_celebrity',
  name: 'Celebrity Name',
  description: 'Voice description',
  avatar: 'avatar_url',
  sample: 'Sample text for voice preview'
}
```

### Adding News Categories

Edit `src/services/NewsService.js` to add new categories:

```javascript
{ id: 'category_id', name: 'Category Name', icon: '📱' }
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
# Upload the `dist` folder to Netlify
```

## 🎯 Usage

1. **Browse News**: Latest CNN headlines are loaded automatically
2. **Filter by Category**: Use the sidebar to filter news by topic
3. **Summarize Articles**: Click the "Summarize" button to get an AI-generated summary
4. **Select Celebrity Voice**: Choose your preferred celebrity voice from the sidebar
5. **Listen to News**: Click "Play" to hear articles read in the selected celebrity voice
6. **Control Playback**: Use stop/play controls to manage audio

## 🔑 API Keys Setup

### Hugging Face API Key (Required for full functionality)

1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a new access token (free tier available)
3. Add it to your `.env` file
4. This enables:
   - AI article summarization
   - Celebrity voice cloning

### News API (Optional)

The app currently uses a free CNN news endpoint, but you can optionally add a NewsAPI key:

1. Visit [NewsAPI.org](https://newsapi.org)
2. Sign up for a free account
3. Add the key to your `.env` file

## ✨ Key Features Walkthrough

### AI Summarization

- Click the **"Summarize"** button on any article
- Watch as the AI processes the content
- View the generated summary in a highlighted box
- The summary is optimized for audio playback

### Celebrity Voice Synthesis

- Choose from 5 celebrity voice profiles
- Powered by state-of-the-art XTTS-v2 voice cloning
- Fallback to Web Speech API when needed
- Reads either the original content or AI summary

### Live News Feed

- Real-time CNN headlines via saurav.tech API
- Automatic category filtering based on content keywords
- Rich article metadata including images and publication dates

## 🔄 Demo Mode

NewsBreeze works even without API keys! It includes:

- Demo news articles with realistic content
- Web Speech API fallback for voice synthesis
- Basic summarization using sentence extraction
- Full UI functionality for testing

## 🏗️ Project Structure

```
newsbreeze/
├── src/
│   ├── components/           # React components
│   │   ├── Header.jsx       # App header with branding
│   │   ├── VoiceSelector.jsx # Celebrity voice selection
│   │   ├── CategoryFilter.jsx # News category filter
│   │   ├── NewsFeed.jsx     # News articles list
│   │   ├── NewsCard.jsx     # Individual news article
│   │   └── LoadingSpinner.jsx # Loading state
│   ├── services/            # API and business logic
│   │   ├── NewsService.js   # News fetching and summarization
│   │   └── VoiceService.js  # Voice synthesis and TTS
│   ├── App.jsx              # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── README.md               # This file
```

## 🎨 Customization

### Adding New Celebrity Voices

Edit `src/services/VoiceService.js` and add new voice configurations:

```javascript
{
  id: 'new_celebrity',
  name: 'Celebrity Name',
  description: 'Voice description',
  avatar: 'avatar_url',
  sample: 'Sample text for voice preview'
}
```

### Adding News Categories

Edit `src/services/NewsService.js` to add new categories:

```javascript
{ id: 'category_id', name: 'Category Name', icon: '📱' }
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
# Upload the `dist` folder to Netlify
```

## 🐛 Troubleshooting

### Voice Synthesis Not Working

- Check if your browser supports the Web Speech API
- Verify your Hugging Face API key is valid
- Some browsers require HTTPS for speech synthesis

### News Not Loading

- Verify your NewsAPI key is correct
- Check your internet connection
- The app will fall back to demo content if APIs fail

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version (requires Node 14+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [NewsAPI](https://newsapi.org) for news data
- [Hugging Face](https://huggingface.co) for AI models
- [Coqui](https://github.com/coqui-ai/TTS) for voice synthesis technology
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for beautiful icons

---

**Experience the future of news consumption with NewsBreeze! 🎭📰**
