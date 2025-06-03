import { Play, Square, Clock, ExternalLink } from "lucide-react";
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
    <article className="bg-white rounded-lg p-4 border border-gray-100">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-2 leading-relaxed text-sm">
            {article.summary || article.description}
          </p>
          <div className="flex items-center text-xs text-gray-400 mb-2">
            <span className="font-medium text-primary-600">
              {article.source}
            </span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={onPlay}
              className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                isPlaying
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-primary-100 text-primary-700 hover:bg-primary-200"
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="h-4 w-4 mr-2" /> Stop Audio
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Play in{" "}
                  {getSelectedVoiceName()}'s Voice
                </>
              )}
            </button>
            {article.url && article.url !== "#" && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-gray-500 hover:text-primary-600 transition-colors duration-200"
              >
                Read Full Article
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
