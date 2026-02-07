// RSS Feed types and configuration
export interface RSSArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  category?: string;
}

export interface RSSFeed {
  id: string;
  label: string;
  url: string;
  source: string;
}

export const rssFeeds: Record<string, RSSFeed[]> = {
  'tech': [
    { id: 'techcrunch', label: 'TechCrunch', url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
    { id: 'engadget', label: 'Engadget', url: 'https://www.engadget.com/rss.xml', source: 'Engadget' },
    { id: 'zdnet', label: 'ZDNet', url: 'https://www.zdnet.com/news/rss.xml', source: 'ZDNet' },
  ],
  'ai': [
    { id: 'ai-news', label: 'AI News', url: 'https://www.artificialintelligence-news.com/feed/', source: 'AI News' },
    { id: 'ml-mastery', label: 'ML Mastery', url: 'https://machinelearningmastery.com/feed/', source: 'ML Mastery' },
  ],
  'startup': [
    { id: 'entrepreneur', label: 'Entrepreneur', url: 'https://www.entrepreneur.com/latest.rss', source: 'Entrepreneur' },
    { id: 'inc', label: 'Inc.com', url: 'https://www.inc.com/rss/', source: 'Inc.com' },
  ],
  'dev': [
    { id: 'dev-to', label: 'DEV Community', url: 'https://dev.to/feed', source: 'DEV.to' },
    { id: 'freecodcamp', label: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/rss/', source: 'freeCodeCamp' },
  ],
};

export const newsCategories = [
  { id: 'tech', label: 'Tech News', feeds: rssFeeds.tech },
  { id: 'ai', label: 'AI & ML', feeds: rssFeeds.ai },
  { id: 'startup', label: 'Startups', feeds: rssFeeds.startup },
  { id: 'dev', label: 'Web Dev', feeds: rssFeeds.dev },
] as const;

export type NewsCategoryId = typeof newsCategories[number]['id'];
