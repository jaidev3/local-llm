class AIWriter {
  constructor() {
    this.apiUrl = "http://localhost:1234/v1";
    this.isConnected = false;
    this.currentModel = null;
    this.isGenerating = false;

    this.initializeElements();
    this.attachEventListeners();
    this.checkConnection();

    // Writing type prompts
    this.prompts = {
      blog: (topic) =>
        `Write an engaging blog introduction about "${topic}". Make it compelling, informative, and hook the reader from the first sentence. Include relevant context and set up what the blog post will cover.`,
      tweet: (topic) =>
        `Write a compelling and engaging tweet about "${topic}". Keep it under 280 characters, make it shareable, and include relevant hashtags if appropriate.`,
      story: (topic) =>
        `Write the beginning of an interesting short story with the theme or setting: "${topic}". Create compelling characters, set the scene, and establish an engaging narrative hook.`,
      email: (topic) =>
        `Write a professional and clear email about "${topic}". Include a proper subject line, greeting, main content, and closing. Make it concise yet complete.`,
    };
  }

  initializeElements() {
    // Status elements
    this.statusDot = document.getElementById("statusDot");
    this.statusText = document.getElementById("statusText");

    // Input elements
    this.typeButtons = document.querySelectorAll(".type-btn");
    this.topicInput = document.getElementById("topicInput");
    this.temperatureSlider = document.getElementById("temperatureSlider");
    this.temperatureValue = document.getElementById("temperatureValue");
    this.generateBtn = document.getElementById("generateBtn");

    // Output elements
    this.loadingIndicator = document.getElementById("loadingIndicator");
    this.outputText = document.getElementById("outputText");
    this.copyBtn = document.getElementById("copyBtn");
    this.clearBtn = document.getElementById("clearBtn");

    // Modal elements
    this.errorModal = document.getElementById("errorModal");
    this.errorMessage = document.getElementById("errorMessage");
    this.closeErrorModal = document.getElementById("closeErrorModal");

    this.selectedType = "blog";
  }

  attachEventListeners() {
    // Writing type selection
    this.typeButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.selectWritingType(btn));
    });

    // Temperature slider
    this.temperatureSlider.addEventListener("input", (e) => {
      this.temperatureValue.textContent = e.target.value;
    });

    // Generate button
    this.generateBtn.addEventListener("click", () => this.generateContent());

    // Action buttons
    this.copyBtn.addEventListener("click", () => this.copyToClipboard());
    this.clearBtn.addEventListener("click", () => this.clearOutput());

    // Modal close
    this.closeErrorModal.addEventListener("click", () => this.hideErrorModal());
    this.errorModal.addEventListener("click", (e) => {
      if (e.target === this.errorModal) this.hideErrorModal();
    });

    // Enter key to generate
    this.topicInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        this.generateContent();
      }
    });
  }

  async checkConnection() {
    try {
      this.updateStatus("connecting", "Connecting...");

      const response = await fetch(`${this.apiUrl}/models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        this.currentModel = data.data[0].id;
        this.isConnected = true;
        this.updateStatus("connected", `Connected • ${this.currentModel}`);
      } else {
        throw new Error("No models loaded");
      }
    } catch (error) {
      this.isConnected = false;
      this.updateStatus("error", "Connection failed");
      console.error("Connection error:", error);
    }
  }

  updateStatus(status, text) {
    this.statusDot.className = `status-dot ${status}`;
    this.statusText.textContent = text;
  }

  selectWritingType(button) {
    this.typeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    this.selectedType = button.dataset.type;

    // Update placeholder text based on type
    const placeholders = {
      blog: 'e.g., "The future of artificial intelligence" or "Benefits of meditation"',
      tweet: 'e.g., "Climate change awareness" or "New JavaScript features"',
      story: 'e.g., "A mysterious library" or "Time travel adventure"',
      email: 'e.g., "Project update meeting" or "Thank you for the interview"',
    };

    this.topicInput.placeholder = placeholders[this.selectedType];
  }

  async generateContent() {
    if (!this.isConnected) {
      this.showErrorModal(
        "Not connected to LM Studio. Please make sure LM Studio is running with a model loaded."
      );
      return;
    }

    const topic = this.topicInput.value.trim();
    if (!topic) {
      this.topicInput.focus();
      this.topicInput.style.borderColor = "#ef4444";
      setTimeout(() => {
        this.topicInput.style.borderColor = "";
      }, 2000);
      return;
    }

    if (this.isGenerating) return;

    this.isGenerating = true;
    this.showLoading();
    this.generateBtn.disabled = true;

    try {
      const prompt = this.prompts[this.selectedType](topic);
      const temperature = parseFloat(this.temperatureSlider.value);

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.currentModel,
          messages: [
            {
              role: "system",
              content:
                "You are a skilled writer who creates engaging, high-quality content. Be creative, informative, and match the requested writing style perfectly.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: temperature,
          max_tokens: this.getMaxTokens(),
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const content = data.choices[0].message.content.trim();
        this.showOutput(content);
      } else {
        throw new Error("No content generated");
      }
    } catch (error) {
      console.error("Generation error:", error);
      this.showErrorModal(`Failed to generate content: ${error.message}`);
      this.hideLoading();
    } finally {
      this.isGenerating = false;
      this.generateBtn.disabled = false;
    }
  }

  getMaxTokens() {
    const tokenLimits = {
      blog: 500,
      tweet: 100,
      story: 800,
      email: 300,
    };
    return tokenLimits[this.selectedType] || 400;
  }

  showLoading() {
    this.loadingIndicator.classList.remove("hidden");
    this.outputText.classList.add("hidden");
  }

  hideLoading() {
    this.loadingIndicator.classList.add("hidden");
    this.outputText.classList.remove("hidden");
  }

  showOutput(content) {
    this.hideLoading();
    this.outputText.innerHTML = "";
    this.outputText.textContent = content;
    this.outputText.classList.add("has-content");

    // Scroll to output on mobile
    if (window.innerWidth <= 768) {
      this.outputText.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async copyToClipboard() {
    const content = this.outputText.textContent;
    if (
      !content ||
      content.includes("Your AI-generated content will appear here")
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(content);

      // Visual feedback
      const originalIcon = this.copyBtn.innerHTML;
      this.copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      this.copyBtn.style.color = "#10b981";

      setTimeout(() => {
        this.copyBtn.innerHTML = originalIcon;
        this.copyBtn.style.color = "";
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);

      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  }

  clearOutput() {
    this.outputText.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-robot"></i>
                <p>Your AI-generated content will appear here</p>
            </div>
        `;
    this.outputText.classList.remove("has-content");
  }

  showErrorModal(message) {
    this.errorMessage.textContent = message;
    this.errorModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  hideErrorModal() {
    this.errorModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  // Retry connection
  async retryConnection() {
    await this.checkConnection();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.aiWriter = new AIWriter();

  // Add retry connection on status click
  document.getElementById("statusText").addEventListener("click", () => {
    if (!window.aiWriter.isConnected) {
      window.aiWriter.retryConnection();
    }
  });

  // Add keyboard shortcuts info
  document.addEventListener("keydown", (e) => {
    if (e.key === "F1") {
      e.preventDefault();
      alert(
        "Keyboard Shortcuts:\n\nCtrl + Enter: Generate content\nEscape: Close modal\n\nClick on status to retry connection."
      );
    }

    if (e.key === "Escape") {
      window.aiWriter.hideErrorModal();
    }
  });
});

// Auto-reconnect on page visibility change
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && window.aiWriter && !window.aiWriter.isConnected) {
    setTimeout(() => {
      window.aiWriter.checkConnection();
    }, 1000);
  }
});

// Service worker registration for offline support (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // We'll add this later if needed
  });
}
