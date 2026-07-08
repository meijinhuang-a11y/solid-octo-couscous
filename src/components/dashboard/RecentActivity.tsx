import { motion } from 'framer-motion';

const activities = [
  { time: '10:30', text: '完成了"回复客户邮件"任务', type: 'success' },
  { time: '09:15', text: '上传了 3 张照片到优化队列', type: 'info' },
  { time: '昨天', text: '生成了新的行业日报', type: 'default' },
  { time: '昨天', text: '整理了 12 个文件到对应分类', type: 'success' },
  { time: '前天', text: '视频优化队列完成 2 项', type: 'info' },
  { time: '前天', text: '收藏了 5 个爆款视频', type: 'default' },
];

const typeColors: Record<string, string> = {
  success: 'var(--moss-green)',
  info: 'var(--soft-blue)',
  default: 'var(--warm-orange)',
};

export default function RecentActivity() {
  return (
    <motion.section
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.h3
        className="m-0 mb-4 flex items-center gap-1.5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.3 }}
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
          最近动态
        </span>
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
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
          {activities.map((item, index) => (
            <motion.div
              key={index}
              className="flex gap-3 p-4 rounded-xl"
              style={{
                background: 'var(--surface)',
                border: '1px solid rgba(232,230,220,0.8)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + index * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className="w-2.5 h-2.5 mt-1.5 rounded-full flex-shrink-0"
                style={{
                  background: typeColors[item.type],
                }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="m-0 mb-1"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.9375rem',
                    color: 'var(--cream-dark)',
                    lineHeight: 1.4,
                  }}
                >
                  {item.text}
                </p>
                <p
                  className="m-0"
                  style={{
                    fontFamily: "'Lora',var(--font-sans)",
                    fontSize: '0.8125rem',
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  {item.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
