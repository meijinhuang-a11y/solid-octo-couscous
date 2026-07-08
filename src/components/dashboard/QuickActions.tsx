import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';

const quickActions = [
  { key: 'tasks', label: '每日计划', desc: '管理你的每日任务和目标', icon: 'tasks', color: 'var(--warm-orange)', path: '/tasks' },
  { key: 'notes', label: '杂事记录', desc: '随手记录灵感和待办', icon: 'notes', color: 'var(--soft-blue)', path: '/notes' },
  { key: 'photo', label: '照片优化', desc: '智能增强和美化照片', icon: 'photo', color: 'var(--moss-green)', path: '/photo' },
  { key: 'copywriting', label: '文案优化', desc: '精炼你的文字表达', icon: 'copywriting', color: 'var(--warm-orange)', path: '/copywriting' },
  { key: 'video', label: '视频优化', desc: '提升视频质量和效果', icon: 'video', color: 'var(--soft-blue)', path: '/video' },
  { key: 'files', label: '文件整理', desc: '分类整理你的文件', icon: 'files', color: 'var(--moss-green)', path: '/files' },
  { key: 'news', label: '行业日报', desc: '每日广告行业热点资讯', icon: 'news', color: 'var(--warm-orange)', path: '/news' },
  { key: 'trending-video', label: '爆款视频', desc: '发现热门视频趋势', icon: 'trending-video', color: 'var(--soft-blue)', path: '/trending-video' },
  { key: 'trending-product', label: '爆款产品', desc: '洞察热销产品动态', icon: 'trending-product', color: 'var(--moss-green)', path: '/trending-product' },
];

export default function QuickActions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
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
          快速操作
        </span>
      </motion.h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.04, duration: 0.3, ease: 'easeOut' }}
          >
            <Link
              to={action.path}
              className="flex items-center gap-3 p-3.5 rounded-2xl no-underline block cream-card-hover"
              style={{
                background: 'var(--cream-bg)',
                border: '1px solid var(--cream-border)',
                color: 'var(--cream-dark)',
                minHeight: '56px',
              }}
            >
              <motion.div
                className="flex items-center gap-3 w-full"
                whileTap={{ scale: 0.97 }}
              >
                <span
                  className="shrink-0 inline-flex rounded-xl"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: action.color,
                  }}
                >
                  <Icon name={action.icon} size={20} className="m-auto text-white" />
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="m-0 mb-0.5"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    {action.label}
                  </p>
                  <p
                    className="m-0"
                    style={{
                      fontFamily: "'Lora',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: 'var(--cream-text-muted)',
                      lineHeight: 1.5,
                    }}
                  >
                    {action.desc}
                  </p>
                </div>
                <Icon name="arrow" size={14} className="shrink-0" style={{ color: 'var(--cream-text-muted)' }} />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
