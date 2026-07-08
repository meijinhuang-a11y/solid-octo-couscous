import { useEffect } from 'react';
import { useTaskStore } from '@/store/task';
import { useNoteStore } from '@/store/note';
import { useSettingsStore } from '@/store/settings';
import { sendTaskReminder, sendNoteReminder, requestNotificationPermission } from '@/utils/notification';
import type { Task } from '@/types';

function getNextRecurringTime(task: Task, from: Date): Date | null {
  if (!task.recurringRule || !task.reminderTime) return null;

  const rule = task.recurringRule;
  const reminderBase = new Date(task.reminderTime);
  const hours = reminderBase.getHours();
  const minutes = reminderBase.getMinutes();

  const next = new Date(from);
  next.setHours(hours, minutes, 0, 0);

  const interval = rule.interval || 1;

  if (rule.frequency === 'daily') {
    if (next <= from) {
      next.setDate(next.getDate() + interval);
    }
    return next;
  }

  if (rule.frequency === 'weekly') {
    const weekdays = rule.weekdays || [];
    if (weekdays.length === 0) return null;

    const currentDay = next.getDay();
    const sortedWeekdays = [...weekdays].sort((a, b) => a - b);

    let foundDay: number | null = null;
    for (const day of sortedWeekdays) {
      if (day > currentDay || (day === currentDay && next > from)) {
        foundDay = day;
        break;
      }
    }

    if (foundDay === null) {
      foundDay = sortedWeekdays[0];
      next.setDate(next.getDate() + 7);
    }

    const diff = (foundDay - currentDay + 7) % 7;
    if (diff > 0) {
      next.setDate(next.getDate() + diff);
    } else if (next <= from) {
      next.setDate(next.getDate() + 7);
    }

    return next;
  }

  if (rule.frequency === 'monthly') {
    if (next <= from) {
      next.setMonth(next.getMonth() + interval);
    }
    return next;
  }

  return null;
}

function isRecurringDue(task: Task, now: number): boolean {
  if (!task.recurringRule || !task.reminderTime) return false;

  const rule = task.recurringRule;
  if (rule.endDate) {
    const endDate = new Date(rule.endDate);
    endDate.setHours(23, 59, 59, 999);
    if (now > endDate.getTime()) return false;
  }

  if (task.startDate && now < new Date(task.startDate).getTime()) return false;

  const lastReminded = task.lastRemindedAt ? new Date(task.lastRemindedAt).getTime() : 0;
  const nextTime = getNextRecurringTime(task, new Date(lastReminded || Date.now() - 60000));

  if (!nextTime) return false;
  const diff = nextTime.getTime() - now;

  return diff <= 0 && diff > -60000;
}

export function useTaskReminder() {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const notes = useNoteStore((state) => state.notes);
  const incrementNoteReminder = useNoteStore((state) => state.incrementReminderTrigger);
  const browserEnabled = useSettingsStore((state) => state.browserNotification);
  const feishuEnabled = useSettingsStore((state) => state.feishuNotification);
  const feishuWebhook = useSettingsStore((state) => state.feishuWebhookUrl);

  useEffect(() => {
    if (browserEnabled) {
      requestNotificationPermission();
    }
  }, [browserEnabled]);

  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now();

      // Check task reminders
      tasks.forEach((task) => {
        if (task.status === 'completed') return;

        if (task.taskType === 'short' || task.taskType === 'long') {
          if (!task.reminderTime) return;
          if (task.reminded) return;

          const reminderTime = new Date(task.reminderTime).getTime();
          const diff = reminderTime - now;

          if (diff <= 0 && diff > -60000) {
            sendTaskReminder(task, {
              browser: browserEnabled,
              feishu: feishuEnabled,
              feishuWebhook,
            });
            updateTask(task.id, { reminded: true });
          }
          return;
        }

        if (task.taskType === 'recurring') {
          if (isRecurringDue(task, now)) {
            sendTaskReminder(task, {
              browser: browserEnabled,
              feishu: feishuEnabled,
              feishuWebhook,
            });
            updateTask(task.id, {
              lastRemindedAt: new Date().toISOString(),
            });
          }
        }
      });

      // Check note reminders
      notes.forEach((note) => {
        if (!note.reminder) return;
        if (note.completed) return;
        if (note.reminder.type === 'none') return;

        const reminderTime = new Date(note.reminder.reminderTime).getTime();
        const diff = reminderTime - now;

        // 时间到了（在60秒窗口内）
        if (diff <= 0 && diff > -60000) {
          // 防止同一分钟内重复触发
          const lastTriggerTime = note.reminder.lastTriggerTime;
          if (lastTriggerTime && now - lastTriggerTime < 60000) return;

          sendNoteReminder(note, {
            browser: browserEnabled,
            feishu: feishuEnabled,
            feishuWebhook,
          });

          // 更新触发计数和下次时间
          incrementNoteReminder(note.id);
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [tasks, notes, browserEnabled, feishuEnabled, feishuWebhook, updateTask, incrementNoteReminder]);
}
