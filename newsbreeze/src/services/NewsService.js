import axios from "axios";

class NewsService {
  constructor() {
    this.newsApiKey = import.meta.env.VITE_NEWS_API_KEY || "demo_key";
    this.huggingFaceApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || "";
    this.cnnNewsApiUrl = "https://saurav.tech/NewsAPI/everything/cnn.json";
    this.summarizationApiUrl =
      "https://api-inference.huggingface.co/models/Falconsai/text_summarization";
  }

  async fetchTopHeadlines(category = "general", country = "us") {
    try {
      const response = await axios.get(this.cnnNewsApiUrl);

      if (response.data.status === "ok" && response.data.articles) {
        let articles = response.data.articles;

        if (category !== "general") {
          articles = this.filterArticlesByCategory(articles, category);
        }

        articles = articles.slice(0, 10);

        return articles.map((article, index) => ({
          id: article.url || `cnn-${index}`,
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source?.name || "CNN",
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching CNN news:", error);
      return this.getDemoNews();
    }
  }

  filterArticlesByCategory(articles, category) {
    const categoryKeywords = {
      technology: [
        "technology",
        "tech",
        "ai",
        "artificial intelligence",
        "computer",
        "software",
        "digital",
        "cyber",
      ],
      business: [
        "business",
        "economy",
        "economic",
        "finance",
        "financial",
        "market",
        "trade",
        "company",
        "corporate",
      ],
      health: [
        "health",
        "medical",
        "medicine",
        "healthcare",
        "hospital",
        "doctor",
        "disease",
        "virus",
        "vaccine",
      ],
      science: [
        "science",
        "research",
        "study",
        "discovery",
        "scientist",
        "space",
        "climate",
        "environment",
      ],
      sports: [
        "sports",
        "football",
        "basketball",
        "baseball",
        "soccer",
        "game",
        "team",
        "player",
        "championship",
      ],
      entertainment: [
        "entertainment",
        "movie",
        "music",
        "celebrity",
        "actor",
        "actress",
        "film",
        "show",
        "concert",
      ],
    };

    const keywords = categoryKeywords[category] || [];
    if (keywords.length === 0) return articles;

    return articles.filter((article) => {
      const searchText =
        `${article.title} ${article.description}`.toLowerCase();
      return keywords.some((keyword) => searchText.includes(keyword));
    });
  }

  async summarizeText(text, maxLength = 100) {
    if (!this.huggingFaceApiKey) {
      const sentences = text.split(". ");
      return sentences.slice(0, 2).join(". ") + ".";
    }

    try {
      const response = await axios.post(
        this.summarizationApiUrl,
        {
          inputs: text,
          parameters: {
            max_length: maxLength,
            min_length: 30,
            do_sample: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.huggingFaceApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return (
        response.data[0]?.summary_text || text.substring(0, maxLength) + "..."
      );
    } catch (error) {
      console.error("Error summarizing text:", error);
      return text.substring(0, maxLength) + "...";
    }
  }

  async summarizeArticle(article) {
    try {
      const textToSummarize =
        article.content || article.description || article.title;
      const summary = await this.summarizeText(textToSummarize, 150);
      return {
        ...article,
        summary,
      };
    } catch (error) {
      console.error("Error summarizing article:", error);
      return {
        ...article,
        summary: article.description || "Summary not available",
      };
    }
  }

  async fetchAndSummarizeNews(category = "general") {
    try {
      // Just fetch articles without auto-summarizing
      const articles = await this.fetchTopHeadlines(category);
      return articles;
    } catch (error) {
      console.error("Error fetching news:", error);
      return this.getDemoNews();
    }
  }

  getDemoNews() {
    return [
      {
        id: "demo-1",
        title: "Revolutionary AI Technology Transforms Healthcare",
        description:
          "New artificial intelligence breakthrough promises to revolutionize medical diagnosis and treatment.",
        summary:
          "AI technology is making significant advances in healthcare, improving diagnosis accuracy and treatment outcomes.",
        url: "#",
        urlToImage:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
        publishedAt: new Date().toISOString(),
        source: "Tech News Daily",
      },
      {
        id: "demo-2",
        title: "Climate Change Summit Reaches Historic Agreement",
        description:
          "World leaders unite on ambitious climate goals in landmark international summit.",
        summary:
          "Global leaders have reached a historic agreement on climate action with ambitious new targets.",
        url: "#",
        urlToImage:
          "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e2?w=400",
        publishedAt: new Date().toISOString(),
        source: "Global News Network",
      },
      {
        id: "demo-3",
        title: "Space Exploration Reaches New Milestone",
        description:
          "Private space company achieves breakthrough in interplanetary travel technology.",
        summary:
          "A private space company has achieved a major breakthrough in interplanetary travel capabilities.",
        url: "#",
        urlToImage:
          "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
        publishedAt: new Date().toISOString(),
        source: "Space Today",
      },
    ];
  }

  getNewsCategories() {
    return [
      { id: "general", name: "General", icon: "📰" },
      { id: "technology", name: "Technology", icon: "💻" },
      { id: "business", name: "Business", icon: "💼" },
      { id: "health", name: "Health", icon: "🏥" },
      { id: "science", name: "Science", icon: "🔬" },
      { id: "sports", name: "Sports", icon: "⚽" },
      { id: "entertainment", name: "Entertainment", icon: "🎭" },
    ];
  }
}

export default new NewsService();
