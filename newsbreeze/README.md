# NewsBreeze 🎭📰

**Celebrity-Powered Audio News Reader**

NewsBreeze transforms the way you consume news by combining the latest headlines with AI-powered celebrity voice synthesis. Get your daily news updates read aloud by your favorite celebrities using cutting-edge voice cloning technology.

## 🚀 Features

### 📻 **Audio News Experience**

- **Celebrity Voices**: Choose from Morgan Freeman, David Attenborough, Samuel L. Jackson, Emma Stone, and Benedict Cumberbatch
- **Smart Summarization**: AI-powered news summarization using Hugging Face's Falconsai model
- **Voice Synthesis**: Advanced text-to-speech with celebrity voice cloning via coqui/XTTS-v2

### 📰 **News Aggregation**

- **Real-time Headlines**: Fetches latest news from NewsAPI
- **Category Filtering**: Technology, Business, Health, Science, Sports, Entertainment, and General news
- **Smart Fallbacks**: Demo content when APIs are unavailable

### 🎨 **Modern UI/UX**

- **Responsive Design**: Beautiful interface built with Tailwind CSS
- **Real-time Controls**: Play, pause, and stop audio controls
- **Visual Feedback**: Audio visualization and playback indicators
- **Mobile-Friendly**: Optimized for all device sizes

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **APIs**:
  - NewsAPI for headlines
  - Hugging Face Inference API for summarization and TTS
  - coqui/XTTS-v2 for voice synthesis
- **Fallback**: Web Speech API for demo mode

## 📦 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd newsbreeze
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp env.example .env
```

Edit `.env` with your API keys:

```env
VITE_NEWS_API_KEY=your_news_api_key_here
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

4. **Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔑 API Keys Setup

### NewsAPI Key

1. Visit [NewsAPI.org](https://newsapi.org)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

### Hugging Face API Key

1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a new access token
3. Add it to your `.env` file

## 🎯 Usage

1. **Select a Celebrity Voice**: Choose from the available celebrity voices in the sidebar
2. **Pick a News Category**: Filter news by category (Technology, Business, etc.)
3. **Play Articles**: Click the play button on any article to hear it in your selected celebrity's voice
4. **Control Playback**: Use the stop button to pause any playing audio

## 🔄 Demo Mode

NewsBreeze works even without API keys! It includes:

- Demo news articles with realistic content
- Web Speech API fallback for voice synthesis
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
