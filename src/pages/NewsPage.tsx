import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNewsStore } from '@/store/news';
import type { NewsItem } from '@/types';

export default function NewsPage() {
  const { getFilteredNews, toggleRead, toggleFavorite, setSelectedCategory, setSearchQuery, selectedCategory, searchQuery, markAllRead, categories, unreadCount, favoriteCount, refresh, lastRefresh, isRefreshing } = useNewsStore();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorite'>('all');

  const filteredNews = getFilteredNews().filter((item) => {
    if (activeTab === 'favorite') return item.isFavorite;
    return true;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const handleSelectNews = (item: NewsItem) => {
    setSelectedNews(item);
    if (!item.isRead) {
      toggleRead(item.id);
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      '科技': 'var(--soft-blue)',
      'AI': 'var(--warm-orange)',
      '媒体': 'var(--moss-green)',
      '广告': 'var(--soft-blue)',
      '营销': 'var(--warm-orange)',
      '汽车': 'var(--moss-green)',
      '社会': 'var(--cream-text-muted)',
      '平台': 'var(--soft-blue)',
    };
    return colors[cat] || 'var(--cream-text-muted)';
  };

  const hasEnglish = (item: NewsItem) => {
    return item.titleEn || item.summaryEn || item.contentEn;
  };

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h2
            className="m-0"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--cream-dark)',
            }}
          >
            行业日报
          </h2>
          <span
            className="px-2.5 py-0.5 rounded-full"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--warm-orange)',
              background: 'color-mix(in srgb, var(--warm-orange) 15%, transparent)',
            }}
          >
            {unreadCount} 条未读
          </span>
          <span
            className="px-2.5 py-0.5 rounded-full"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--cream-text-muted)',
              background: 'var(--cream-border)',
            }}
            title="当前为演示数据，接入API后将显示实时新闻"
          >
            示例数据
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cream-text-muted)', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索新闻..."
              className="pl-8 pr-3 py-2 rounded-lg outline-none transition-all w-full min-h-11"
              style={{
                background: 'var(--cream-bg)',
                border: '1px solid var(--cream-border)',
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.8125rem',
                color: 'var(--cream-dark)',
              }}
            />
          </div>
          <button
            type="button"
            onClick={markAllRead}
            className="px-3 py-2 rounded-lg transition-all min-h-11 w-full sm:w-auto"
            style={{
              background: 'transparent',
              color: 'var(--soft-blue)',
              border: '1px solid var(--cream-border)',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            全部已读
          </button>
          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all min-h-11 w-full sm:w-auto"
            style={{
              background: 'transparent',
              color: 'var(--moss-green)',
              border: '1px solid var(--cream-border)',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
            }}
          >
            {isRefreshing ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            )}
            刷新
          </button>
          <span
            className="hidden sm:block"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            {formatDate(lastRefresh)} 更新
          </span>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <motion.div
          className="w-full lg:w-[360px] flex flex-col min-h-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex gap-1 mb-3 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 sm:pb-0">
            {(['all', 'favorite'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 min-h-11"
                style={{
                  background: activeTab === tab ? 'var(--cream-bg)' : 'transparent',
                  color: activeTab === tab ? 'var(--cream-dark)' : 'var(--cream-text-muted)',
                  border: `1px solid ${activeTab === tab ? 'var(--cream-border)' : 'transparent'}`,
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {tab === 'all' ? '全部' : '收藏'}
                <span
                  style={{
                    fontSize: '0.75rem',
                    opacity: 0.7,
                  }}
                >
                  {tab === 'all' ? filteredNews.length : favoriteCount}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 mb-3 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="px-2.5 py-1 rounded-full transition-all whitespace-nowrap flex-shrink-0 min-h-11"
                style={{
                  background: selectedCategory === cat
                    ? `color-mix(in srgb, ${getCategoryColor(cat)} 15%, transparent)`
                    : 'var(--cream-bg)',
                  color: selectedCategory === cat ? getCategoryColor(cat) : 'var(--cream-text-muted)',
                  border: `1px solid ${selectedCategory === cat ? getCategoryColor(cat) : 'var(--cream-border)'}`,
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div
            className="flex-1 space-y-2 overflow-y-auto pr-1"
            style={{ minHeight: 0 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="p-4 rounded-2xl cursor-pointer group relative"
                  style={{
                    background: selectedNews?.id === item.id ? 'var(--cream-bg)' : 'var(--cream-bg)',
                    border: `1px solid ${selectedNews?.id === item.id ? 'var(--soft-blue)' : 'var(--cream-border)'}`,
                  }}
                  onClick={() => handleSelectNews(item)}
                  whileTap={{ scale: 0.97 }}
                >
                  {!item.isRead && (
                    <div
                      className="absolute top-4 right-4 w-2 h-2 rounded-full"
                      style={{ background: 'var(--warm-orange)' }}
                    />
                  )}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: getCategoryColor(item.category),
                        background: `color-mix(in srgb, ${getCategoryColor(item.category)} 12%, transparent)`,
                      }}
                    >
                      {item.category}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      {item.source}
                    </span>
                    {hasEnglish(item) && (
                      <span
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: 'var(--moss-green)',
                          background: 'color-mix(in srgb, var(--moss-green) 12%, transparent)',
                        }}
                      >
                        EN
                      </span>
                    )}
                  </div>
                  <h4
                    className="m-0 mb-2"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--cream-dark)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      opacity: item.isRead ? 0.7 : 1,
                    }}
                  >
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--cream-text-muted)',
                          background: 'rgba(106,155,204,0.08)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      {formatDate(item.publishDate)}
                    </span>
                    {item.isFavorite && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--warm-orange)" stroke="var(--warm-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div
            className="flex-1 rounded-2xl p-4 sm:p-6 flex flex-col"
            style={{
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              minHeight: 0,
            }}
          >
            {selectedNews ? (
              <motion.div
                key={selectedNews.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full mb-3"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: getCategoryColor(selectedNews.category),
                        background: `color-mix(in srgb, ${getCategoryColor(selectedNews.category)} 15%, transparent)`,
                      }}
                    >
                      {selectedNews.category}
                    </span>
                    <h1
                      className="m-0 mb-2"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'var(--cream-dark)',
                        lineHeight: 1.4,
                      }}
                    >
                      {selectedNews.title}
                    </h1>
                    {selectedNews.titleEn && (
                      <h2
                        className="m-0 mb-2"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '1rem',
                          fontWeight: 500,
                          color: 'var(--cream-text-muted)',
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                        }}
                      >
                        {selectedNews.titleEn}
                      </h2>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        来源：{selectedNews.source}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        {formatDate(selectedNews.publishDate)}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => toggleFavorite(selectedNews.id)}
                    className="w-11 h-11 min-h-11 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                    style={{
                      background: selectedNews.isFavorite
                        ? 'color-mix(in srgb, var(--warm-orange) 12%, transparent)'
                        : 'var(--surface)',
                      border: `1px solid ${selectedNews.isFavorite ? 'var(--warm-orange)' : 'var(--cream-border)'}`,
                      color: selectedNews.isFavorite ? 'var(--warm-orange)' : 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={selectedNews.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="mb-6">
                    <h3
                      className="m-0 mb-2"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--soft-blue)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      要点提炼
                    </h3>
                    <p
                      className="m-0"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--cream-dark)',
                        lineHeight: 1.8,
                        background: 'color-mix(in srgb, var(--soft-blue) 5%, transparent)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                      }}
                    >
                      {selectedNews.summary}
                    </p>
                    {selectedNews.summaryEn && (
                      <p
                        className="m-0 mt-2"
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.8125rem',
                          color: 'var(--cream-text-muted)',
                          lineHeight: 1.8,
                          fontStyle: 'italic',
                          background: 'color-mix(in srgb, var(--moss-green) 5%, transparent)',
                          padding: '1rem',
                          borderRadius: '0.75rem',
                        }}
                      >
                        {selectedNews.summaryEn}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3
                      className="m-0 mb-3"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--moss-green)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      原文详情
                    </h3>
                    <div
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--cream-dark)',
                        lineHeight: 1.9,
                      }}
                    >
                      {selectedNews.content.split('\n\n').map((para, i) => (
                        <div key={i} className="mb-4">
                          <p style={{ margin: 0, textIndent: '2em' }}>
                            {para}
                          </p>
                          {selectedNews.contentEn && (
                            <p
                              style={{
                                margin: '0.5rem 0 0 0',
                                textIndent: '2em',
                                color: 'var(--cream-text-muted)',
                                fontStyle: 'italic',
                                fontSize: '0.75rem',
                              }}
                            >
                              {selectedNews.contentEn.split('\n\n')[i]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedNews.tags && selectedNews.tags.length > 0 && (
                    <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--cream-border)' }}>
                      <h3
                        className="m-0 mb-2"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--cream-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        相关标签
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedNews.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full"
                            style={{
                              fontFamily: "'Poppins',var(--font-sans)",
                              fontSize: '0.75rem',
                              color: 'var(--soft-blue)',
                              background: 'color-mix(in srgb, var(--soft-blue) 10%, transparent)',
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--cream-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <p
                  className="m-0 mt-3"
                  style={{
                    fontFamily: "'Lora',var(--font-sans)",
                    fontSize: '0.8125rem',
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  选择一篇文章查看详情
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
