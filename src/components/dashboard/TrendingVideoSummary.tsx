import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Icon from '@/components/Icon';
import { useTrendingVideoStore } from '@/store/trendingVideo';

export default function TrendingVideoSummary() {
  const { getFilteredVideos, fetchFromApi, isRefreshing } = useTrendingVideoStore();
  const topVideos = getFilteredVideos().slice(0, 3);

  useEffect(() => {
    fetchFromApi();
  }, [fetchFromApi]);

  const coverGradients = [
    'linear-gradient(135deg, #d97757, #e8956e)',
    'linear-gradient(135deg, #6a9bcc, #8ab5db)',
    'linear-gradient(135deg, #788c5d, #92a675)',
  ];

  return (
    <motion.section
      className="flex flex-col h-full"
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
        className="rounded-2xl p-4 flex-1 flex flex-col overflow-hidden"
        style={{
          background: 'var(--cream-bg)',
          border: '1px solid var(--cream-border)',
          minHeight: 0,
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
          {isRefreshing && topVideos.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div
                className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--soft-blue)', borderTopColor: 'transparent' }}
              />
            </div>
          ) : (
            topVideos.map((video, index) => (
              <motion.div
                key={video.id}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid rgba(232,230,220,0.8)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.05, duration: 0.3 }}
                whileTap={{ scale: 0.99 }}
              >
                <div
                  className="flex-shrink-0 relative rounded-xl overflow-hidden flex items-center justify-center bg-cover bg-center"
                  style={{
                    width: '4rem',
                    height: '4rem',
                    backgroundImage: video.thumbnail ? `url(${video.thumbnail})` : coverGradients[index % coverGradients.length],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      background: 'var(--surface-solid)',
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
                      color: 'var(--text-on-primary)',
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
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
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
                      ▶ {video.views}
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
                      {video.growthRate > 0 ? `+${video.growthRate}%` : `${video.growthRate}%`}
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
