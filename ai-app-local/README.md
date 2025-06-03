# 🤖 AI Writer - Local LLM App
- enable cors in developer settings of lm studio
A beautiful, modern AI writing assistant that runs entirely on your local machine using LM Studio. Generate blog intros, tweets, stories, and emails with complete privacy - no data sent to external servers!

![AI Writer Demo](https://img.shields.io/badge/Status-Ready-brightgreen) ![Local LLM](https://img.shields.io/badge/LLM-Local%20Only-blue) ![No API Keys](https://img.shields.io/badge/API%20Keys-Not%20Required-orange)

## ✨ Features

- **🎯 4 Writing Types**: Blog intros, tweets, stories, and emails
- **🎛️ Temperature Control**: Adjust creativity from precise to creative
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🔒 Complete Privacy**: Everything runs locally - no data leaves your machine
- **⚡ Real-time Status**: Live connection status with LM Studio
- **📋 One-click Copy**: Easy clipboard integration
- **🎨 Modern UI**: Beautiful, glassmorphism design with smooth animations
- **⌨️ Keyboard Shortcuts**: Ctrl+Enter to generate, Escape to close modals

## 🚀 Quick Start

### Prerequisites

1. **Install LM Studio** from [lmstudio.ai](https://lmstudio.ai/)
2. **Download a Model** (recommended: `llama-3.2-1b-instruct` or `llama-3.2-3b-instruct`)

### Setup Instructions

#### Step 1: Prepare LM Studio

1. Open LM Studio
2. Go to the **"Search"** tab and download a model
3. Go to the **"Chat"** tab and load your model
4. Switch to the **"Developer"** tab
5. Click **"Start Server"** (it should start on `http://localhost:1234`)

#### Step 2: Run the AI Writer App

1. Download or clone this repository
2. Open `index.html` in your web browser
3. The app will automatically connect to LM Studio
4. Start writing! 🎉

## 🎮 How to Use

### 1. **Choose Writing Type**

Select from four different writing styles:

- **📝 Blog Intro**: Engaging introductions for blog posts
- **🐦 Tweet**: Compelling social media content
- **📚 Story**: Creative story beginnings
- **📧 Email**: Professional email content

### 2. **Enter Your Topic**

Type your topic or prompt in the text area. Be specific for better results!

**Examples:**

- Blog: "The benefits of remote work"
- Tweet: "New JavaScript ES2024 features"
- Story: "A time traveler's first day in medieval times"
- Email: "Project milestone update for team"

### 3. **Adjust Creativity**

Use the temperature slider to control output style:

- **Low (0.1-0.3)**: More precise, factual, consistent
- **Medium (0.4-0.7)**: Balanced creativity and accuracy
- **High (0.8-1.0)**: More creative, varied, experimental

### 4. **Generate Content**

Click "Generate Content" or press **Ctrl+Enter** to create your content.

### 5. **Copy & Use**

Click the copy button to save the generated content to your clipboard.

## 🔧 Troubleshooting

### ❌ "Connection failed" Error

**Possible causes and solutions:**

1. **LM Studio not running**

   - Make sure LM Studio is open and running

2. **No model loaded**

   - Load a model in LM Studio's Chat tab
   - Wait for the model to fully load (you'll see "Model loaded" message)

3. **Server not started**

   - Go to LM Studio's Developer tab
   - Click "Start Server"
   - Verify it's running on port 1234

4. **Firewall blocking connection**

   - Allow LM Studio through your firewall
   - Try temporarily disabling firewall to test

5. **Wrong port**
   - Check if LM Studio server is running on a different port
   - Edit `script.js` line 3: `this.apiUrl = 'http://localhost:YOUR_PORT/v1';`

### 🐛 Other Issues

**App loads but no content generates:**

- Check browser console (F12) for error messages
- Ensure the model is compatible with chat completions
- Try a different model

**Slow generation:**

- Use a smaller model (1B or 3B parameters)
- Reduce max_tokens in the code
- Close other applications to free up system resources

**Mobile display issues:**

- Use a modern browser (Chrome, Firefox, Safari)
- Ensure JavaScript is enabled

## 🎯 Customization

### Adding New Writing Types

Edit `script.js` and add new prompts to the `this.prompts` object:

```javascript
this.prompts = {
  // existing prompts...
  poem: (topic) =>
    `Write a beautiful poem about "${topic}". Use vivid imagery and emotional language.`,
  recipe: (topic) =>
    `Write a detailed recipe for "${topic}". Include ingredients and step-by-step instructions.`,
};
```

### Changing the LM Studio Port

If your LM Studio runs on a different port, edit line 3 in `script.js`:

```javascript
this.apiUrl = "http://localhost:YOUR_PORT/v1";
```

### Adjusting Token Limits

Modify the `getMaxTokens()` function in `script.js` to change output length:

```javascript
getMaxTokens() {
    const tokenLimits = {
        blog: 500,    // ~375 words
        tweet: 100,   // ~75 words
        story: 800,   // ~600 words
        email: 300    // ~225 words
    };
    return tokenLimits[this.selectedType] || 400;
}
```

## 🏗️ Project Structure

```
ai-writer/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🔐 Privacy & Security

- **✅ 100% Local**: All processing happens on your machine
- **✅ No API Keys**: No external service credentials required
- **✅ No Data Collection**: Nothing is logged or stored externally
- **✅ Offline Capable**: Works without internet (after initial load)
- **✅ Open Source**: Full transparency - you can see exactly what it does

## 🎨 Technical Features

- **Modern CSS**: Glassmorphism design, CSS Grid, Flexbox
- **Vanilla JavaScript**: No external dependencies
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation, screen reader friendly
- **Error Handling**: Comprehensive error catching and user feedback
- **Performance**: Optimized for smooth animations and interactions

## 🤝 Contributing

Want to improve the AI Writer? Here are some ideas:

- Add more writing types (poems, code comments, product descriptions)
- Implement streaming responses for real-time generation
- Add dark/light theme toggle
- Create preset templates for common use cases
- Add export functionality (PDF, Word, etc.)
- Implement conversation history

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **LM Studio** for the amazing local LLM platform
- **Inter Font** for beautiful typography
- **Font Awesome** for icons
- **Community** for feedback and suggestions

---

**Made with ❤️ for writers who value privacy and local AI**

_Need help? Check the troubleshooting section above or open an issue!_
