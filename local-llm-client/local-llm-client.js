// local-llm-client.js
// Simple Node.js script to interact with LM Studio's local API

const https = require('https');

// Configuration
const LM_STUDIO_URL = 'http://localhost:1234/v1/chat/completions';
const PROMPT = "What are the three most important principles of clean code?";

// Function to make API call to local LLM
async function callLocalLLM(prompt) {
    const requestData = JSON.stringify({
        model: "local-model", // LM Studio uses this generic identifier
        messages: [
            {
                role: "user", 
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 150
    });

    const options = {
        hostname: 'localhost',
        port: 1234,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = require('http').request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                } catch (error) {
                    reject(new Error(`Failed to parse response: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        req.write(requestData);
        req.end();
    });
}

// Main execution
async function main() {
    console.log("🤖 Local LLM Client Starting...\n");
    console.log(`📝 Prompt: "${PROMPT}"\n`);
    console.log("🔄 Sending request to LM Studio...\n");

    try {
        const response = await callLocalLLM(PROMPT);
        
        if (response.choices && response.choices[0]) {
            const aiResponse = response.choices[0].message.content;
            console.log("🎯 AI Response:");
            console.log("=" * 50);
            console.log(aiResponse);
            console.log("=" * 50);
        } else {
            console.error("❌ Unexpected response format:", response);
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.log("\n💡 Make sure:");
        console.log("   1. LM Studio is running");
        console.log("   2. A model is loaded");
        console.log("   3. Local server is started on port 1234");
    }
}

// Run the script
main();