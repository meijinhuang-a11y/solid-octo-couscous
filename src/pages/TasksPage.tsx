import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '@/store/task';
import Icon from '@/components/Icon';
import type { TaskType, RecurringFrequency, RecurringRule, Task } from '@/types';

const taskTypeOptions: { value: TaskType; label: string; desc: string; icon: string; color: string }[] = [
  { value: 'short', label: '短期任务', desc: '一次性任务，完成即结束', icon: '⚡', color: 'var(--warm-orange)' },
  { value: 'long', label: '长期任务', desc: '跨天/跨周，持续进行', icon: '📅', color: 'var(--soft-blue)' },
  { value: 'recurring', label: '重复任务', desc: '按日/周/月自动重复', icon: '🔄', color: 'var(--moss-green)' },
];

const frequencyOptions: { value: RecurringFrequency; label: string }[] = [
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
];

const weekdayOptions = [
  { value: 1, label: '一' },
  { value: 2, label: '二' },
  { value: 3, label: '三' },
  { value: 4, label: '四' },
  { value: 5, label: '五' },
  { value: 6, label: '六' },
  { value: 0, label: '日' },
];

export default function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskType, setNewTaskType] = useState<TaskType>('short');
  const [newTaskStartDate, setNewTaskStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskEndDate, setNewTaskEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskReminder, setNewTaskReminder] = useState(false);
  const [newTaskReminderTime, setNewTaskReminderTime] = useState('');
  const [newRecurringFreq, setNewRecurringFreq] = useState<RecurringFrequency>('daily');
  const [newRecurringInterval, setNewRecurringInterval] = useState(1);
  const [newRecurringWeekdays, setNewRecurringWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [newRecurringEndDate, setNewRecurringEndDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all');
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    let reminderTime: string | undefined;
    if (newTaskReminder && newTaskReminderTime) {
      reminderTime = newTaskReminderTime;
    }

    let recurringRule: RecurringRule | undefined = undefined;
    if (newTaskType === 'recurring') {
      recurringRule = {
        frequency: newRecurringFreq,
        interval: newRecurringInterval,
        weekdays: newRecurringFreq === 'weekly' ? newRecurringWeekdays : undefined,
        endDate: newRecurringEndDate || undefined,
      };
    }

    addTask({
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      status: 'pending',
      taskType: newTaskType,
      dueDate: newTaskEndDate,
      startDate: newTaskStartDate,
      endDate: newTaskEndDate,
      notes: newTaskNotes.trim() || undefined,
      reminderTime,
      recurringRule,
      reminded: false,
    });

    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setNewTaskType('short');
    setNewTaskStartDate(new Date().toISOString().split('T')[0]);
    setNewTaskEndDate(new Date().toISOString().split('T')[0]);
    setNewTaskNotes('');
    setNewTaskReminder(false);
    setNewTaskReminderTime('');
    setNewRecurringFreq('daily');
    setNewRecurringInterval(1);
    setNewRecurringWeekdays([1, 2, 3, 4, 5]);
    setNewRecurringEndDate('');
    setShowForm(false);
  };

  const toggleWeekday = (day: number) => {
    setNewRecurringWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending' && task.status !== 'pending') return false;
    if (filter === 'completed' && task.status !== 'completed') return false;
    if (typeFilter !== 'all' && task.taskType !== typeFilter) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
    if (priorityOrder[a.priority] !== priorityOrder[b.priority])
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

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

  const taskTypeLabels: Record<string, string> = {
    short: '短期',
    long: '长期',
    recurring: '重复',
  };

  const taskTypeColors: Record<string, string> = {
    short: 'var(--warm-orange)',
    long: 'var(--soft-blue)',
    recurring: 'var(--moss-green)',
  };

  const shortCount = tasks.filter((t) => t.taskType === 'short').length;
  const longCount = tasks.filter((t) => t.taskType === 'long').length;
  const recurringCount = tasks.filter((t) => t.taskType === 'recurring').length;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}月${day}日`;
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日 ${hour}:${min}`;
  };

  const isSameDay = (a: string, b: string) => a === b;

  const getRecurringDisplay = (task: Task) => {
    if (!task.recurringRule) return '';
    const rule = task.recurringRule;
    if (rule.frequency === 'daily') {
      return rule.interval && rule.interval > 1 ? `每${rule.interval}天` : '每天';
    }
    if (rule.frequency === 'weekly') {
      const days = rule.weekdays || [];
      const dayLabels: Record<number, string> = {
        0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六',
      };
      return `每周${days.map((d) => dayLabels[d]).join('、')}`;
    }
    if (rule.frequency === 'monthly') {
      return rule.interval && rule.interval > 1 ? `每${rule.interval}月` : '每月';
    }
    return '';
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {[
          { label: '全部任务', value: tasks.length, color: 'var(--cream-dark)' },
          { label: '短期任务', value: shortCount, color: 'var(--warm-orange)' },
          { label: '长期任务', value: longCount, color: 'var(--soft-blue)' },
          { label: '重复任务', value: recurringCount, color: 'var(--moss-green)' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="p-4 rounded-2xl"
            style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
          >
            <p
              className="m-0 text-xs mb-1 uppercase tracking-wide"
              style={{
                fontFamily: "'Poppins',var(--font-sans)",
                color: 'var(--cream-text-muted)',
                fontWeight: 500,
              }}
            >
              {stat.label}
            </p>
            <p
              className="m-0 text-2xl font-bold"
              style={{ fontFamily: "'Poppins',var(--font-sans)", color: stat.color }}
            >
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters + Add Button */}
      <motion.div
        className="flex flex-col gap-3 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <motion.button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="flex-shrink-0 px-4 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: filter === f ? 'var(--warm-orange)' : 'var(--cream-bg)',
                  color: filter === f ? '#fff' : 'var(--cream-text-muted)',
                  border: `1px solid ${filter === f ? 'var(--warm-orange)' : 'var(--cream-border)'}`,
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                whileTap={{ scale: 0.97 }}
              >
                {f === 'all' ? '全部状态' : f === 'pending' ? '待处理' : '已完成'}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {(['all', 'short', 'long', 'recurring'] as const).map((t) => (
              <motion.button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className="flex-shrink-0 px-4 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: typeFilter === t ? taskTypeColors[t === 'all' ? 'short' : t] : 'var(--cream-bg)',
                  color: typeFilter === t ? '#fff' : 'var(--cream-text-muted)',
                  border: `1px solid ${typeFilter === t ? taskTypeColors[t === 'all' ? 'short' : t] : 'var(--cream-border)'}`,
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                whileTap={{ scale: 0.97 }}
              >
                {t === 'all' ? '全部类型' : taskTypeLabels[t]}
              </motion.button>
            ))}
          </div>
        </div>
        <motion.button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto h-11 px-5 rounded-xl flex items-center justify-center gap-2"
          style={{
            background: 'var(--warm-orange)',
            color: 'var(--text-on-primary)',
            border: 'none',
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(217,119,87,0.3)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新建任务
        </motion.button>
      </motion.div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleAddTask}
            className="mb-6 rounded-2xl p-4"
            style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Task Type Selector */}
            <div className="mb-4">
              <label
                className="block mb-2 uppercase tracking-wide"
                style={{
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--cream-text-muted)',
                }}
              >
                任务类型
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {taskTypeOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() => setNewTaskType(opt.value)}
                    className="p-3 rounded-xl text-left flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1"
                    style={{
                      background: newTaskType === opt.value
                        ? `color-mix(in srgb, ${opt.color} 12%, transparent)`
                        : 'var(--surface)',
                      border: `2px solid ${newTaskType === opt.value ? opt.color : 'var(--cream-border)'}`,
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="text-xl">{opt.icon}</div>
                    <div>
                      <p
                        className="m-0"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: newTaskType === opt.value ? opt.color : 'var(--cream-dark)',
                        }}
                      >
                        {opt.label}
                      </p>
                      <p
                        className="m-0 hidden sm:block"
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.625rem',
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        {opt.desc}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4">
              <div className="w-full">
                <label
                  className="block mb-1.5 uppercase tracking-wide"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  任务标题
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="输入任务标题..."
                  className="w-full h-11 px-3.5 rounded-xl outline-none"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--cream-border)',
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '16px',
                    color: 'var(--cream-dark)',
                  }}
                />
              </div>

              <div className="w-full">
                <label
                  className="block mb-1.5 uppercase tracking-wide"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  优先级
                </label>
                <div className="flex gap-2">
                  {(['high', 'medium', 'low'] as const).map((p) => (
                    <motion.button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className="flex-1 h-11 rounded-xl"
                      style={{
                        background: newTaskPriority === p ? priorityColors[p] : 'var(--surface)',
                        color: newTaskPriority === p ? '#fff' : priorityColors[p],
                        border: `1px solid ${newTaskPriority === p ? priorityColors[p] : 'var(--cream-border)'}`,
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {priorityLabels[p]}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="w-full">
                <label
                  className="block mb-1.5 uppercase tracking-wide"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  {newTaskType === 'long' ? '起止日期' : newTaskType === 'recurring' ? '起止周期' : '时间范围'}
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <input
                    type="date"
                    value={newTaskStartDate}
                    onChange={(e) => setNewTaskStartDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl outline-none"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.8125rem',
                      color: 'var(--cream-dark)',
                    }}
                  />
                  <span className="hidden sm:block" style={{ color: 'var(--cream-text-muted)', fontSize: '0.75rem' }}>至</span>
                  <span className="sm:hidden text-center" style={{ color: 'var(--cream-text-muted)', fontSize: '0.75rem' }}>↓</span>
                  <input
                    type="date"
                    value={newTaskEndDate}
                    onChange={(e) => setNewTaskEndDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl outline-none"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.8125rem',
                      color: 'var(--cream-dark)',
                    }}
                  />
                </div>
              </div>

              {/* Recurring settings */}
              {newTaskType === 'recurring' && (
                <>
                  <div className="w-full">
                    <label
                      className="block mb-1.5 uppercase tracking-wide"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      重复频率
                    </label>
                    <div className="flex gap-2">
                      {frequencyOptions.map((f) => (
                        <motion.button
                          key={f.value}
                          type="button"
                          onClick={() => setNewRecurringFreq(f.value)}
                          className="flex-1 h-11 rounded-xl"
                          style={{
                            background: newRecurringFreq === f.value ? 'var(--moss-green)' : 'var(--surface)',
                            color: newRecurringFreq === f.value ? '#fff' : 'var(--moss-green)',
                            border: `1px solid ${newRecurringFreq === f.value ? 'var(--moss-green)' : 'var(--cream-border)'}`,
                            fontFamily: "'Poppins',var(--font-sans)",
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {f.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="w-full">
                    <label
                      className="block mb-1.5 uppercase tracking-wide"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      间隔周期
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={newRecurringInterval}
                        onChange={(e) => setNewRecurringInterval(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 h-11 px-3 rounded-xl outline-none"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--cream-border)',
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '16px',
                          color: 'var(--cream-dark)',
                        }}
                      />
                      <span style={{ color: 'var(--cream-text-muted)', fontSize: '0.75rem' }}>
                        {newRecurringFreq === 'daily' ? '天/次' : newRecurringFreq === 'weekly' ? '周/次' : '月/次'}
                      </span>
                    </div>
                  </div>

                  {newRecurringFreq === 'weekly' && (
                    <div className="w-full">
                      <label
                        className="block mb-1.5 uppercase tracking-wide"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        重复星期
                      </label>
                      <div className="flex gap-1.5">
                        {weekdayOptions.map((w) => (
                          <motion.button
                            key={w.value}
                            type="button"
                            onClick={() => toggleWeekday(w.value)}
                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{
                              background: newRecurringWeekdays.includes(w.value)
                                ? 'var(--moss-green)'
                                : 'var(--surface)',
                              color: newRecurringWeekdays.includes(w.value) ? '#fff' : 'var(--cream-text-muted)',
                              border: `1px solid ${newRecurringWeekdays.includes(w.value) ? 'var(--moss-green)' : 'var(--cream-border)'}`,
                              fontFamily: "'Poppins',var(--font-sans)",
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {w.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="w-full">
                    <label
                      className="block mb-1.5 uppercase tracking-wide"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      结束日期（可选）
                    </label>
                    <input
                      type="date"
                      value={newRecurringEndDate}
                      onChange={(e) => setNewRecurringEndDate(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl outline-none"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--cream-border)',
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.8125rem',
                        color: 'var(--cream-dark)',
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Reminder */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label
                  className="flex items-center gap-2 cursor-pointer min-h-[44px]"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--warm-orange)' }}>
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  开启提醒
                  <input
                    type="checkbox"
                    checked={newTaskReminder}
                    onChange={(e) => setNewTaskReminder(e.target.checked)}
                    style={{ accentColor: 'var(--warm-orange)', cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                </label>
              </div>
              {newTaskReminder && (
                <div className="flex gap-2 items-center">
                  <input
                    type="datetime-local"
                    value={newTaskReminderTime}
                    onChange={(e) => setNewTaskReminderTime(e.target.value)}
                    className="flex-1 w-full h-11 px-3 rounded-xl outline-none"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--cream-border)',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.8125rem',
                      color: 'var(--cream-dark)',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label
                className="block mb-1.5 uppercase tracking-wide"
                style={{
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--cream-text-muted)',
                }}
              >
                备注
              </label>
              <textarea
                value={newTaskNotes}
                onChange={(e) => setNewTaskNotes(e.target.value)}
                placeholder="添加任务备注..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl outline-none resize-none"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--cream-border)',
                  fontFamily: "'Lora',var(--font-sans)",
                  fontSize: '16px',
                  color: 'var(--cream-dark)',
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full sm:w-auto h-11 px-5 rounded-xl"
                style={{
                  background: 'transparent',
                  color: 'var(--cream-text-muted)',
                  border: '1px solid var(--cream-border)',
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <motion.button
                type="submit"
                className="w-full sm:w-auto h-11 px-5 rounded-xl"
                style={{
                  background: 'var(--warm-orange)',
                  color: 'var(--text-on-primary)',
                  border: 'none',
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(217,119,87,0.25)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                创建任务
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task List */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
      >
        {sortedTasks.length === 0 ? (
          <motion.div
            className="p-8 sm:p-12 rounded-2xl text-center"
            style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p
              className="m-0"
              style={{
                fontFamily: "'Lora',var(--font-sans)",
                fontSize: '0.8125rem',
                color: 'var(--cream-text-muted)',
              }}
            >
              暂无任务，添加一个新任务开始吧！
            </p>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {sortedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                transition={{ delay: 0.1 + index * 0.03, duration: 0.3 }}
                className="p-4 rounded-2xl"
                style={{
                  background: 'var(--cream-bg)',
                  border: '1px solid var(--cream-border)',
                  opacity: task.status === 'completed' ? 0.6 : 1,
                }}
              >
                <div className="flex items-start gap-3">
                  <motion.button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{
                      borderColor: priorityColors[task.priority],
                      background: task.status === 'completed' ? priorityColors[task.priority] : 'transparent',
                      cursor: 'pointer',
                      color: 'var(--text-on-primary)',
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="切换任务状态"
                  >
                    <AnimatePresence mode="wait">
                      {task.status === 'completed' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon name="check" size={12} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start gap-2 mb-2">
                      <p
                        className="m-0 flex-1"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '1rem',
                          fontWeight: 500,
                          color: 'var(--cream-dark)',
                          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          lineHeight: 1.4,
                        }}
                      >
                        {task.title}
                      </p>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            fontFamily: "'Poppins',var(--font-sans)",
                            fontSize: '0.625rem',
                            fontWeight: 500,
                            color: taskTypeColors[task.taskType],
                            background: `color-mix(in srgb, ${taskTypeColors[task.taskType]} 15%, transparent)`,
                          }}
                        >
                          {taskTypeLabels[task.taskType]}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            fontFamily: "'Poppins',var(--font-sans)",
                            fontSize: '0.625rem',
                            fontWeight: 500,
                            color: priorityColors[task.priority],
                            background: `color-mix(in srgb, ${priorityColors[task.priority]} 15%, transparent)`,
                          }}
                        >
                          {priorityLabels[task.priority]}
                        </span>
                      </div>
                    </div>

                    {task.description && (
                      <p
                        className="m-0 mb-2"
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.8125rem',
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--soft-blue)' }}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span
                          style={{
                            fontFamily: "'Poppins',var(--font-sans)",
                            fontSize: '0.75rem',
                            color: 'var(--cream-text-muted)',
                          }}
                        >
                          {isSameDay(task.startDate, task.endDate)
                            ? formatDate(task.startDate)
                            : `${formatDate(task.startDate)} - ${formatDate(task.endDate)}`}
                        </span>
                      </div>

                      {task.taskType === 'recurring' && (
                        <div className="flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--moss-green)' }}>
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                          </svg>
                          <span
                            style={{
                              fontFamily: "'Poppins',var(--font-sans)",
                              fontSize: '0.75rem',
                              color: 'var(--moss-green)',
                              fontWeight: 500,
                            }}
                          >
                            {getRecurringDisplay(task)}
                          </span>
                        </div>
                      )}

                      {task.reminderTime && (
                        <div className="flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--warm-orange)' }}>
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                          <span
                            style={{
                              fontFamily: "'Poppins',var(--font-sans)",
                              fontSize: '0.75rem',
                              color: 'var(--warm-orange)',
                              fontWeight: 500,
                            }}
                          >
                            {formatDateTime(task.reminderTime)}
                            {task.reminded && ' (已提醒)'}
                          </span>
                        </div>
                      )}
                    </div>

                    {task.notes && (
                      <div
                        className="rounded-xl px-3 py-2"
                        style={{
                          background: 'var(--surface-soft)',
                          borderLeft: '3px solid var(--soft-blue)',
                        }}
                      >
                        <p
                          className="m-0"
                          style={{
                            fontFamily: "'Lora',var(--font-sans)",
                            fontSize: '0.75rem',
                            color: 'var(--cream-text-muted)',
                            lineHeight: 1.5,
                          }}
                        >
                          {task.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      color: 'var(--warm-orange)',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="删除任务"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
