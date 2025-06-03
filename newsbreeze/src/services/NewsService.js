import axios from "axios";

class NewsService {
  constructor() {
    this.newsApiKey = import.meta.env.VITE_NEWS_API_KEY || "demo_key";
    this.huggingFaceApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || "";
    this.newsApiUrl = "https://newsapi.org/v2/top-headlines";
    this.summarizationApiUrl =
      "https://api-inference.huggingface.co/models/Falconsai/text_summarization";
  }

  async fetchTopHeadlines(category = "general", country = "us") {
    try {
      const response = await axios.get(this.newsApiUrl, {
        params: {
          apiKey: this.newsApiKey,
          category,
          country,
          pageSize: 10,
        },
      });

      if (response.data.status === "ok") {
        return response.data.articles.map((article) => ({
          id: article.url,
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source.name,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching news:", error);
      // Fallback to demo data if API fails
      return this.getDemoNews();
    }
  }

  async summarizeText(text, maxLength = 100) {
    if (!this.huggingFaceApiKey) {
      // Simple extractive summarization fallback
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
      // Fallback to simple truncation
      return text.substring(0, maxLength) + "...";
    }
  }

  async fetchAndSummarizeNews(category = "general") {
    try {
      const articles = await this.fetchTopHeadlines(category);
      const summarizedArticles = await Promise.all(
        articles.map(async (article) => {
          const textToSummarize =
            article.content || article.description || article.title;
          const summary = await this.summarizeText(textToSummarize);
          return {
            ...article,
            summary,
          };
        })
      );
      return summarizedArticles;
    } catch (error) {
      console.error("Error fetching and summarizing news:", error);
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
