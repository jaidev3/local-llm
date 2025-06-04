import axios from "axios";

class VoiceService {
  constructor() {
    this.huggingFaceApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || "";
    this.ttsApiUrl =
      "https://api-inference.huggingface.co/models/coqui/XTTS-v2";
    this.currentAudio = null;
    this.isPlaying = false;
    this.voicesLoaded = false;
    this.loadVoices();
  }

  loadVoices() {
    if ("speechSynthesis" in window) {
      // Load voices asynchronously
      const loadVoicesEvent = () => {
        this.voicesLoaded = true;
      };

      if (speechSynthesis.getVoices().length > 0) {
        this.voicesLoaded = true;
      } else {
        speechSynthesis.addEventListener("voiceschanged", loadVoicesEvent);
        // Fallback timeout
        setTimeout(() => {
          this.voicesLoaded = true;
          speechSynthesis.removeEventListener("voiceschanged", loadVoicesEvent);
        }, 3000);
      }
    }
  }

  getCelebrityVoices() {
    return [
      {
        id: "morgan_freeman",
        name: "Morgan Freeman",
        description: "Smooth, authoritative voice",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        sample: "The voice of wisdom and experience",
      },
      {
        id: "david_attenborough",
        name: "David Attenborough",
        description: "Nature documentary narrator",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        sample: "Perfect for nature and science news",
      },
      {
        id: "samuel_jackson",
        name: "Samuel L. Jackson",
        description: "Powerful, commanding presence",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        sample: "Dynamic delivery for breaking news",
      },
      {
        id: "emma_stone",
        name: "Emma Stone",
        description: "Clear, engaging voice",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face",
        sample: "Perfect for entertainment news",
      },
      {
        id: "benedict_cumberbatch",
        name: "Benedict Cumberbatch",
        description: "Sophisticated British accent",
        avatar:
          "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=100&h=100&fit=crop&crop=face",
        sample: "Ideal for technology and business news",
      },
    ];
  }

  async synthesizeSpeech(text, voiceId = "morgan_freeman") {
    // Try XTTS-v2 first if API key is available
    if (this.huggingFaceApiKey) {
      try {
        console.log(`Using XTTS-v2 for voice synthesis with ${voiceId}`);
        return await this.synthesizeWithXTTS(text, voiceId);
      } catch (error) {
        console.warn("XTTS-v2 failed, falling back to Web Speech API:", error);
      }
    }

    // Fallback to Web Speech API
    if (!this.isWebSpeechSupported()) {
      console.warn("Web Speech API not supported, using fallback");
      return this.playFallbackAudio(text);
    }

    try {
      // Stop any currently playing audio first
      this.stopSpeech();

      // Wait for voices to load if not already loaded
      if (!this.voicesLoaded) {
        await this.waitForVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice based on celebrity selection
      const voiceConfig = this.getVoiceConfig(voiceId);
      utterance.rate = voiceConfig.rate;
      utterance.pitch = voiceConfig.pitch;
      utterance.volume = voiceConfig.volume;

      // Try to find a suitable voice
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const selectedVoice =
          voices.find((voice) =>
            voiceConfig.preferredVoices.some((pref) =>
              voice.name.toLowerCase().includes(pref.toLowerCase())
            )
          ) || voices[0];

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      return new Promise((resolve, reject) => {
        utterance.onend = () => {
          this.isPlaying = false;
          this.currentAudio = null;
          resolve();
        };

        utterance.onerror = (error) => {
          console.error("Speech synthesis error:", error);
          this.isPlaying = false;
          this.currentAudio = null;
          reject(error);
        };

        utterance.onstart = () => {
          this.isPlaying = true;
        };

        // Store the utterance and start speaking
        this.currentAudio = utterance;
        this.isPlaying = true;
        speechSynthesis.speak(utterance);
      });
    } catch (error) {
      console.error("Error synthesizing speech:", error);
      this.isPlaying = false;
      this.currentAudio = null;
      throw error;
    }
  }

  async waitForVoices(timeout = 3000) {
    return new Promise((resolve) => {
      if (this.voicesLoaded || speechSynthesis.getVoices().length > 0) {
        resolve();
        return;
      }

      const checkVoices = () => {
        if (speechSynthesis.getVoices().length > 0) {
          this.voicesLoaded = true;
          resolve();
        }
      };

      speechSynthesis.addEventListener("voiceschanged", checkVoices, {
        once: true,
      });

      // Fallback timeout
      setTimeout(() => {
        this.voicesLoaded = true;
        resolve();
      }, timeout);
    });
  }

  async synthesizeWithXTTS(text, voiceId) {
    if (!this.huggingFaceApiKey) {
      throw new Error("Hugging Face API key required for XTTS-v2");
    }

    try {
      // Get speaker configuration for the selected voice
      const speakerConfig = this.getSpeakerConfig(voiceId);

      const response = await axios.post(
        this.ttsApiUrl,
        {
          inputs: text,
          parameters: {
            speaker_wav: speakerConfig.referenceAudio,
            language: "en",
            temperature: 0.7,
            length_penalty: 1.0,
            repetition_penalty: 1.1,
            top_k: 50,
            top_p: 0.8,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.huggingFaceApiKey}`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
          timeout: 30000, // 30 second timeout
        }
      );

      const audioBlob = new Blob([response.data], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      return this.playAudioFromUrl(audioUrl);
    } catch (error) {
      console.error("Error with XTTS synthesis:", error);
      // Fallback to Web Speech API
      throw error; // Let the calling function handle the fallback
    }
  }

  getSpeakerConfig(voiceId) {
    // In a real implementation, these would be actual reference audio URLs
    // For now, we'll use placeholder configurations
    const speakerConfigs = {
      morgan_freeman: {
        referenceAudio: "https://example.com/morgan_freeman_sample.wav",
        description: "Deep, authoritative voice with gravitas",
      },
      david_attenborough: {
        referenceAudio: "https://example.com/david_attenborough_sample.wav",
        description: "Clear, engaging nature documentary style",
      },
      samuel_jackson: {
        referenceAudio: "https://example.com/samuel_jackson_sample.wav",
        description: "Powerful, commanding presence",
      },
      emma_stone: {
        referenceAudio: "https://example.com/emma_stone_sample.wav",
        description: "Clear, warm female voice",
      },
      benedict_cumberbatch: {
        referenceAudio: "https://example.com/benedict_cumberbatch_sample.wav",
        description: "Sophisticated British accent",
      },
    };

    return speakerConfigs[voiceId] || speakerConfigs["morgan_freeman"];
  }

  getSpeakerEmbedding(voiceId) {
    // Legacy method - kept for backward compatibility
    const embeddings = {
      morgan_freeman: "embedding_morgan_freeman_base64...",
      david_attenborough: "embedding_david_attenborough_base64...",
      samuel_jackson: "embedding_samuel_jackson_base64...",
      emma_stone: "embedding_emma_stone_base64...",
      benedict_cumberbatch: "embedding_benedict_cumberbatch_base64...",
    };

    return embeddings[voiceId] || embeddings["morgan_freeman"];
  }

  getVoiceConfig(voiceId) {
    const configs = {
      morgan_freeman: {
        rate: 0.8,
        pitch: 0.7,
        volume: 1.0,
        preferredVoices: ["Microsoft David", "Google US English", "Daniel"],
      },
      david_attenborough: {
        rate: 0.9,
        pitch: 0.8,
        volume: 1.0,
        preferredVoices: [
          "Microsoft George",
          "Google UK English Male",
          "Daniel",
        ],
      },
      samuel_jackson: {
        rate: 1.0,
        pitch: 0.6,
        volume: 1.0,
        preferredVoices: ["Microsoft David", "Google US English", "Aaron"],
      },
      emma_stone: {
        rate: 1.1,
        pitch: 1.2,
        volume: 1.0,
        preferredVoices: [
          "Microsoft Zira",
          "Google US English Female",
          "Samantha",
        ],
      },
      benedict_cumberbatch: {
        rate: 0.9,
        pitch: 0.9,
        volume: 1.0,
        preferredVoices: [
          "Microsoft George",
          "Google UK English Male",
          "Daniel",
        ],
      },
    };

    return configs[voiceId] || configs["morgan_freeman"];
  }

  async playAudioFromUrl(audioUrl) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        this.isPlaying = false;
        this.currentAudio = null;
        URL.revokeObjectURL(audioUrl);
        resolve();
      };

      audio.onerror = (error) => {
        this.isPlaying = false;
        this.currentAudio = null;
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };

      audio.onloadstart = () => {
        this.isPlaying = true;
      };

      this.currentAudio = audio;
      audio.play();
    });
  }

  playFallbackAudio(text) {
    console.log(`Playing audio: "${text}"`);
    this.isPlaying = true;

    return new Promise((resolve) => {
      const duration = Math.min(text.length * 50, 10000);
      this.currentAudio = { type: "fallback" };

      const timeoutId = setTimeout(() => {
        this.isPlaying = false;
        this.currentAudio = null;
        resolve();
      }, duration);

      // Store timeout ID to clear it if stopped early
      this.currentAudio.timeoutId = timeoutId;
    });
  }

  stopSpeech() {
    try {
      if (this.currentAudio) {
        if (this.currentAudio instanceof SpeechSynthesisUtterance) {
          speechSynthesis.cancel();
        } else if (this.currentAudio instanceof Audio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } else if (
          this.currentAudio.type === "fallback" &&
          this.currentAudio.timeoutId
        ) {
          clearTimeout(this.currentAudio.timeoutId);
        }
        this.currentAudio = null;
      }

      // Always cancel speech synthesis to be sure
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      this.isPlaying = false;
    } catch (error) {
      console.error("Error stopping speech:", error);
      this.isPlaying = false;
      this.currentAudio = null;
    }
  }

  pauseSpeech() {
    if (this.isPlaying) {
      if (speechSynthesis.speaking) {
        speechSynthesis.pause();
      } else if (this.currentAudio instanceof Audio) {
        this.currentAudio.pause();
      }
      this.isPlaying = false;
    }
  }

  resumeSpeech() {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      this.isPlaying = true;
    } else if (this.currentAudio instanceof Audio && this.currentAudio.paused) {
      this.currentAudio.play();
      this.isPlaying = true;
    }
  }

  isWebSpeechSupported() {
    return "speechSynthesis" in window;
  }

  getPlaybackState() {
    return {
      isPlaying: this.isPlaying,
      isPaused:
        speechSynthesis.paused ||
        (this.currentAudio instanceof Audio && this.currentAudio.paused),
      isSupported: this.isWebSpeechSupported(),
    };
  }
}

export default new VoiceService();
