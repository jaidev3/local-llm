import axios from "axios";

class VoiceService {
  constructor() {
    this.huggingFaceApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || "";
    this.ttsApiUrl =
      "https://api-inference.huggingface.co/models/coqui/XTTS-v2";
    this.currentAudio = null;
    this.isPlaying = false;
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
    // For demo purposes, we'll use the Web Speech API with different settings
    // In production, you would call the actual coqui/XTTS-v2 API

    if (!this.isWebSpeechSupported()) {
      console.warn("Web Speech API not supported, using fallback");
      return this.playFallbackAudio(text);
    }

    try {
      // Stop any currently playing audio
      this.stopSpeech();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice based on celebrity selection
      const voiceConfig = this.getVoiceConfig(voiceId);
      utterance.rate = voiceConfig.rate;
      utterance.pitch = voiceConfig.pitch;
      utterance.volume = voiceConfig.volume;

      // Try to find a suitable voice
      const voices = speechSynthesis.getVoices();
      const selectedVoice =
        voices.find((voice) =>
          voiceConfig.preferredVoices.some((pref) =>
            voice.name.toLowerCase().includes(pref.toLowerCase())
          )
        ) || voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      return new Promise((resolve, reject) => {
        utterance.onend = () => {
          this.isPlaying = false;
          resolve();
        };

        utterance.onerror = (error) => {
          this.isPlaying = false;
          reject(error);
        };

        utterance.onstart = () => {
          this.isPlaying = true;
        };

        speechSynthesis.speak(utterance);
        this.currentAudio = utterance;
      });
    } catch (error) {
      console.error("Error synthesizing speech:", error);
      throw error;
    }
  }

  async synthesizeWithXTTS(text, voiceId) {
    // This would be the actual implementation with coqui/XTTS-v2
    // For now, we'll simulate the API call

    if (!this.huggingFaceApiKey) {
      throw new Error("Hugging Face API key required for XTTS-v2");
    }

    try {
      const response = await axios.post(
        this.ttsApiUrl,
        {
          inputs: text,
          parameters: {
            speaker_embedding: this.getSpeakerEmbedding(voiceId),
            language: "en",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.huggingFaceApiKey}`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      // Create audio from blob
      const audioBlob = new Blob([response.data], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      return this.playAudioFromUrl(audioUrl);
    } catch (error) {
      console.error("Error with XTTS synthesis:", error);
      // Fallback to Web Speech API
      return this.synthesizeSpeech(text, voiceId);
    }
  }

  getSpeakerEmbedding(voiceId) {
    // In a real implementation, these would be actual speaker embeddings
    // for the celebrity voices trained with XTTS-v2
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
        URL.revokeObjectURL(audioUrl);
        resolve();
      };

      audio.onerror = (error) => {
        this.isPlaying = false;
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
    // Simulate audio playback for demo
    console.log(`Playing audio: "${text}"`);
    this.isPlaying = true;

    return new Promise((resolve) => {
      const duration = Math.min(text.length * 50, 10000); // Simulate reading time
      setTimeout(() => {
        this.isPlaying = false;
        resolve();
      }, duration);
    });
  }

  stopSpeech() {
    if (this.currentAudio) {
      if (this.currentAudio instanceof SpeechSynthesisUtterance) {
        speechSynthesis.cancel();
      } else if (this.currentAudio instanceof Audio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      this.currentAudio = null;
    }
    this.isPlaying = false;
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
