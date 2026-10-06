import { requestDeadline } from './request-deadline';
import feeds from '@/app/data/feeds.json';
import type { FeedSnapshot, RSSArticle } from '@/app/data/news';
import { normalizeArticle, uniqueArticles } from './news-feed.mjs';

export function validateSnapshot(value: unknown): FeedSnapshot {
  if (!value || typeof value !== 'object') throw new Error('Invalid snapshot');
  const data = value as FeedSnapshot;
  if (!Array.isArray(data.articles) || !Array.isArray(data.sources) || !Number.isFinite(Date.parse(data.generatedAt))) throw new Error('Invalid snapshot');
  return {
    generatedAt: data.generatedAt,
    articles: uniqueArticles(data.articles.slice(0, 100).flatMap(article => {
      const feed = feeds.find(feed => feed.id === article?.source?.id);
      return feed ? [normalizeArticle(article as unknown as Record<string, unknown>, feed)] : [];
    })),
    sources: feeds.map(feed => {
      const source = data.sources.find(source => source?.id === feed.id);
      return { id: feed.id, status: source?.status === 'ok' ? 'ok' : 'unavailable', fetchedAt: source?.fetchedAt && Number.isFinite(Date.parse(source.fetchedAt)) ? source.fetchedAt : null };
    }),
  };
}

// Only a user-requested refresh calls the existing public RSS proxy. The saved
// same-origin snapshot stays visible when one or all sources fail.
export async function refreshLiveNews(previous: FeedSnapshot | null, signal: AbortSignal): Promise<FeedSnapshot> {
  const generatedAt = new Date().toISOString();
  const articles: RSSArticle[] = [];
  const sources: FeedSnapshot['sources'] = [];
  let index = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (index < feeds.length && !signal.aborted) {
      const feed = feeds[index++];
      const deadline = requestDeadline(signal, 5000);
      try {
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`, { signal: deadline.signal });
        if (!response.ok) throw new Error('Feed unavailable');
        const xml = await response.text();
        if (xml.length > 2_000_000 || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Unsupported XML');
        const doc = new DOMParser().parseFromString(xml, 'text/xml');
        if (doc.querySelector('parsererror') || !['rss', 'feed', 'RDF'].includes(doc.documentElement.localName)) throw new Error('Invalid feed');
        const items = Array.from(doc.getElementsByTagName('*')).filter(element => ['item', 'entry'].includes(element.localName)).slice(0, 40);
        const parsed = items.map(item => {
          const text = (tag: string) => Array.from(item.children).find(element => element.localName === tag)?.textContent || '';
          const link = Array.from(item.children).filter(element => element.localName === 'link').find(link => !link.getAttribute('rel') || link.getAttribute('rel') === 'alternate');
          return normalizeArticle({ title: text('title'), url: link?.getAttribute('href') || link?.textContent || '', description: text('description') || text('summary'), publishedAt: text('pubDate') || text('published') || text('updated') || text('date') }, feed);
        });
        const valid = uniqueArticles(parsed).slice(0, 6);
        if (items.length && !valid.length) throw new Error('No valid dated articles');
        articles.push(...valid);
        sources.push({ id: feed.id, status: 'ok', fetchedAt: generatedAt });
      } catch {
        articles.push(...(previous?.articles.filter(article => article.source.id === feed.id) ?? []));
        sources.push({ id: feed.id, status: 'unavailable', fetchedAt: previous?.sources.find(source => source.id === feed.id)?.fetchedAt ?? null });
      } finally { deadline.dispose(); }
    }
  }));
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
  return { generatedAt, articles: uniqueArticles(articles), sources };
}
