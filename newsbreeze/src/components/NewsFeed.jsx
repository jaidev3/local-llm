import NewsCard from "./NewsCard";

const NewsFeed = ({
  articles,
  onPlayArticle,
  playingArticleId,
  selectedVoice,
}) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Articles Found
        </h3>
        <p className="text-gray-600">
          Try selecting a different category or refreshing the news feed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Latest Headlines</h2>
        <span className="text-sm text-gray-600">
          {articles.length} articles
        </span>
      </div>

      <div className="grid gap-6">
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onPlay={() => onPlayArticle(article)}
            isPlaying={playingArticleId === article.id}
            selectedVoice={selectedVoice}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
