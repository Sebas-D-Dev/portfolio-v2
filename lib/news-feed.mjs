/** Plain text only; feed HTML is never rendered. */
function decodeNumericEntity(entity, digits) {
  const hexadecimal = digits[0].toLowerCase() === 'x';
  const codePoint = Number.parseInt(hexadecimal ? digits.slice(1) : digits, hexadecimal ? 16 : 10);
  // Leave invalid Unicode scalars as text instead of throwing or emitting NUL.
  if (codePoint <= 0 || codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) return entity;
  return String.fromCodePoint(codePoint);
}

export function plainText(value, limit = 180) {
  if (typeof value !== 'string') return '';
  const clean = value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }[name])).replace(/&#(x[0-9a-f]+|[0-9]+);/gi, decodeNumericEntity).replace(/\s+/g, ' ').trim();
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

// Keep the All view useful when one publisher posts much more frequently.
// Each round takes the newest remaining story from each source.
export function balanceSources(articles) {
  const groups = new Map();
  for (const article of articles) {
    if (!groups.has(article.source.id)) groups.set(article.source.id, []);
    groups.get(article.source.id).push(article);
  }
  const result = [];
  for (let round = 0; round < Math.max(0, ...[...groups.values()].map(group => group.length)); round++) {
    result.push(...[...groups.values()].map(group => group[round]).filter(Boolean).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)));
  }
  return result;
}
