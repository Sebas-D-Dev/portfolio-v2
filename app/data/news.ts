import feeds from './feeds.json';
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
  category: string;
}

export interface RSSFeed {
  id: string;
  label: string;
  url: string;
  source: string;
  category: string;
}

export const rssFeeds: Record<string, RSSFeed[]> = Object.fromEntries(['tech', 'ai', 'startup', 'dev'].map(category => [category, feeds.filter(feed => feed.category === category)]));

export const newsCategories = [
  { id: 'tech', label: 'Tech News', feeds: rssFeeds.tech },
  { id: 'ai', label: 'AI & ML', feeds: rssFeeds.ai },
  { id: 'startup', label: 'Startups', feeds: rssFeeds.startup },
  { id: 'dev', label: 'Web Dev', feeds: rssFeeds.dev },
] as const;

export type NewsCategoryId = typeof newsCategories[number]['id'];

export interface FeedSnapshot {
  generatedAt: string;
  articles: RSSArticle[];
  sources: { id: string; status: 'ok' | 'unavailable'; fetchedAt: string | null }[];
}
