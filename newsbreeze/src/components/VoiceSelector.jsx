import { useState } from "react";
import { Play, Square } from "lucide-react";
import VoiceService from "../services/VoiceService";

const VoiceSelector = ({
  voices,
  selectedVoice,
  onVoiceChange,
  isPlaying,
  onStop,
}) => {
  const [playingSample, setPlayingSample] = useState(null);

  const handleVoiceSelect = (voiceId) => {
    onVoiceChange(voiceId);
  };

  const handlePlaySample = async (voice) => {
    try {
      if (playingSample === voice.id) {
        VoiceService.stopSpeech();
        setPlayingSample(null);
        return;
      }

      // Stop any currently playing audio
      VoiceService.stopSpeech();
      setPlayingSample(voice.id);

      await VoiceService.synthesizeSpeech(voice.sample, voice.id);

      // Only clear the playing sample if this voice is still the one playing
      setPlayingSample((currentSample) =>
        currentSample === voice.id ? null : currentSample
      );
    } catch (error) {
      console.error("Error playing sample:", error);
      setPlayingSample(null);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-base font-semibold text-gray-900 mb-3">
        Celebrity Voices
      </h2>
      <div className="space-y-1">
        {voices.map((voice) => (
          <div
            key={voice.id}
            className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors duration-200 font-medium ${
              selectedVoice === voice.id
                ? "bg-primary-100 text-primary-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => handleVoiceSelect(voice.id)}
          >
            <span>{voice.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlaySample(voice);
              }}
              className={`ml-2 p-1 rounded transition-colors duration-200 ${
                playingSample === voice.id
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              disabled={isPlaying && playingSample !== voice.id}
            >
              {playingSample === voice.id ? (
                <Square className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 p-2 bg-gray-50 rounded">
        <p className="text-xs text-gray-500">
          Select a voice and play any news article to hear it in that
          celebrity's style.
        </p>
      </div>
      {isPlaying && (
        <button
          onClick={onStop}
          className="mt-3 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors duration-200"
        >
          <Square className="h-3 w-3 mr-1 inline" /> Stop
        </button>
      )}
    </div>
  );
};

export default VoiceSelector;
