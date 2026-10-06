import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import feeds from '../app/data/feeds.json' with { type: 'json' };
import { normalizeArticle, uniqueArticles } from '../lib/news-feed.mjs';

const MAX_BYTES = 2_000_000;
const list = value => Array.isArray(value) ? value : value ? [value] : [];
const text = value => typeof value === 'string' ? value : value?.['#text'] ?? '';
export function parseFeed(xml, feed, now = Date.now()) {
  if (xml.length > MAX_BYTES || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Unsupported or oversized XML');
  if (XMLValidator.validate(xml) !== true) throw new Error('Invalid XML');
  const parsed = new XMLParser({ ignoreAttributes: false, parseTagValue: false, removeNSPrefix: true }).parse(xml);
  const root = parsed.rss?.channel ?? parsed.feed ?? parsed.RDF;
  if (root == null) throw new Error('Response is not RSS or Atom');
  const items = list(root.item ?? root.entry).slice(0, 40);
  const articles = uniqueArticles(items.map(item => {
    const link = list(item.link).find(link => typeof link === 'string' || !link['@_rel'] || link['@_rel'] === 'alternate');
    return normalizeArticle({
      title: text(item.title), description: text(item.description ?? item.summary ?? item.content),
      url: typeof link === 'string' ? link : link?.['@_href'],
      publishedAt: text(item.pubDate ?? item.published ?? item.updated ?? item.date),
    }, feed, now);
  })).slice(0, 6);
  if (items.length && !articles.length) throw new Error('No valid dated articles');
  return articles;
}
async function fetchFeed(feed) {
  const response = await fetch(feed.url, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'PortfolioNewsReader/1.0 (RSS; https://github.com/Sebas-D-Dev/portfolio-v2)', Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' } });
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
  const reader = response.body.getReader();
  const chunks = []; let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) { await reader.cancel(); throw new Error('Feed exceeds size limit'); }
    chunks.push(Buffer.from(value));
  }
  return parseFeed(Buffer.concat(chunks).toString('utf8'), feed);
}
export async function refreshNews() {
  const destination = new URL('../public/news.json', import.meta.url);
  let previous = { articles: [], sources: [] };
  try { previous = JSON.parse(await readFile(destination, 'utf8')); } catch { /* first build */ }
  const generatedAt = new Date().toISOString();
  const results = [];
  let index = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (index < feeds.length) {
      const feed = feeds[index++];
      try {
        const articles = await fetchFeed(feed);
        results.push({ source: { id: feed.id, status: 'ok', fetchedAt: generatedAt }, articles });
        console.log(`RSS ${feed.id}: ${articles.length} articles`);
      } catch (error) {
        const source = previous.sources?.find(source => source.id === feed.id);
        const articles = (previous.articles ?? []).filter(article => article.source?.id === feed.id).map(article => normalizeArticle(article, feed)).filter(Boolean).slice(0, 6);
        results.push({ source: { id: feed.id, status: 'unavailable', fetchedAt: source?.fetchedAt ?? null }, articles });
        console.warn(`RSS ${feed.id}: unavailable (${error.message}); retained ${articles.length}`);
      }
    }
  }));
  const snapshot = { generatedAt, articles: uniqueArticles(results.flatMap(result => result.articles)), sources: results.map(result => result.source).sort((a, b) => a.id.localeCompare(b.id)) };
  if (!snapshot.articles.length && !snapshot.sources.some(source => source.status === 'ok')) {
    throw new Error('All RSS sources failed and no saved articles are available; refusing an empty replacement. Use NEWS_FETCH=false only for intentional offline builds.');
  }
  await mkdir(new URL('../public/', import.meta.url), { recursive: true });
  await writeFile(new URL('../public/news.json.tmp', import.meta.url), `${JSON.stringify(snapshot)}\n`);
  await rename(new URL('../public/news.json.tmp', import.meta.url), destination);
  return snapshot;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.env.NEWS_FETCH === 'false') console.log('RSS refresh skipped for offline/fixture build');
  else await refreshNews();
}
