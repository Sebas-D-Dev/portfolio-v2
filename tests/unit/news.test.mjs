import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFeed } from '../../scripts/refresh-news.mjs';
import { normalizeArticle, safeUrl, uniqueArticles, plainText, balanceSources } from '../../lib/news-feed.mjs';
const feed = { id: 'test', source: 'Test feed', category: 'tech' };
const now = Date.parse('2026-10-06T12:00:00Z');
test('RSS keeps dated older articles, strips markup, deduplicates and excludes unsafe/future items', () => {
  const xml = `<rss><channel><item><title>Useful &amp; real</title><link>https://news.example/article</link><pubDate>Tue, 29 Sep 2026 12:00:00 GMT</pubDate><description><![CDATA[<b>Details</b><script>alert(1)</script>]]></description></item><item><title>Duplicate</title><link>https://news.example/article</link><pubDate>Tue, 29 Sep 2026 12:00:00 GMT</pubDate></item><item><title>Unsafe</title><link>javascript:alert(1)</link><pubDate>Tue, 06 Oct 2026 12:00:00 GMT</pubDate></item><item><title>Future</title><link>https://news.example/future</link><pubDate>2099-01-01</pubDate></item></channel></rss>`;
  const items = parseFeed(xml, feed, now);
  assert.equal(items.length, 1);
  assert.equal(items[0].publishedAt, '2026-09-29T12:00:00.000Z');
});
test('Atom chooses alternate HTML link, not the feed self link', () => {
  const result = parseFeed('<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Atom story</title><link rel="self" href="https://news.example/feed"/><link rel="alternate" href="https://news.example/story"/><updated>2026-10-06T10:00:00Z</updated><summary>Summary</summary></entry></feed>', feed, now);
  assert.equal(result[0].url, 'https://news.example/story');
});
test('valid empty feeds differ from malformed XML, HTML, entities and oversized responses', () => {
  assert.deepEqual(parseFeed('<rss><channel/></rss>', feed, now), []);
  for (const xml of ['<html><body>Not RSS</body></html>', '<rss>', '<!DOCTYPE rss><rss/>', '<!ENTITY name "value"><rss/>', ' '.repeat(2_000_001)]) assert.throws(() => parseFeed(xml, feed, now));
});
test('normalization allows only credential-free HTTPS links and finite publication dates', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,x', 'http://insecure.example', 'https://user:pass@news.example']) assert.equal(safeUrl(url), '');
  assert.equal(normalizeArticle({ title: 'Missing date', url: 'https://news.example' }, feed, now), null);
  assert.equal(normalizeArticle({ title: 'Bad date', url: 'https://news.example', publishedAt: 'not-a-date' }, feed, now), null);
});


test('newest publication survives duplicate URLs regardless of source order', () => {
  const newer = normalizeArticle({ title: 'Newer', url: 'https://news.example/same', publishedAt: '2026-10-06T10:00:00Z' }, feed, now);
  const older = normalizeArticle({ title: 'Older', url: 'https://news.example/same', publishedAt: '2026-10-01T10:00:00Z' }, feed, now);
  assert.equal(uniqueArticles([newer, older])[0].title, 'Newer');
  assert.equal(uniqueArticles([older, newer])[0].title, 'Newer');
});

test('namespaced RDF dates and prefixed Atom fields are supported', () => {
  const rdf = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/"><item><title>RDF story</title><link>https://news.example/rdf</link><dc:date>2026-10-06T10:00:00Z</dc:date></item></rdf:RDF>';
  assert.equal(parseFeed(rdf, feed, now)[0].title, 'RDF story');
  const atom = '<a:feed xmlns:a="http://www.w3.org/2005/Atom"><a:entry><a:title>Prefixed story</a:title><a:link href="https://news.example/atom"/><a:updated>2026-10-06T10:00:00Z</a:updated></a:entry></a:feed>';
  assert.equal(parseFeed(atom, feed, now)[0].title, 'Prefixed story');
});


test('display excerpts end at a word boundary with an ellipsis and no executable markup', () => {
  assert.equal(plainText('<b>Clear words</b><script>bad()</script>', 50), 'Clear words');
  assert.equal(plainText('A useful explanation with more detail', 20), 'A useful…');
});


test('All view balances prolific publishers without losing their stories', () => {
  const items = ['a', 'a', 'a', 'b', 'c'].map((id, index) => ({ source: { id }, publishedAt: new Date(now - index * 1000).toISOString(), title: `${id}-${index}` }));
  const balanced = balanceSources(items);
  assert.deepEqual(balanced.slice(0, 3).map(article => article.source.id), ['a', 'b', 'c']);
  assert.equal(balanced.length, items.length);
});
