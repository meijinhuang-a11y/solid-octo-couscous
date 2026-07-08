import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const MotionButton = motion.button;
import { useWhitepaperStore } from '@/store/whitepaper';
import type { WhitepaperItem } from '@/types';

export default function WhitepaperPage() {
  const { getFilteredWhitepapers, categories, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, refresh, lastRefresh, isRefreshing } = useWhitepaperStore();
  const [selectedItem, setSelectedItem] = useState<WhitepaperItem | null>(null);

  const filteredWhitepapers = getFilteredWhitepapers();

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      'marketing': 'var(--warm-orange)',
      'media': 'var(--soft-blue)',
      'insight': 'var(--moss-green)',
      'platform': 'var(--soft-blue)',
    };
    return colors[cat] || 'var(--cream-text-muted)';
  };

  const handleDownload = (item: WhitepaperItem) => {
    if (item.canDownload && item.downloadUrl) {
      window.open(item.downloadUrl, '_blank');
    }
  };

  const handleOriginal = (url: string) => {
    window.open(url, '_blank');
  };

  const handleViewDetail = (item: WhitepaperItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="p-4 sm:p-6">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h2
              className="m-0"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--cream-dark)',
              }}
            >
              白皮书方法论
            </h2>
            <span
              className="px-2.5 py-0.5 rounded-full"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--cream-text-muted)',
                background: 'var(--cream-border)',
              }}
              title="当前为演示数据，接入API后将显示真实资源"
            >
              示例数据
            </span>
          </div>
          <p
            className="m-0 mt-1"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            营销类 · 媒介类 · 社会洞察 · 平台类
          </p>
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
              placeholder="搜索白皮书..."
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
            {new Date(lastRefresh).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 更新
          </span>
        </div>
      </motion.div>

      <motion.div
        className="flex gap-2 mb-5 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 sm:pb-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelectedCategory(cat.value)}
            className="px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 min-h-11"
            style={{
              background: selectedCategory === cat.value
                ? `color-mix(in srgb, ${cat.value === 'all' ? 'var(--cream-text-muted)' : getCategoryColor(cat.value)} 15%, transparent)`
                : 'var(--cream-bg)',
              color: selectedCategory === cat.value
                ? (cat.value === 'all' ? 'var(--cream-text-muted)' : getCategoryColor(cat.value))
                : 'var(--cream-text-muted)',
              border: `1px solid ${selectedCategory === cat.value
                ? (cat.value === 'all' ? 'var(--cream-border)' : getCategoryColor(cat.value))
                : 'var(--cream-border)'
              }`,
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredWhitepapers.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              className="p-4 rounded-2xl"
              style={{
                background: 'var(--cream-bg)',
                border: '1px solid var(--cream-border)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: getCategoryColor(item.category),
                    background: `color-mix(in srgb, ${getCategoryColor(item.category)} 12%, transparent)`,
                  }}
                >
                  {categories.find((c) => c.value === item.category)?.label || item.category}
                </span>
                <span
                  style={{
                    fontFamily: "'Lora',var(--font-sans)",
                    fontSize: '0.75rem',
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  {item.publishDate}
                </span>
              </div>

              <h3
                className="m-0 mb-2"
                style={{
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--cream-dark)',
                  lineHeight: 1.4,
                }}
              >
                {item.title}
              </h3>

              <p
                className="m-0 mb-3"
                style={{
                  fontFamily: "'Lora',var(--font-sans)",
                  fontSize: '0.8125rem',
                  color: 'var(--cream-text-muted)',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.tags.slice(0, 4).map((tag) => (
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

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  {item.source}
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <MotionButton
                    type="button"
                    onClick={() => handleViewDetail(item)}
                    className="px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-all min-h-11 w-full sm:w-auto"
                    style={{
                      background: 'var(--cream-bg)',
                      color: 'var(--cream-dark)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6" />
                      <path d="M9 21H3v-6" />
                      <path d="M21 3l-7 7" />
                      <path d="M3 21l7-7" />
                    </svg>
                    查看详情
                  </MotionButton>
                  <MotionButton
                    type="button"
                    onClick={() => handleOriginal(item.originalUrl)}
                    className="px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-all min-h-11 w-full sm:w-auto"
                    style={{
                      background: 'color-mix(in srgb, var(--soft-blue) 10%, transparent)',
                      color: 'var(--soft-blue)',
                      border: '1px solid var(--soft-blue)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    原文链接
                  </MotionButton>
                  <MotionButton
                    type="button"
                    onClick={() => handleDownload(item)}
                    disabled={!item.canDownload}
                    className="px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-all min-h-11 w-full sm:w-auto"
                    style={{
                      background: item.canDownload
                        ? 'var(--moss-green)'
                        : 'color-mix(in srgb, var(--cream-text-muted) 10%, transparent)',
                      color: item.canDownload ? '#fff' : 'var(--cream-text-muted)',
                      border: `1px solid ${item.canDownload ? 'var(--moss-green)' : 'var(--cream-border)'}`,
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: item.canDownload ? 'pointer' : 'not-allowed',
                    }}
                    whileTap={item.canDownload ? { scale: 0.97 } : undefined}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    下载
                  </MotionButton>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredWhitepapers.length === 0 && (
        <motion.div
          className="text-center py-16 rounded-2xl"
          style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--cream-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <p
            className="m-0 mt-3"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.8125rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            暂无白皮书
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.4)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              className="fixed z-50 w-[95vw] sm:w-[600px] max-h-[85vh] rounded-2xl p-4 sm:p-6 flex flex-col"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--cream-bg)',
                border: '1px solid var(--cream-border)',
                boxShadow: 'var(--shadow-2xl)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-2.5 py-0.5 rounded-full"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: getCategoryColor(selectedItem.category),
                    background: `color-mix(in srgb, ${getCategoryColor(selectedItem.category)} 15%, transparent)`,
                  }}
                >
                  {categories.find((c) => c.value === selectedItem.category)?.label || selectedItem.category}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 rounded-md flex items-center justify-center"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--cream-text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <h2
                className="m-0 mb-2"
                style={{
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--cream-dark)',
                  lineHeight: 1.4,
                }}
              >
                {selectedItem.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  来源：{selectedItem.source}
                </span>
                <span
                  style={{
                    fontFamily: "'Lora',var(--font-sans)",
                    fontSize: '0.75rem',
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  {selectedItem.publishDate}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto">
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
                    概述
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
                    {selectedItem.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3
                    className="m-0 mb-2"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--moss-green)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    内容要点
                  </h3>
                  <div className="space-y-3">
                    {selectedItem.tags.map((tag, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-3 rounded-lg"
                        style={{
                          background: 'var(--cream-bg)',
                          border: '1px solid var(--cream-border)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Poppins',var(--font-sans)",
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--soft-blue)',
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}.
                        </span>
                        <span
                          style={{
                            fontFamily: "'Lora',var(--font-sans)",
                            fontSize: '0.8125rem',
                            color: 'var(--cream-dark)',
                            lineHeight: 1.6,
                          }}
                        >
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-4 mt-4" style={{ borderTop: '1px solid var(--cream-border)' }}>
                <button
                  type="button"
                  onClick={() => handleOriginal(selectedItem.originalUrl)}
                  className="px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-all min-h-11 w-full sm:w-auto"
                  style={{
                    background: 'color-mix(in srgb, var(--soft-blue) 10%, transparent)',
                    color: 'var(--soft-blue)',
                    border: '1px solid var(--soft-blue)',
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  查看原文链接
                </button>
                {selectedItem.canDownload && selectedItem.downloadUrl && (
                  <button
                    type="button"
                    onClick={() => handleDownload(selectedItem)}
                    className="px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-all min-h-11 w-full sm:w-auto"
                    style={{
                      background: 'var(--moss-green)',
                      color: 'var(--text-on-primary)',
                      border: '1px solid var(--moss-green)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    下载PDF
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
