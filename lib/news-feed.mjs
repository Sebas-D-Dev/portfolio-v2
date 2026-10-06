/** Plain text only; feed HTML is never rendered. */
export function plainText(value, limit = 180) {
  if (typeof value !== 'string') return '';
  const clean = value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }[name])).replace(/\s+/g, ' ').trim();
  return clean.length > limit ? `${clean.slice(0, limit).replace(/\s+\S*$/, '')}…` : clean;
}
export function safeUrl(value) {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}
/** @param {Record<string, unknown>} item @param {{id: string, source: string, category: string}} feed */
export function normalizeArticle(item, feed, now = Date.now()) {
  const title = plainText(item.title, 180);
  const url = safeUrl(item.url);
  const date = typeof item.publishedAt === 'string' ? Date.parse(item.publishedAt) : NaN;
  if (!title || !url || !Number.isFinite(date) || date > now + 60 * 60 * 1000) return null;
  return { title, url, description: plainText(item.description), urlToImage: '', publishedAt: new Date(date).toISOString(), source: { id: feed.id, name: feed.source }, category: feed.category };
}
export function uniqueArticles(articles) {
  const seen = new Map();
  for (const article of articles.filter(Boolean).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))) {
    if (!seen.has(article.url)) seen.set(article.url, article);
  }
  return [...seen.values()];
}
