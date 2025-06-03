# Local LLM Client

A simple Node.js script that makes programmatic calls to a local LLM running via LM Studio.

## Quick Start

### 1. Install LM Studio
- Download from [https://lmstudio.ai/](https://lmstudio.ai/)
- Install and launch the application

### 2. Download a Model
In LM Studio, search for and download one of these models:
- **llama3** (recommended): `meta-llama/Meta-Llama-3-8B-Instruct-GGUF`
- **mistral**: `mistralai/Mistral-7B-Instruct-v0.2-GGUF`
- **phi**: `microsoft/Phi-3-mini-4k-instruct-gguf`
- **tinyllama**: `TinyLlama/TinyLlama-1.1B-Chat-v1.0-GGUF`

### 3. Start Local Server
1. In LM Studio, go to "Local Server" tab
2. Load your downloaded model
3. Click "Start Server" (defaults to localhost:1234)

### 4. Run the Script
```bash
# Clone this repository
git clone <your-repo-url>
cd local-llm-client

# Run the script (requires Node.js)
node local-llm-client.js
```

## Expected Output
```
🤖 Local LLM Client Starting...

📝 Prompt: "What are the three most important principles of clean code?"

🔄 Sending request to LM Studio...

🎯 AI Response:
==================================================
1. **Readability**: Code should be easy to read and understand...
2. **Simplicity**: Keep functions small and focused on one task...
3. **Consistency**: Follow consistent naming conventions...
==================================================
```

## Troubleshooting
- **Connection refused**: Make sure LM Studio server is running on port 1234
- **No response**: Verify a model is loaded in LM Studio
- **Slow response**: Smaller models (TinyLlama, Phi) respond faster

## Customization
Edit these variables in `local-llm-client.js`:
- `PROMPT`: Change the question you want to ask
- `temperature`: Adjust creativity (0.1 = focused, 1.0 = creative)
- `max_tokens`: Control response length