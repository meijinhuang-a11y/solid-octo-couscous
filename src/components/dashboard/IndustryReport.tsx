import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '@/components/Icon';

const reports = [
  {
    id: 1,
    title: '短视频广告投放新趋势：竖屏原生内容转化率提升 40%',
    source: 'AdWeek',
    time: '2小时前',
    tag: '行业趋势',
    hot: 9280,
  },
  {
    id: 2,
    title: 'AI 生成创意素材成为主流，品牌内容生产效率翻倍',
    source: '数英网',
    time: '5小时前',
    tag: 'AI 赋能',
    hot: 7620,
  },
  {
    id: 3,
    title: '私域流量运营白皮书：复购率提升的三个关键节点',
    source: 'QuestMobile',
    time: '昨天',
    tag: '运营策略',
    hot: 5410,
  },
  {
    id: 4,
    title: '直播电商进入精耕期，内容质量成核心竞争力',
    source: '36氪',
    time: '昨天',
    tag: '直播电商',
    hot: 4280,
  },
];

const tagColors: Record<string, string> = {
  行业趋势: 'var(--warm-orange)',
  'AI 赋能': 'var(--soft-blue)',
  运营策略: 'var(--moss-green)',
  直播电商: 'var(--warm-orange)',
};

export default function IndustryReport() {
  return (
    <motion.section
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
        className="rounded-2xl p-4"
        style={{
          background: 'var(--cream-bg)',
          border: '1px solid var(--cream-border)',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex flex-col gap-3">
          {reports.map((report, index) => (
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
                  background: `color-mix(in srgb, ${tagColors[report.tag]} 15%, transparent)`,
                  color: tagColors[report.tag],
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
                      color: tagColors[report.tag],
                      background: `color-mix(in srgb, ${tagColors[report.tag]} 12%, transparent)`,
                    }}
                  >
                    {report.tag}
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
                    · {report.time}
                  </span>
                  <span
                    className="flex items-center gap-0.5 ml-auto"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--warm-orange)',
                    }}
                  >
                    🔥 {(report.hot / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
