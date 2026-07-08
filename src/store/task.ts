import { create } from 'zustand';
import type { Task } from '@/types';

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

const initialTasks: Task[] = [
  {
    id: '1',
    title: '准备下午会议材料',
    description: '整理Q3季度汇报PPT和数据',
    priority: 'high',
    status: 'pending',
    taskType: 'short',
    dueDate: today,
    startDate: today,
    endDate: today,
    reminderTime: new Date(Date.now() + 3600000).toISOString(),
    notes: '需要包含销售额、用户增长、市场份额三个维度的数据对比',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '审核设计方案',
    description: '新版本UI设计稿审核',
    priority: 'medium',
    status: 'pending',
    taskType: 'short',
    dueDate: tomorrow,
    startDate: today,
    endDate: tomorrow,
    notes: '重点关注首页布局和交互流畅性',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '产品季度迭代规划',
    description: '制定Q4产品路线图和迭代计划',
    priority: 'high',
    status: 'pending',
    taskType: 'long',
    dueDate: nextMonth,
    startDate: today,
    endDate: nextMonth,
    reminderTime: new Date(Date.now() + 86400000).toISOString(),
    notes: '包含用户调研、需求分析、原型设计、开发排期四个阶段',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: '每日站会',
    description: '团队每日进度同步',
    priority: 'medium',
    status: 'pending',
    taskType: 'recurring',
    dueDate: today,
    startDate: today,
    endDate: nextMonth,
    reminderTime: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
    recurringRule: {
      frequency: 'daily',
      interval: 1,
    },
    notes: '每天上午9:30，时长15分钟',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: '周报提交',
    description: '每周工作总结',
    priority: 'low',
    status: 'pending',
    taskType: 'recurring',
    dueDate: nextWeek,
    startDate: today,
    endDate: nextMonth,
    reminderTime: new Date(new Date().setHours(17, 0, 0, 0) + (5 - new Date().getDay() + 7) * 86400000).toISOString(),
    recurringRule: {
      frequency: 'weekly',
      weekdays: [5],
    },
    notes: '每周五下午5点前提交',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: '完成周报整理',
    description: '本周工作总结',
    priority: 'medium',
    status: 'completed',
    taskType: 'short',
    dueDate: today,
    startDate: today,
    endDate: today,
    notes: '已提交给主管审批',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date().toISOString(),
  },
];

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  getTodayTasks: () => Task[];
  getCompletedCount: () => number;
  getPendingCount: () => number;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: initialTasks,

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  toggleTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === 'completed' ? 'pending' : 'completed',
              completedAt: task.status === 'pending' ? new Date().toISOString() : undefined,
            }
          : task
      ),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
  },

  getTodayTasks: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().tasks.filter((task) => task.dueDate === today);
  },

  getCompletedCount: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().tasks.filter((task) => task.dueDate === today && task.status === 'completed').length;
  },

  getPendingCount: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().tasks.filter((task) => task.dueDate === today && task.status === 'pending').length;
  },
}));
