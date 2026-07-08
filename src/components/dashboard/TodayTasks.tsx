import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '@/store/task';
import Icon from '@/components/Icon';

export default function TodayTasks() {
  const tasks = useTaskStore((state) => state.tasks);
  const toggleTask = useTaskStore((state) => state.toggleTask);

  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter((task) => task.dueDate === today);
  }, [tasks]);

  const pendingTasks = useMemo(
    () => todayTasks.filter((t) => t.status === 'pending'),
    [todayTasks]
  );
  const completedTasks = useMemo(
    () => todayTasks.filter((t) => t.status === 'completed'),
    [todayTasks]
  );

  const priorityColors: Record<string, string> = {
    high: 'var(--warm-orange)',
    medium: 'var(--soft-blue)',
    low: 'var(--moss-green)',
  };

  const priorityLabels: Record<string, string> = {
    high: '高优先',
    medium: '中优先',
    low: '低优先',
  };

  const allTasks = [...pendingTasks, ...completedTasks];

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
          style={{ width: '6px', height: '6px', background: 'var(--moss-green)' }}
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
          今日任务
        </span>
        <span
          className="ml-auto"
          style={{
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--cream-text-muted)',
          }}
        >
          {completedTasks.length}/{todayTasks.length} 已完成
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
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {todayTasks.length === 0 ? (
          <motion.div
            className="py-8 text-center flex-1 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p
              className="m-0"
              style={{
                fontFamily: "'Lora',var(--font-sans)",
                fontSize: '0.8125rem',
                color: 'var(--cream-text-muted)',
              }}
            >
              今天暂无任务，享受美好的一天吧！
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
            <AnimatePresence initial={false}>
              {allTasks.map((task, index) => {
                const isCompleted = task.status === 'completed';
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                    transition={{
                      delay: 0.45 + index * 0.05,
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid rgba(232,230,220,0.8)',
                      opacity: isCompleted ? 0.6 : 1,
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center"
                      style={{
                        borderColor: priorityColors[task.priority],
                        background: isCompleted ? priorityColors[task.priority] : 'transparent',
                        cursor: 'pointer',
                        color: 'var(--text-on-primary)',
                        minWidth: '24px',
                        minHeight: '24px',
                      }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`标记 ${task.title} 为${isCompleted ? '未完成' : '完成'}`}
                    >
                      <AnimatePresence mode="wait">
                        {isCompleted && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Icon name="check" size={14} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <div className="flex-1 min-w-0">
                      <p
                        className="m-0 mb-0.5"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.9375rem',
                          fontWeight: 500,
                          color: isCompleted ? 'var(--cream-text-muted)' : 'var(--cream-dark)',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          lineHeight: 1.4,
                        }}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p
                          className="m-0"
                          style={{
                            fontFamily: "'Lora',var(--font-sans)",
                            fontSize: '0.8125rem',
                            color: 'var(--cream-text-muted)',
                            lineHeight: 1.4,
                          }}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>
                    <span
                      className="flex-shrink-0 px-2.5 py-1 rounded-full"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: priorityColors[task.priority],
                        background: `color-mix(in srgb, ${priorityColors[task.priority]} 15%, transparent)`,
                      }}
                    >
                      {priorityLabels[task.priority]}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}
