# Local LLM Client

A simple Node.js project to chat with AI models running locally in LM Studio.

## 🚀 How to Run This Project

### Step 1: Install LM Studio

1. Download LM Studio from [lmstudio.ai](https://lmstudio.ai/)
2. Install and open it

### Step 2: Get a Model

1. In LM Studio, go to the **"Search"** tab
2. Download a model (we recommend **"llama-3.2-1b-instruct"** for beginners)
3. Wait for it to download

### Step 3: Start the Model

1. Go to the **"Chat"** tab in LM Studio
2. Select your downloaded model
3. Click **"Load Model"**
4. Go to the **"Developer"** tab
5. Click **"Start Server"**

### Step 4: Run This Project

1. Open your terminal/command prompt
2. Navigate to this project folder:
   ```bash
   cd local-llm-client
   ```
3. Install the required packages:
   ```bash
   npm install
   ```
4. Run the project:
   ```bash
   npm start
   ```

## 🎯 What This Does

This project will:

- Connect to your local LM Studio
- Show information about your loaded AI model
- Ask the AI a question and show the response
- Demonstrate a conversation with the AI

## 📝 Example Output

When you run `npm start`, you'll see something like:

```
🚀 Advanced LM Studio SDK Examples

📚 All Downloaded Models
Found 1 downloaded model(s):
1. llama-3.2-1b-instruct

📊 Model Information
🤖 Model: llama-3.2-1b-instruct
   • Size: 1.31 GB

🎯 Simple Response Example
📦 Using model: llama-3.2-1b-instruct

🎯 AI Response:
==================================================
Quantum computing uses quantum mechanics principles...
==================================================

✅ All examples completed successfully!
```

## 🔧 Customize the Question

To ask a different question:

1. Open `local-llm-client.js` in a text editor
2. Find this line near the top:
   ```javascript
   const PROMPT = "Explain quantum computing in simple terms";
   ```
3. Change the text inside the quotes to your question
4. Save the file and run `npm start` again

## ❌ Common Problems & Solutions

**Problem**: "No models are currently loaded"
**Solution**: Make sure you loaded a model in LM Studio (Step 3 above)

**Problem**: "Connection refused"
**Solution**: Make sure LM Studio server is running (Step 3 above)

**Problem**: "Module not found"
**Solution**: Run `npm install` first

**Problem**: "No models found"
**Solution**: Download a model in LM Studio first (Step 2 above)

## 📁 Project Files

- `package.json` - Project configuration
- `local-llm-client.js` - Main script that talks to LM Studio
- `README.md` - This help file

## 🎓 Next Steps

Once this works, you can:

- Try asking different questions
- Experiment with different AI models
- Learn more at [lmstudio.ai/docs](https://lmstudio.ai/docs)

---

**Need help?** Make sure LM Studio is running with a model loaded, then try `npm start` again!
