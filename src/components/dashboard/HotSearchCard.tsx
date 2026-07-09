import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useHotSearchStore } from '@/store/hotSearch';

const rankColors: Record<number, string> = {
  1: '#FF4757',
  2: '#FF6B35',
  3: '#FFA502',
};

export default function HotSearchCard() {
  const { getTopItems, isLoading, fetchHotSearches, formatHotNum, lastUpdated } =
    useHotSearchStore();
  const items = getTopItems(10);

  useEffect(() => {
    fetchHotSearches();
  }, [fetchHotSearches]);

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    fetchHotSearches();
  };

  const openSearch = (title: string) => {
    window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(title)}`, '_blank');
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <motion.section
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.h3
        className="m-0 mb-4 flex items-center gap-1.5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <span
          className="inline-block rounded-full"
          style={{ width: '6px', height: '6px', background: 'var(--warm-orange)' }}
        />
        <span
          style={{
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--cream-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          全网热搜
        </span>
        <span
          className="ml-2 px-1.5 py-0.5 rounded text-[0.625rem] font-medium"
          style={{
            background: 'color-mix(in srgb, var(--warm-orange) 15%, transparent)',
            color: 'var(--warm-orange)',
          }}
        >
          实时
        </span>
        <Link
          to="/hot-search"
          className="ml-auto no-underline flex items-center gap-1"
          style={{
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.75rem',
            color: 'var(--cream-text-muted)',
          }}
        >
          查看全部
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </motion.h3>

      <motion.div
        className="rounded-2xl p-4 flex-1 flex flex-col overflow-hidden"
        style={{
          background: 'var(--cream-bg)',
          border: '1px solid var(--cream-border)',
          minHeight: 0,
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            style={{
              fontFamily: "'Lora',var(--font-sans)",
              fontSize: '0.75rem',
              color: 'var(--cream-text-muted)',
            }}
          >
            更新于 {formatTime(lastUpdated)}
          </span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border-0 cursor-pointer transition-all"
            style={{
              background: 'transparent',
              color: 'var(--cream-text-muted)',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg
              width="14"
              height="14"
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
            换一换
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar flex-1">
          {isLoading && items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div
                className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--warm-orange)', borderTopColor: 'transparent' }}
              />
            </div>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: 'transparent',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.05, duration: 0.3 }}
                whileHover={{ background: 'var(--surface)' }}
                whileTap={{ scale: 0.99 }}
                onClick={() => openSearch(item.title)}
              >
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
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
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span
                    className="truncate flex-1"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    {item.title}
                  </span>
                  {item.isHot && (
                    <span
                      className="flex-shrink-0 px-1.5 py-0.5 rounded text-[0.625rem] font-medium"
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
                      className="flex-shrink-0 px-1.5 py-0.5 rounded text-[0.625rem] font-medium"
                      style={{
                        background: 'color-mix(in srgb, #2ED573 15%, transparent)',
                        color: '#2ED573',
                      }}
                    >
                      新
                    </span>
                  )}
                </div>
                <span
                  className="flex-shrink-0"
                  style={{
                    fontFamily: "'Lora',var(--font-sans)",
                    fontSize: '0.75rem',
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  {formatHotNum(item.hotnum)}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}
