import {
  Play,
  Square,
  Clock,
  ExternalLink,
  FileText,
  Loader,
} from "lucide-react";
import VoiceService from "../services/VoiceService";
import NewsService from "../services/NewsService";
import { useState } from "react";

const NewsCard = ({
  article,
  onPlay,
  isPlaying,
  selectedVoice,
  onSummarize,
}) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizedArticle, setSummarizedArticle] = useState(article);

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

  const handleSummarize = async () => {
    if (
      summarizedArticle.summary &&
      summarizedArticle.summary !== article.description
    ) {
      // Already summarized, no need to do it again
      return;
    }

    setIsSummarizing(true);
    try {
      const summarized = await NewsService.summarizeArticle(article);
      setSummarizedArticle(summarized);
      if (onSummarize) {
        onSummarize(summarized);
      }
    } catch (error) {
      console.error("Error summarizing article:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const isArticleSummarized =
    summarizedArticle.summary &&
    summarizedArticle.summary !== article.description &&
    summarizedArticle.summary !== "Summary not available" &&
    !summarizedArticle.summary.includes("Summary not available");

  return (
    <article className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow duration-200">
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

          {/* Summary or Description */}
          <div className="mb-3">
            {isArticleSummarized && (
              <div className="mb-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  AI Summary:
                </p>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {summarizedArticle.summary}
                </p>
              </div>
            )}
            <p className="text-gray-600 leading-relaxed text-sm">
              {article.description}
            </p>
          </div>

          <div className="flex items-center text-xs text-gray-400 mb-3">
            <span className="font-medium text-primary-600">
              {article.source}
            </span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <div className="flex items-center justify-between mt-2 gap-2">
            <div className="flex items-center gap-2">
              {/* Summarize Button */}
              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                  isArticleSummarized
                    ? "bg-green-100 text-green-700 cursor-default"
                    : isSummarizing
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                {isSummarizing ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />{" "}
                    Summarizing...
                  </>
                ) : isArticleSummarized ? (
                  <>
                    <FileText className="h-4 w-4 mr-2" /> Summarized
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" /> Summarize
                  </>
                )}
              </button>

              {/* Play/Stop Button */}
              <button
                onClick={() => onPlay(summarizedArticle)}
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
            </div>

            {/* Read Full Article Link */}
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
