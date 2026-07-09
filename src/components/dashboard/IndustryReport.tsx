import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Icon from '@/components/Icon';
import { useNewsStore } from '@/store/news';

const tagColors: Record<string, string> = {
  '科技': 'var(--soft-blue)',
  'AI': 'var(--warm-orange)',
  '媒体': 'var(--moss-green)',
  '广告': 'var(--soft-blue)',
  '营销': 'var(--warm-orange)',
  '汽车': 'var(--moss-green)',
  '社会': 'var(--cream-text-muted)',
  '国内': 'var(--soft-blue)',
  '国际': 'var(--warm-orange)',
  '财经': 'var(--moss-green)',
  '行业趋势': 'var(--warm-orange)',
  'AI 赋能': 'var(--soft-blue)',
  '运营策略': 'var(--moss-green)',
  '直播电商': 'var(--warm-orange)',
};

export default function IndustryReport() {
  const { getFilteredNews, fetchFromApi, isRefreshing } = useNewsStore();
  const topReports = getFilteredNews().slice(0, 4);

  useEffect(() => {
    fetchFromApi();
  }, [fetchFromApi]);

  const formatTime = (dateStr: string) => {
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

  const getTagColor = (tag: string) => {
    return tagColors[tag] || 'var(--warm-orange)';
  };

  return (
    <motion.section
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.h3
        className="m-0 mb-4 flex items-center gap-1.5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
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
          行业日报
        </span>
        <Link
          to="/news"
          className="ml-auto no-underline flex items-center gap-1"
          style={{
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.75rem',
            color: 'var(--cream-text-muted)',
          }}
        >
          查看全部
          <Icon name="arrow" size={12} />
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
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
          {isRefreshing && topReports.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div
                className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--warm-orange)', borderTopColor: 'transparent' }}
              />
            </div>
          ) : (
            topReports.map((report, index) => (
              <motion.div
                key={report.id}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid rgba(232,230,220,0.8)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05, duration: 0.3 }}
                whileTap={{ scale: 0.99 }}
              >
                <span
                  className="flex-shrink-0 inline-flex items-center justify-center rounded-lg"
                  style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    background: `color-mix(in srgb, ${getTagColor(report.category)} 15%, transparent)`,
                    color: getTagColor(report.category),
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="m-0 mb-2"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                      color: 'var(--cream-dark)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {report.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: getTagColor(report.category),
                        background: `color-mix(in srgb, ${getTagColor(report.category)} 12%, transparent)`,
                      }}
                    >
                      {report.category}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      {report.source}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      · {formatTime(report.publishDate)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}
