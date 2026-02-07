'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { newsCategories, type RSSArticle, type NewsCategoryId } from '@/app/data/news';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
  exit: { opacity: 0, x: 50 },
};

export default function NewsInterestsSection() {
  const [activeCategory, setActiveCategory] = useState<NewsCategoryId | 'all'>('all');
  const [allArticles, setAllArticles] = useState<RSSArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<RSSArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const currentArticles = filteredArticles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Filter articles by date (last 3 days)
  const filterByDate = (articles: RSSArticle[]) => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    return articles.filter(article => {
      const articleDate = new Date(article.publishedAt);
      return articleDate >= threeDaysAgo;
    }).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  };

  // Fetch all feeds once on mount
  useEffect(() => {
    const fetchAllNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedArticles: RSSArticle[] = [];
        
        // Fetch from all categories at once
        for (const category of newsCategories) {
          for (const feed of category.feeds) {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 10000);
              
              const response = await fetch(
                `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`,
                { signal: controller.signal }
              );
              
              clearTimeout(timeoutId);
              
              if (response.ok) {
                const text = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, 'text/xml');
                const items = xmlDoc.querySelectorAll('item, entry');
                
                if (items.length > 0) {
                  const articles = Array.from(items).slice(0, 3).map((item) => {
                    const getTextContent = (tagName: string) => {
                      const element = item.querySelector(tagName);
                      return element?.textContent || '';
                    };
                    
                    // Extract image from various possible locations
                    let imageUrl = '';
                    const mediaContent = item.querySelector('media\\:content, content');
                    const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail');
                    const enclosure = item.querySelector('enclosure[type^="image"]');
                    
                    if (mediaContent) {
                      imageUrl = mediaContent.getAttribute('url') || '';
                    } else if (mediaThumbnail) {
                      imageUrl = mediaThumbnail.getAttribute('url') || '';
                    } else if (enclosure) {
                      imageUrl = enclosure.getAttribute('url') || '';
                    } else {
                      // Try to extract from description
                      const description = getTextContent('description');
                      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
                      if (imgMatch) {
                        imageUrl = imgMatch[1];
                      }
                    }
                    
                    const description = getTextContent('description') || getTextContent('summary');
                    const cleanDescription = description.replace(/<[^>]*>/g, '');
                    
                    return {
                      title: getTextContent('title'),
                      description: cleanDescription.substring(0, 150) + (cleanDescription.length > 150 ? '...' : ''),
                      url: getTextContent('link') || item.querySelector('link')?.getAttribute('href') || '',
                      urlToImage: imageUrl,
                      publishedAt: getTextContent('pubDate') || getTextContent('published') || new Date().toISOString(),
                      source: { id: feed.id, name: feed.source },
                      category: category.id,
                    };
                  });
                  fetchedArticles.push(...articles);
                }
              }
            } catch (feedError) {
              console.warn(`Failed to fetch ${feed.source}:`, feedError);
            }
          }
        }

        setAllArticles(fetchedArticles);
      } catch (err) {
        console.error('RSS fetch failed:', err);
        setError('Failed to load news articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, []); // Only fetch once on mount

  // Filter articles when category changes
  useEffect(() => {
    if (allArticles.length === 0) return;
    
    let filtered: RSSArticle[];
    
    if (activeCategory === 'all') {
      // Show all articles
      filtered = allArticles;
    } else {
      const category = newsCategories.find((c) => c.id === activeCategory);
      if (!category) return;

      const feedIds = category.feeds.map(f => f.id);
      filtered = allArticles.filter(article => 
        feedIds.includes(article.source.id)
      );
    }
    
    // Filter by date (last 3 days) and sort
    const dateFiltered = filterByDate(filtered);
    setFilteredArticles(dateFiltered);
    setCurrentPage(0); // Reset to first page when category changes
  }, [activeCategory, allArticles]);

  // Auto-advance pagination every 30 seconds
  useEffect(() => {
    if (totalPages <= 1) return; // Don't auto-advance if only one page

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [totalPages]);

  // Manual page navigation (resets auto-timer)
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="relative bg-dark-950 py-18">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 id="news" className="mb-6 text-4xl font-bold text-white md:text-5xl">
            My Interests & Latest News
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary-500 to-accent-400"></div>
          <p className="mt-6 text-lg text-gray-400">
            Stay updated with the latest in tech, AI, and more
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/50 scale-105'
                : 'border-2 border-primary-500/30 bg-dark-800/50 text-gray-300 hover:border-primary-500 hover:bg-primary-500/10 hover:text-primary-400 hover:scale-105'
            }`}
          >
            All
          </button>
          {newsCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/50 scale-105'
                  : 'border-2 border-primary-500/30 bg-dark-800/50 text-gray-300 hover:border-primary-500 hover:bg-primary-500/10 hover:text-primary-400 hover:scale-105'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-xl bg-dark-800/50"
              ></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-400">
            <p>{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${currentPage}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-10"
              >
                {currentArticles.length === 0 ? (
                  <div className="col-span-full rounded-xl border border-primary-500/20 bg-dark-800/50 p-12 text-center text-gray-400">
                    <p>No recent articles found for this category.</p>
                    <p className="mt-2 text-sm text-gray-500">Showing articles from the last 3 days</p>
                  </div>
                ) : (
                  currentArticles.map((article, index) => (
                  <motion.a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={cardVariants}
                    whileHover={{ y: -10 }}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-primary-500/20 bg-dark-800/50 backdrop-blur-sm transition-all hover:border-primary-500 hover:shadow-glow-blue"
                  >
                    {/* Article Image */}
                    {article.urlToImage ? (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.urlToImage}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                        <svg
                          className="h-16 w-16 text-primary-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="flex flex-1 flex-col p-8">
                      {/* Source & Date */}
                      <div className="mb-3 flex items-center justify-between text-xs">
                        <span className="rounded-full bg-primary-500/20 px-3 py-1 font-medium text-primary-300">
                          {article.source.name}
                        </span>
                        <span className="text-gray-500">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-2 line-clamp-3 text-lg font-semibold text-white transition-colors group-hover:text-primary-400">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-400">
                        {article.description || 'No description available.'}
                      </p>

                      {/* Read More Link */}
                      <div className="text-sm font-medium text-primary-400">
                        <span>Read more</span>
                      </div>
                    </div>
                  </motion.a>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex items-center justify-center gap-4"
            >
              {/* Previous Button */}
              <button
                onClick={prevPage}
                className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-500/30 bg-dark-800/50 text-primary-400 transition-all duration-300 hover:border-primary-500 hover:bg-primary-500/10 hover:scale-110"
                aria-label="Previous page"
              >
                <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Indicators */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      i === currentPage
                        ? 'w-8 bg-gradient-to-r from-primary-500 to-accent-400'
                        : 'w-3 bg-primary-500/30 hover:bg-primary-500/50'
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextPage}
                className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-500/30 bg-dark-800/50 text-primary-400 transition-all duration-300 hover:border-primary-500 hover:bg-primary-500/10 hover:scale-110"
                aria-label="Next page"
              >
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          )}

          {/* Auto-advance indicator */}
          {totalPages > 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center text-sm text-gray-500"
            >
              Showing page {currentPage + 1} of {totalPages} • Auto-advancing every 30s
            </motion.p>
          )}
          </>
        )}
      </div>
    </section>
  );
}
