import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHotSearchStore } from '@/store/hotSearch';

const rankColors: Record<number, string> = {
  1: '#FF4757',
  2: '#FF6B35',
  3: '#FFA502',
};

export default function HotSearchPage() {
  const { items, isLoading, error, fetchHotSearches, formatHotNum, lastUpdated, config, setConfig } =
    useHotSearchStore();
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(config.apiKey);

  useEffect(() => {
    fetchHotSearches();

    if (config.autoRefresh) {
      const interval = setInterval(() => {
        fetchHotSearches();
      }, config.refreshInterval * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [fetchHotSearches, config.autoRefresh, config.refreshInterval]);

  const openSearch = (title: string) => {
    window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(title)}`, '_blank');
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSaveSettings = () => {
    setConfig({ apiKey: apiKeyInput });
    setShowSettings(false);
    fetchHotSearches();
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
          <h1
            className="m-0 mb-1"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--cream-dark)',
            }}
          >
            全网热搜榜
          </h1>
          <p
            className="m-0"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.875rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            实时热点 · 一网打尽 · 更新于 {formatTime(lastUpdated)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-0 cursor-pointer transition-all"
            style={{
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              color: 'var(--cream-dark)',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--cream-bg)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            API 设置
          </button>
          <button
            onClick={() => fetchHotSearches()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-0 cursor-pointer transition-all"
            style={{
              background: 'var(--warm-orange)',
              color: '#fff',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            刷新
          </button>
        </div>
      </motion.div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          className="rounded-2xl p-5 mb-5"
          style={{
            background: 'var(--cream-bg)',
            border: '1px solid var(--cream-border)',
          }}
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3
            className="m-0 mb-3"
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--cream-dark)',
            }}
          >
            API 设置
          </h3>
          <p
            className="m-0 mb-3"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.8125rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            填入天聚数行（天行数据）的 API Key 以获取真实热搜数据。没有 Key 时显示模拟数据。
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="请输入 API Key"
              className="flex-1 px-4 py-2.5 rounded-xl outline-none transition-all"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--cream-border)',
                color: 'var(--cream-dark)',
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.875rem',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--warm-orange)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--cream-border)';
              }}
            />
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 rounded-xl border-0 cursor-pointer transition-all"
              style={{
                background: 'var(--warm-orange)',
                color: '#fff',
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              保存
            </button>
          </div>
          <p
            className="m-0 mt-2"
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            💡 去 {' '}
            <a href="https://www.tianapi.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--warm-orange)' }}>
              tianapi.com
            </a>
            {' '}注册申请"全网热搜榜"接口
          </p>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          className="rounded-2xl p-4 mb-5 flex items-center gap-3"
          style={{
            background: 'color-mix(in srgb, #FF4757 10%, transparent)',
            border: '1px solid color-mix(in srgb, #FF4757 30%, transparent)',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.875rem',
              color: '#FF4757',
            }}
          >
            {error}
          </span>
        </motion.div>
      )}

      {/* Hot Search List */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--cream-bg)',
          border: '1px solid var(--cream-border)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{
            borderBottom: '1px solid var(--cream-border)',
          }}
        >
          <span
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--cream-dark)',
            }}
          >
            热搜榜单 · TOP {items.length}
          </span>
          <span
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            点击跳转到百度搜索
          </span>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--cream-border)' }}>
          {isLoading && items.length === 0 ? (
            <div className="py-16 flex items-center justify-center">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--warm-orange)', borderTopColor: 'transparent' }}
              />
            </div>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-all"
                style={{ background: 'transparent' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
                whileHover={{ background: 'var(--surface)' }}
                onClick={() => openSearch(item.title)}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
                  style={{
                    background:
                      index < 3
                        ? rankColors[index + 1]
                        : 'color-mix(in srgb, var(--cream-border) 50%, transparent)',
                    color: index < 3 ? '#fff' : 'var(--cream-text-muted)',
                    fontFamily: "'Poppins',var(--font-sans)",
                  }}
                >
                  {item.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="truncate"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: 'var(--cream-dark)',
                      }}
                    >
                      {item.title}
                    </span>
                    {item.isHot && (
                      <span
                        className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: 'color-mix(in srgb, #FF4757 15%, transparent)',
                          color: '#FF4757',
                        }}
                      >
                        热
                      </span>
                    )}
                    {item.isNew && (
                      <span
                        className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: 'color-mix(in srgb, #2ED573 15%, transparent)',
                          color: '#2ED573',
                        }}
                      >
                        新
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      🔥 {formatHotNum(item.hotnum)} 热度
                    </span>
                  </div>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--cream-text-muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
