import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '@/components/Icon';

const videos = [
  {
    id: 1,
    title: '30秒学会高效信息流广告创意公式',
    author: '创意研究所',
    duration: '0:32',
    plays: '128.5w',
    likes: '8.6w',
    growth: '+42%',
    cover: 'linear-gradient(135deg, #d97757, #e8956e)',
  },
  {
    id: 2,
    title: '品牌直播带货话术拆解｜单场 GMV 破百万',
    author: '电商老炮',
    duration: '1:45',
    plays: '96.2w',
    likes: '6.3w',
    growth: '+38%',
    cover: 'linear-gradient(135deg, #6a9bcc, #8ab5db)',
  },
  {
    id: 3,
    title: 'AI 一键生成产品主图，省下 80% 设计成本',
    author: 'AI 工具栈',
    duration: '0:58',
    plays: '73.8w',
    likes: '5.1w',
    growth: '+25%',
    cover: 'linear-gradient(135deg, #788c5d, #92a675)',
  },
];

export default function TrendingVideoSummary() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.h3
        className="m-0 mb-4 flex items-center gap-1.5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <span
          className="inline-block rounded-full"
          style={{ width: '6px', height: '6px', background: 'var(--soft-blue)' }}
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
          爆款视频
        </span>
        <Link
          to="/trending-video"
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
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="flex flex-col gap-3">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(232,230,220,0.8)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className="flex-shrink-0 relative rounded-xl overflow-hidden flex items-center justify-center"
                style={{
                  width: '4rem',
                  height: '4rem',
                  background: video.cover,
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--cream-dark)">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span
                  className="absolute bottom-1 right-1 px-1 rounded"
                  style={{
                    fontFamily: "'JetBrains Mono',var(--font-mono)",
                    fontSize: '0.625rem',
                    color: '#fff',
                    background: 'rgba(0,0,0,0.6)',
                  }}
                >
                  {video.duration}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="m-0 mb-1"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--cream-dark)',
                    lineHeight: 1.4,
                  }}
                >
                  {video.title}
                </p>
                <p
                  className="m-0 mb-2"
                  style={{
                    fontFamily: "'Lora',var(--font-sans)",
                    fontSize: '0.8125rem',
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  @{video.author}
                </p>
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: 'var(--cream-text-muted)',
                    }}
                  >
                    ▶ {video.plays}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: 'var(--cream-text-muted)',
                    }}
                  >
                    ♥ {video.likes}
                  </span>
                  <span
                    className="ml-auto"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--moss-green)',
                    }}
                  >
                    {video.growth}
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
