// local-llm-client-advanced.js

import { LMStudioClient } from "@lmstudio/sdk";

// Configuration
const PROMPT = "Explain quantum computing in simple terms";

// Function to demonstrate simple responses
async function simpleExample(prompt) {
  console.log("🎯 Simple Response Example\n");

  try {
    const client = new LMStudioClient();
    const loadedModels = await client.llm.listLoaded();

    if (loadedModels.length === 0) {
      throw new Error("No models are currently loaded");
    }

    const model = await client.llm.model(loadedModels[0].identifier);
    console.log(`📦 Using model: ${loadedModels[0].identifier}\n`);

    console.log("🎯 AI Response:");
    console.log("=".repeat(50));

    // Get the complete response at once
    const response = await model.respond([{ role: "user", content: prompt }], {
      temperature: 0.7,
      maxTokens: 200,
    });

    console.log(response.content);
    console.log("=".repeat(50));

    return response.content;
  } catch (error) {
    throw new Error(`Response Error: ${error.message}`);
  }
}

// Function to get model information
async function getModelInfo() {
  console.log("\n📊 Model Information\n");

  try {
    const client = new LMStudioClient();
    const loadedModels = await client.llm.listLoaded();

    if (loadedModels.length === 0) {
      console.log("❌ No models are currently loaded");
      return;
    }

    for (const modelInfo of loadedModels) {
      console.log(`🤖 Model: ${modelInfo.identifier}`);
      console.log(`   • Architecture: ${modelInfo.architecture || "Unknown"}`);
      console.log(
        `   • Size: ${
          modelInfo.sizeBytes
            ? (modelInfo.sizeBytes / 1024 / 1024 / 1024).toFixed(2) + " GB"
            : "Unknown"
        }`
      );
      console.log(
        `   • Context Length: ${modelInfo.contextLength || "Unknown"}`
      );
      console.log(
        `   • Loaded at: ${new Date(modelInfo.loadedAt).toLocaleString()}`
      );
      console.log("");
    }
  } catch (error) {
    console.error(`Model Info Error: ${error.message}`);
  }
}

// Function to demonstrate conversation history
async function conversationExample() {
  console.log("\n💬 Conversation Example\n");

  try {
    const client = new LMStudioClient();
    const loadedModels = await client.llm.listLoaded();

    if (loadedModels.length === 0) {
      throw new Error("No models are currently loaded");
    }

    const model = await client.llm.model(loadedModels[0].identifier);

    // Build a conversation
    const conversation = [
      { role: "user", content: "Hello! What's your name?" },
      {
        role: "assistant",
        content: "Hello! I'm an AI assistant. How can I help you today?",
      },
      { role: "user", content: "Can you explain what an API is?" },
    ];

    console.log("🗣️  Conversation Context:");
    conversation.forEach((msg, i) => {
      console.log(`${i + 1}. ${msg.role.toUpperCase()}: ${msg.content}`);
    });

    console.log("\n🎯 AI Response:");
    console.log("=".repeat(50));

    const response = await model.respond(conversation, {
      temperature: 0.7,
      maxTokens: 150,
    });

    console.log(response.content);
    console.log("=".repeat(50));
  } catch (error) {
    throw new Error(`Conversation Error: ${error.message}`);
  }
}

// Function to list all available models (downloaded but not necessarily loaded)
async function listAllModels() {
  console.log("\n📚 All Downloaded Models\n");

  try {
    const client = new LMStudioClient();
    const allModels = await client.llm.listDownloaded();

    if (allModels.length === 0) {
      console.log("❌ No models found in LM Studio");
      return;
    }

    console.log(`Found ${allModels.length} downloaded model(s):`);
    allModels.forEach((model, index) => {
      console.log(`${index + 1}. ${model.identifier}`);
      console.log(`   Path: ${model.path}`);
      console.log(
        `   Size: ${
          model.sizeBytes
            ? (model.sizeBytes / 1024 / 1024 / 1024).toFixed(2) + " GB"
            : "Unknown"
        }`
      );
      console.log("");
    });
  } catch (error) {
    console.error(`List Models Error: ${error.message}`);
  }
}

// Main execution with multiple examples
async function main() {
  console.log("🚀 Advanced LM Studio SDK Examples\n");
  console.log("=".repeat(60));

  try {
    // Show all downloaded models
    await listAllModels();

    // Show loaded model information
    await getModelInfo();

    // Demonstrate simple response
    await simpleExample(PROMPT);

    // Demonstrate conversation
    await conversationExample();

    console.log("\n✅ All examples completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n💡 Make sure:");
    console.log("   1. LM Studio is running");
    console.log("   2. At least one model is loaded");
    console.log("   3. Local server is accessible");
  }
}

// Run the advanced examples
main();
