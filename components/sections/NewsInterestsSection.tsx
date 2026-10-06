'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { newsCategories, type FeedSnapshot, type NewsCategoryId } from '@/app/data/news';
import { balanceSources } from '@/lib/news-feed.mjs';
import { requestDeadline } from '@/lib/request-deadline';
import { refreshLiveNews, validateSnapshot } from '@/lib/news-client';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const PAGE_SIZE = 6;

export default function NewsInterestsSection() {
  const [activeCategory, setActiveCategory] = useState<NewsCategoryId | 'all'>('all');
  const [snapshot, setSnapshot] = useState<FeedSnapshot | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    requestRef.current = controller;
    const deadline = requestDeadline(controller.signal, 6000);
    fetch(`${basePath}/news.json`, { signal: deadline.signal, cache: 'no-cache' })
      .then(response => { if (!response.ok) throw new Error('Snapshot unavailable'); return response.json(); })
      .then(data => { if (!controller.signal.aborted) setSnapshot(validateSnapshot(data)); })
      .catch(() => { if (!controller.signal.aborted) setLoadFailed(true); })
      .finally(() => { deadline.dispose(); if (!controller.signal.aborted) setLoading(false); });
    return () => { controller.abort(); requestRef.current?.abort(); deadline.dispose(); };
  }, []);

  const refresh = async () => {
    if (loading || refreshing) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setRefreshing(true);
    try {
      const next = await refreshLiveNews(snapshot, controller.signal);
      if (!controller.signal.aborted) { setSnapshot(next); setLoadFailed(false); setCurrentPage(0); }
    } catch { /* Aborted refresh leaves the last visible results intact. */ }
    finally { if (!controller.signal.aborted) setRefreshing(false); }
  };

  const articles = useMemo(() => activeCategory === 'all' ? balanceSources(snapshot?.articles ?? []) : (snapshot?.articles ?? []).filter(article => article.category === activeCategory), [snapshot, activeCategory]);
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const currentArticles = articles.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const loadedSources = snapshot?.sources.filter(source => source.status === 'ok').length ?? 0;
  const failedSources = snapshot?.sources.filter(source => source.status !== 'ok').length ?? 0;
  const fetchedTimes = (snapshot?.sources.map(source => source.fetchedAt).filter((time): time is string => Boolean(time)) ?? []).map(Date.parse);
  const lastFetched = fetchedTimes.length ? Math.max(...fetchedTimes) : null;
  const stale = fetchedTimes.some(time => Date.now() - time > 24 * 60 * 60 * 1000);
  const unavailable = !loading && (loadFailed || !loadedSources) && !snapshot?.articles.length;

  return (
    <section id="news" aria-labelledby="news-heading" className="relative bg-dark-950 py-18">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
          <h2 id="news-heading" className="mb-6 text-4xl font-bold text-white md:text-5xl">My Interests & Latest News</h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary-500 to-accent-400" />
          <p className="mt-6 text-lg text-gray-400">Latest available stories in tech, AI, startups, and development</p>
        </motion.div>

        <div className="mb-6 flex flex-wrap justify-center gap-3" aria-label="News categories">
          {[{ id: 'all' as const, label: 'All' }, ...newsCategories].map(category => (
            <button key={category.id} type="button" aria-pressed={activeCategory === category.id} onClick={() => { setActiveCategory(category.id); setCurrentPage(0); }} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-150 ${activeCategory === category.id ? 'border-primary-500 bg-primary-600 text-white' : 'border-primary-500/30 bg-dark-800 text-gray-300 hover:bg-primary-900'}`}>{category.label}</button>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-400">
          {lastFetched && <p>Sources last checked <time dateTime={new Date(lastFetched).toISOString()}>{new Date(lastFetched).toLocaleString()}</time>{stale ? ' · Includes saved stories older than 24 hours' : ''}</p>}
          <button type="button" disabled={loading || refreshing} onClick={refresh} className="rounded-lg border border-primary-500/40 px-4 py-2 font-medium text-primary-300 transition-colors hover:bg-primary-500/10 disabled:cursor-wait disabled:opacity-60">{refreshing ? 'Refreshing sources…' : 'Refresh sources'}</button>
        </div>

        <div aria-busy={loading || refreshing}>
          {(loading || refreshing) && (
            <div role="status" className="mb-8 flex items-center justify-center gap-3 rounded-xl border border-primary-500/20 bg-dark-800/50 p-6 text-primary-200">
              <span aria-hidden="true" className="news-loader h-6 w-6 rounded-full border-2 border-primary-500/30 border-t-primary-300" />
              {loading ? 'Loading the latest saved stories…' : 'Checking RSS sources. Saved stories stay available below.'}
            </div>
          )}
          {!loading && !unavailable && (failedSources > 0 || stale) && (
            <p role="status" className="mb-6 rounded-lg border border-primary-500/20 bg-primary-500/5 px-5 py-3 text-sm text-gray-300">{failedSources > 0 ? `${failedSources} sources could not be updated. ` : ''}Showing the latest available saved stories with their original publication dates.</p>
          )}
          {unavailable && (
            <div role="status" className="rounded-xl border border-primary-500/20 bg-dark-800/50 p-8 text-center text-gray-300">
              <p>News feeds are temporarily unavailable. Try refreshing or visit a source below.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-4">{newsCategories.map(category => <a key={category.id} href={category.feeds[0].url} target="_blank" rel="noopener noreferrer" className="text-primary-300 underline">{category.feeds[0].source} RSS</a>)}</div>
            </div>
          )}
          {!loading && !unavailable && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentArticles.length ? currentArticles.map(article => (
                <a key={article.url} href={article.url} target="_blank" rel="noopener noreferrer" className="group flex min-w-0 flex-col rounded-xl border border-primary-500/25 bg-dark-800/60 p-6 transition-colors duration-150 hover:border-primary-400">
                  <div className="mb-5 flex flex-wrap items-center gap-3 text-xs"><span className="rounded-full bg-primary-500/15 px-3 py-1 text-primary-300">{article.source.name}</span><time dateTime={article.publishedAt} className="text-gray-400">{new Date(article.publishedAt).toLocaleDateString()}</time></div>
                  <h3 className="mb-3 text-lg font-semibold leading-snug text-white group-hover:text-primary-300">{article.title}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-400">{article.description}</p>
                  <span className="text-sm font-medium text-primary-300">Read at {article.source.name} <span aria-hidden="true">↗</span></span>
                </a>
              )) : <div role="status" className="col-span-full rounded-xl border border-primary-500/20 bg-dark-800/50 p-10 text-center text-gray-400">No articles are currently available for this category.</div>}
            </div>
          )}
        </div>
        {totalPages > 1 && <nav aria-label="News pages" className="mt-8 flex items-center justify-center gap-5 text-sm">
          <button type="button" disabled={currentPage === 0} onClick={() => setCurrentPage(page => page - 1)} className="rounded-lg border border-primary-500/30 px-4 py-3 text-primary-300 hover:bg-primary-500/10 disabled:opacity-40">Previous page</button>
          <span className="text-gray-300" aria-live="polite">Page {currentPage + 1} of {totalPages}</span>
          <button type="button" disabled={currentPage + 1 >= totalPages} onClick={() => setCurrentPage(page => page + 1)} className="rounded-lg border border-primary-500/30 px-4 py-3 text-primary-300 hover:bg-primary-500/10 disabled:opacity-40">Next page</button>
        </nav>}
      </div>
    </section>
  );
}
