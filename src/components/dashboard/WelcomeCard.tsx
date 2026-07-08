import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTaskStore } from '@/store/task';
import { useNewsStore } from '@/store/news';
import { useFileStore } from '@/store/file';
import { useCountUp } from '@/hooks/useCountUp';

export default function WelcomeCard() {
  const tasks = useTaskStore((state) => state.tasks);
  const news = useNewsStore((state) => state.news);
  const files = useFileStore((state) => state.files);

  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter((task) => task.dueDate === today);
  }, [tasks]);

  const completedCount = useMemo(
    () => todayTasks.filter((t) => t.status === 'completed').length,
    [todayTasks]
  );
  const totalCount = todayTasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const weekStart = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
  }, []);
  const weeklyCompleted = useMemo(
    () => tasks.filter((t) => t.status === 'completed' && t.dueDate >= weekStart).length,
    [tasks, weekStart]
  );

  const unreadNews = useMemo(() => news.filter((n) => !n.isRead).length, [news]);

  const totalFileSize = useMemo(() => files.reduce((sum, f) => sum + f.size, 0), [files]);
  const fileSizeGB = (totalFileSize / (1024 * 1024 * 1024)).toFixed(1);

  const totalCountAnim = useCountUp(totalCount, { delay: 300, duration: 1200 });
  const completedCountAnim = useCountUp(completedCount, { delay: 500, duration: 1200 });
  const pendingCountAnim = useCountUp(totalCount - completedCount, { delay: 700, duration: 1200 });
  const weeklyAnim = useCountUp(weeklyCompleted, { delay: 900, duration: 1200 });
  const newsAnim = useCountUp(unreadNews, { delay: 1100, duration: 1200 });
  const storageAnim = useCountUp(parseFloat(fileSizeGB), { delay: 1300, duration: 1500, decimals: 1 });

  const now = new Date();
  const hour = now.getHours();
  let greeting = '你好';
  if (hour < 6) greeting = '凌晨好';
  else if (hour < 12) greeting = '早上好';
  else if (hour < 14) greeting = '中午好';
  else if (hour < 18) greeting = '下午好';
  else greeting = '晚上好';

  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`;

  const stats = [
    { label: '今日任务', value: totalCountAnim, color: 'var(--warm-orange)', rawValue: totalCount },
    { label: '已完成', value: completedCountAnim, color: 'var(--moss-green)', rawValue: completedCount },
    { label: '待处理', value: pendingCountAnim, color: 'var(--soft-blue)', rawValue: totalCount - completedCount },
    { label: '本周完成', value: weeklyAnim, color: 'var(--warm-orange)', rawValue: weeklyCompleted },
    { label: '未读日报', value: newsAnim, color: 'var(--soft-blue)', rawValue: unreadNews },
    { label: '文件占用', value: `${storageAnim}GB`, color: 'var(--moss-green)', rawValue: `${fileSizeGB}GB` },
  ];

  return (
    <motion.section
      className="relative overflow-hidden flex flex-col justify-between p-4 rounded-2xl"
      style={{
        background: 'var(--cream-bg)',
        border: '1px solid var(--cream-border)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="relative z-10">
        <motion.div
          className="flex items-center gap-2 mb-1.5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <span
            style={{
              fontFamily: "'Poppins','SF Pro Display',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--cream-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            Daily Briefing
          </span>
        </motion.div>

        <motion.h2
          className="m-0 mb-1"
          style={{
            fontFamily: "'Poppins','SF Pro Display',var(--font-sans)",
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--cream-dark)',
            lineHeight: 1.25,
            letterSpacing: '-0.04em',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {greeting}
        </motion.h2>

        <motion.p
          className="m-0"
          style={{
            fontFamily: "'Lora','Georgia',var(--font-sans)",
            fontSize: '0.8125rem',
            color: 'var(--cream-text-muted)',
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {dateStr}
        </motion.p>

        <motion.div
          className="flex items-center gap-2 mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <div
            className="flex-1 rounded-full relative"
            style={{ height: '4px', background: 'var(--cream-border)', overflow: 'hidden' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--warm-orange), color-mix(in srgb, var(--warm-orange) 70%, #fff))',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--moss-green)',
              whiteSpace: 'nowrap',
            }}
          >
            {completedCount}/{totalCount} 完成
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 relative z-10">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="text-center rounded-xl cursor-default"
            style={{
              padding: '10px 6px',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(232,230,220,0.8)',
              minWidth: 0,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              style={{
                width: '16px',
                height: '3px',
                borderRadius: '2px',
                background: stat.color,
                margin: '0 auto 6px',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35 + index * 0.05, duration: 0.3 }}
            />
            <p
              className="m-0"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--cream-dark)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                whiteSpace: 'nowrap',
              }}
            >
              {stat.value}
            </p>
            <p
              className="mt-1 mb-0"
              style={{
                fontFamily: "'Lora',var(--font-sans)",
                fontSize: '0.75rem',
                color: 'var(--cream-text-muted)',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
              }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
