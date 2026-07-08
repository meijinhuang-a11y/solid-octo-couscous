import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrendingVideoStore } from '@/store/trendingVideo';
import type { TrendingVideo } from '@/types';

export default function TrendingVideoPage() {
  const { selectedPlatform, selectedCategory, sortBy, setSelectedPlatform, setSelectedCategory, setSortBy, getFilteredVideos, platforms, categories, refresh, lastRefresh, isRefreshing } = useTrendingVideoStore();
  const [selectedVideo, setSelectedVideo] = useState<TrendingVideo | null>(null);

  const filteredVideos = getFilteredVideos();

  const formatNumber = (str: string) => str;

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'var(--warm-orange)';
    if (trend === 'down') return 'var(--soft-blue)';
    return 'var(--cream-text-muted)';
  };

  const platformColors: Record<string, string> = {
    抖音: '#000',
    快手: '#FF4906',
    视频号: '#07C160',
    B站: '#FB7299',
    小红书: '#FE2C55',
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2
              className="m-0"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--cream-dark)',
              }}
            >
              爆款视频
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
              title="当前为演示数据，接入API后将显示实时趋势"
            >
              示例数据
            </span>
          </div>
          <p
            className="m-0"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            实时追踪各平台热门视频，把握趋势脉搏
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'views' | 'likes' | 'comments')}
            className="px-3 py-2 rounded-lg outline-none cursor-pointer w-full sm:w-auto min-h-11"
            style={{
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.8125rem',
              color: 'var(--cream-dark)',
            }}
          >
            <option value="views">播放量排序</option>
            <option value="likes">点赞量排序</option>
            <option value="comments">评论数排序</option>
          </select>
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

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 w-full">
          <span
            className="flex-shrink-0"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            平台：
          </span>
          <div className="flex-1 flex gap-1.5 overflow-x-auto sm:flex-wrap pb-1 sm:pb-0">
            {platforms.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPlatform(p)}
                className="px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex-shrink-0 min-h-11"
                style={{
                  background: selectedPlatform === p ? platformColors[p] || 'var(--warm-orange)' : 'var(--cream-bg)',
                  color: selectedPlatform === p ? '#fff' : 'var(--cream-dark)',
                  border: `1px solid ${selectedPlatform === p ? platformColors[p] || 'var(--warm-orange)' : 'var(--cream-border)'}`,
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span
            className="flex-shrink-0"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            分类：
          </span>
          <div className="flex-1 flex gap-1.5 overflow-x-auto sm:flex-wrap pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className="px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex-shrink-0 min-h-11"
                style={{
                  background: selectedCategory === c
                    ? 'color-mix(in srgb, var(--moss-green) 15%, transparent)'
                    : 'var(--cream-bg)',
                  color: selectedCategory === c ? 'var(--moss-green)' : 'var(--cream-text-muted)',
                  border: `1px solid ${selectedCategory === c ? 'var(--moss-green)' : 'var(--cream-border)'}`,
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Video Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              className="rounded-2xl overflow-hidden cursor-pointer group"
              style={{
                background: 'var(--cream-bg)',
                border: '1px solid var(--cream-border)',
              }}
              onClick={() => setSelectedVideo(video)}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative" style={{ aspectRatio: '9/16', overflow: 'hidden' }}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.95)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cream-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
                <div
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full"
                  style={{
                    background: platformColors[video.platform] || 'var(--warm-orange)',
                    color: '#fff',
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  {video.platform}
                </div>
                <div
                  className="absolute top-2 right-2 px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  {formatNumber(video.views)}
                </div>
                {index < 3 && (
                  <div
                    className="absolute bottom-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'var(--warm-orange)',
                      color: '#fff',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="p-4">
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
                  }}
                >
                  {video.title}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--soft-blue), var(--warm-orange))',
                    }}
                  />
                  <span
                    className="flex-1 truncate"
                    style={{
                      fontFamily: "'Lora',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: 'var(--cream-text-muted)',
                    }}
                    title={video.author}
                  >
                    {video.author}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--warm-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--warm-orange)',
                        fontWeight: 500,
                      }}
                    >
                      {formatNumber(video.likes)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cream-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      {formatNumber(video.comments)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: getTrendColor(video.trend) }}>
                    {video.trend === 'up' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    )}
                    {video.trend === 'down' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      {video.growthRate}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredVideos.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p
            className="m-0"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.8125rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            暂无数据
          </p>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[800px] max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden"
              style={{ background: 'var(--cream-bg)', boxShadow: 'var(--shadow-2xl)' }}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-[300px] flex-shrink-0" style={{ background: '#000' }}>
                  <img
                    src={selectedVideo.thumbnail}
                    alt={selectedVideo.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '300px' }}
                  />
                </div>
                <div className="flex-1 p-4 sm:p-5 flex flex-col" style={{ minHeight: 0 }}>
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#fff',
                        background: platformColors[selectedVideo.platform] || 'var(--warm-orange)',
                      }}
                    >
                      {selectedVideo.platform}
                    </span>
                    <motion.button
                      type="button"
                      onClick={() => setSelectedVideo(null)}
                      className="w-11 h-11 min-h-11 rounded-lg flex items-center justify-center"
                      style={{ background: 'transparent', border: 'none', color: 'var(--cream-text-muted)', cursor: 'pointer' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </motion.button>
                  </div>
                  <h3
                    className="m-0 mb-3"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--cream-dark)',
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedVideo.title}
                  </h3>

                  <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid var(--cream-border)' }}>
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, var(--soft-blue), var(--warm-orange))',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="m-0 truncate"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: 'var(--cream-dark)',
                        }}
                      >
                        {selectedVideo.author}
                      </p>
                      <p
                        className="m-0"
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        {selectedVideo.duration}
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      className="px-4 py-2 rounded-full min-h-11"
                      style={{
                        background: 'var(--warm-orange)',
                        color: '#fff',
                        border: 'none',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      + 关注
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <StatCard label="播放量" value={selectedVideo.views} color="var(--soft-blue)" />
                    <StatCard label="点赞数" value={selectedVideo.likes} color="var(--warm-orange)" />
                    <StatCard label="评论数" value={selectedVideo.comments} color="var(--moss-green)" />
                  </div>

                  <div className="mb-4">
                    <p
                      className="m-0 mb-2"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--cream-dark)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      热门标签
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {selectedVideo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full"
                          style={{
                            fontFamily: "'Lora',var(--font-sans)",
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

                  <div className="flex-1 overflow-y-auto">
                    <p
                      className="m-0 mb-2"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--cream-dark)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      视频描述
                    </p>
                    <p
                      className="m-0"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--cream-text-muted)',
                        lineHeight: 1.7,
                      }}
                    >
                      {selectedVideo.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--cream-border)' }}>
                    <motion.button
                      type="button"
                      className="flex-1 py-2.5 rounded-xl min-h-11"
                      style={{
                        background: 'rgba(255,255,255,0.7)',
                        color: 'var(--cream-dark)',
                        border: '1px solid var(--cream-border)',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      去平台观看
                    </motion.button>
                    <motion.button
                      type="button"
                      className="flex-1 py-2.5 rounded-xl min-h-11"
                      style={{
                        background: 'var(--warm-orange)',
                        color: '#fff',
                        border: 'none',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      分析同款
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="p-3 rounded-xl text-center"
      style={{
        background: `color-mix(in srgb, ${color} 8%, transparent)`,
      }}
    >
      <p
        className="m-0"
        style={{
          fontFamily: "'Poppins',var(--font-sans)",
          fontSize: '0.9375rem',
          fontWeight: 600,
          color,
        }}
      >
        {value}
      </p>
      <p
        className="m-0"
        style={{
          fontFamily: "'Lora',var(--font-sans)",
          fontSize: '0.75rem',
          color: 'var(--cream-text-muted)',
        }}
      >
        {label}
      </p>
    </div>
  );
}
