import { useState, useEffect } from "react";
import Header from "./components/Header";
import NewsFeed from "./components/NewsFeed";
import VoiceSelector from "./components/VoiceSelector";
import CategoryFilter from "./components/CategoryFilter";
import LoadingSpinner from "./components/LoadingSpinner";
import NewsService from "./services/NewsService";
import VoiceService from "./services/VoiceService";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [selectedVoice, setSelectedVoice] = useState("morgan_freeman");
  const [playingArticleId, setPlayingArticleId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const articles = await NewsService.fetchAndSummarizeNews(
        selectedCategory
      );
      setNews(articles);
    } catch (err) {
      setError("Failed to load news. Please try again.");
      console.error("Error loading news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPlayingArticleId(null); // Stop any playing audio when switching categories
    VoiceService.stopSpeech();
  };

  const handleVoiceChange = (voiceId) => {
    setSelectedVoice(voiceId);
  };

  const handlePlayArticle = async (article) => {
    try {
      // If this article is currently playing, stop it
      if (playingArticleId === article.id) {
        VoiceService.stopSpeech();
        setPlayingArticleId(null);
        return;
      }

      // Stop any currently playing audio
      VoiceService.stopSpeech();
      setPlayingArticleId(null);

      // Start playing the new article
      const currentArticleId = article.id;
      setPlayingArticleId(currentArticleId);

      const textToRead = `${article.title}. ${
        article.summary || article.description || ""
      }`;
      await VoiceService.synthesizeSpeech(textToRead, selectedVoice);

      // Only clear playing state if this article is still the one playing
      // (user might have clicked another article while this one was playing)
      setPlayingArticleId((currentId) =>
        currentId === currentArticleId ? null : currentId
      );
    } catch (error) {
      console.error("Error playing article:", error);
      setPlayingArticleId(null);
    }
  };

  const handleStopAudio = () => {
    VoiceService.stopSpeech();
    setPlayingArticleId(null);
  };

  const handleRefresh = () => {
    loadNews();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={handleRefresh} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <VoiceSelector
              voices={VoiceService.getCelebrityVoices()}
              selectedVoice={selectedVoice}
              onVoiceChange={handleVoiceChange}
              isPlaying={playingArticleId !== null}
              onStop={handleStopAudio}
            />

            <CategoryFilter
              categories={NewsService.getNewsCategories()}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <LoadingSpinner />
            ) : (
              <NewsFeed
                articles={news}
                onPlayArticle={handlePlayArticle}
                playingArticleId={playingArticleId}
                selectedVoice={selectedVoice}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
