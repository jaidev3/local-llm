import { Play, Square, Clock, ExternalLink, Volume2 } from "lucide-react";
import VoiceService from "../services/VoiceService";

const NewsCard = ({ article, onPlay, isPlaying, selectedVoice }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSelectedVoiceName = () => {
    const voices = VoiceService.getCelebrityVoices();
    const voice = voices.find((v) => v.id === selectedVoice);
    return voice ? voice.name : "Selected Voice";
  };

  return (
    <article className="news-card">
      <div className="flex gap-4">
        {/* Article Image */}
        {article.urlToImage && (
          <div className="flex-shrink-0">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-32 h-24 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                {article.title}
              </h3>

              <p className="text-gray-600 mb-3 leading-relaxed">
                {article.summary || article.description}
              </p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="font-medium text-primary-600">
                  {article.source}
                </span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onPlay}
                className={`voice-button ${
                  isPlaying
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-primary-600 hover:bg-primary-700"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Audio
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Play in {getSelectedVoiceName()}'s Voice
                  </>
                )}
              </button>

              {isPlaying && (
                <div className="flex items-center text-sm text-gray-600">
                  <Volume2 className="h-4 w-4 mr-1 text-primary-600" />
                  <span>Playing as {getSelectedVoiceName()}</span>
                </div>
              )}
            </div>

            {article.url && article.url !== "#" && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                Read Full Article
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Audio Visualization */}
      {isPlaying && (
        <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex space-x-1 mr-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary-600 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-primary-700 font-medium">
                Now playing in {getSelectedVoiceName()}'s voice...
              </span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default NewsCard;
