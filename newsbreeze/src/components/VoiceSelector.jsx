import { useState } from "react";
import { Play, Square, Volume2 } from "lucide-react";
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

      VoiceService.stopSpeech();
      setPlayingSample(voice.id);

      await VoiceService.synthesizeSpeech(voice.sample, voice.id);
      setPlayingSample(null);
    } catch (error) {
      console.error("Error playing sample:", error);
      setPlayingSample(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Volume2 className="h-5 w-5 mr-2 text-primary-600" />
          Celebrity Voices
        </h2>
        {isPlaying && (
          <button
            onClick={onStop}
            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors duration-200"
          >
            <Square className="h-3 w-3 mr-1" />
            Stop
          </button>
        )}
      </div>

      <div className="space-y-3">
        {voices.map((voice) => (
          <div
            key={voice.id}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedVoice === voice.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
            onClick={() => handleVoiceSelect(voice.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={voice.avatar}
                  alt={voice.name}
                  className="celebrity-avatar"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{voice.name}</h3>
                  <p className="text-sm text-gray-600">{voice.description}</p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaySample(voice);
                }}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  playingSample === voice.id
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
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

            {selectedVoice === voice.id && (
              <div className="mt-2 p-2 bg-primary-100 rounded text-sm text-primary-700">
                Selected: {voice.sample}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Click the play button to hear a voice sample.
          Select a voice and then play any news article to hear it in that
          celebrity's style.
        </p>
      </div>
    </div>
  );
};

export default VoiceSelector;
