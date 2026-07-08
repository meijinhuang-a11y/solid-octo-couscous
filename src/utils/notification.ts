import type { Task } from '@/types';
import type { Note } from '@/types';

const priorityLabels: Record<string, string> = {
  high: '高优先',
  medium: '中优先',
  low: '低优先',
};

const priorityEmoji: Record<string, string> = {
  high: '🔴',
  medium: '🔵',
  low: '🟢',
};

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission === 'denied') {
    return false;
  }
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function sendBrowserNotification(task: Task): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  const notif = new Notification(`任务提醒：${task.title}`, {
    body: task.description || `优先级：${priorityLabels[task.priority]}`,
    icon: undefined,
    tag: task.id,
  });
  notif.onclick = () => {
    window.focus();
    notif.close();
  };
}

export function sendBrowserNoteNotification(note: Note): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  const reminderDesc = note.reminder?.description || '';
  const body = reminderDesc
    ? `${reminderDesc}\n${note.aiSummary || note.content.slice(0, 50)}`
    : (note.aiSummary || note.content.slice(0, 50) + '...');
  const notif = new Notification(`笔记提醒：${note.aiTitle || '新笔记'}`, {
    body,
    icon: undefined,
    tag: note.id,
  });
  notif.onclick = () => {
    window.focus();
    notif.close();
  };
}

export async function sendFeishuNotification(task: Task, webhookUrl: string): Promise<boolean> {
  if (!webhookUrl) return false;

  const timeStr = task.reminderTime
    ? new Date(task.reminderTime).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '现在';

  const card = {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: `${priorityEmoji[task.priority]} 任务提醒`,
        },
        template: task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'blue' : 'green',
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**${task.title}**\n\n${task.description || '暂无描述'}`,
          },
        },
        {
          tag: 'div',
          fields: [
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**优先级**\n${priorityLabels[task.priority]}`,
              },
            },
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**提醒时间**\n${timeStr}`,
              },
            },
          ],
        },
        {
          tag: 'hr',
        },
        {
          tag: 'note',
          elements: [
            {
              tag: 'plain_text',
              content: task.notes ? `备注：${task.notes}` : '来自每日计划的提醒',
            },
          ],
        },
      ],
    },
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
      mode: 'no-cors',
    });
    return true;
  } catch (error) {
    console.error('飞书通知发送失败:', error);
    return false;
  }
}

export async function sendFeishuNoteNotification(note: Note, webhookUrl: string): Promise<boolean> {
  if (!webhookUrl) return false;

  const timeStr = note.reminder?.reminderTime
    ? new Date(note.reminder.reminderTime).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '现在';

  const card = {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: '📝 笔记提醒',
        },
        template: 'blue',
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**${note.aiTitle || '新笔记'}**\n\n${note.aiSummary || note.content.slice(0, 100) + '...'}`,
          },
        },
        {
          tag: 'div',
          fields: [
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**分类**\n${note.aiCategory || '其他'}`,
              },
            },
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**提醒时间**\n${timeStr}`,
              },
            },
          ],
        },
        ...(note.reminder?.description
          ? [
              {
                tag: 'div',
                text: {
                  tag: 'lark_md',
                  content: `**提醒规则**\n${note.reminder.description}`,
                },
              },
            ]
          : []),
        {
          tag: 'hr',
        },
        {
          tag: 'note',
          elements: [
            {
              tag: 'plain_text',
              content: note.aiTags?.length ? `标签：${note.aiTags.join('、')}` : '来自杂事记录的提醒',
            },
          ],
        },
      ],
    },
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
      mode: 'no-cors',
    });
    return true;
  } catch (error) {
    console.error('飞书笔记通知发送失败:', error);
    return false;
  }
}

export async function sendTaskReminder(
  task: Task,
  options: { browser: boolean; feishu: boolean; feishuWebhook?: string }
): Promise<void> {
  const { browser, feishu, feishuWebhook } = options;

  if (browser) {
    const perm = await requestNotificationPermission();
    if (perm) {
      sendBrowserNotification(task);
    }
  }

  if (feishu && feishuWebhook) {
    sendFeishuNotification(task, feishuWebhook);
  }
}

export async function sendNoteReminder(
  note: Note,
  options: { browser: boolean; feishu: boolean; feishuWebhook?: string }
): Promise<void> {
  const { browser, feishu, feishuWebhook } = options;

  if (browser) {
    const perm = await requestNotificationPermission();
    if (perm) {
      sendBrowserNoteNotification(note);
    }
  }

  if (feishu && feishuWebhook) {
    sendFeishuNoteNotification(note, feishuWebhook || '');
  }
}
