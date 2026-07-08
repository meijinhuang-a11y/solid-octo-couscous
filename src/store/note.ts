import { create } from 'zustand';
import type { Note, NoteReminderRule, Task } from '@/types';
import { useTaskStore } from '@/store/task';

const CATEGORY_CONFIG: Record<string, { keywords: string[]; color: string }> = {
  工作: {
    keywords: ['会议', '项目', '任务', '汇报', '方案', '计划', 'ppt', '客户', '团队', '招聘', '开发', '审核', '报告', '进度', '交付', '验收', '文档', '评审', '上线', '发布', '迭代', '需求', '测试'],
    color: 'var(--warm-orange)',
  },
  学习: {
    keywords: ['阅读', '书籍', '培训', '考试', '知识', '课程', '技能', '考证', '学习', '教程', '笔记', '研究', '论文', '资料', '复习', '备考', '外语', '英语'],
    color: 'var(--soft-blue)',
  },
  生活: {
    keywords: ['日常', '健康', '饮食', '旅行', '家务', '购物', '好物', '运动', '健身', '美容', '穿搭', '做饭', '买菜', '洗衣', '打扫', '聚餐', '约会', '电影', '音乐'],
    color: 'var(--moss-green)',
  },
  财务: {
    keywords: ['账单', '报销', '预算', '投资', '工资', '理财', '税务', '记账', '信用卡', '房贷', '车贷', '保险', '基金', '股票', '存款', '支出', '收入'],
    color: '#d4a574',
  },
  待办: {
    keywords: ['待办', '清单', '临时', '备忘', '提醒', '事项', '打卡', '日程', '安排', '记住', '别忘了', '记得', '赶紧'],
    color: '#a78bfa',
  },
  灵感: {
    keywords: ['创意', '想法', '设计', '灵感', '风格', '色彩', 'ui', 'ux', '排版', '配色', '动效', '交互', '视觉', '概念', '构思', '草图'],
    color: '#f472b6',
  },
  技术: {
    keywords: ['编程', '代码', '工具', '开发', '框架', '算法', '技术', 'bug', '部署', 'api', '前端', '后端', '数据库', '服务器', 'git', 'github', 'docker', 'python', 'javascript', 'react'],
    color: '#38bdf8',
  },
  沟通: {
    keywords: ['邮件', '微信', '电话', '社交', '聊天', '反馈', '采访', '访谈', '汇报', '沟通', '协调', '对接', '联系', '回复', '消息', '通知'],
    color: '#fbbf24',
  },
  规划: {
    keywords: ['目标', '计划', '复盘', '总结', '年度', '季度', '月度', 'okr', 'kpi', '战略', '方向', '愿景', '里程碑', '阶段', '路线图'],
    color: '#8b5cf6',
  },
  其他: {
    keywords: ['其他', '杂项', '随笔', '随想', '记录', '日记', '心情', '感悟', '吐槽'],
    color: 'var(--cream-text-muted)',
  },
};

const getCategoryColor = (cat: string) => CATEGORY_CONFIG[cat]?.color || 'var(--cream-text-muted)';

// 时间表达解析
const parseTimeExpression = (text: string): { hour: number; minute: number } | null => {
  const lower = text.toLowerCase();

  // 早八点 / 早8点 / 早上8点
  let m = lower.match(/(?:早|早上|早晨|上午)?\s*(\d{1,2})\s*[点:：时]\s*(\d{1,2})?\s*分?/);
  if (m) {
    const hour = parseInt(m[1], 10);
    const minute = m[2] ? parseInt(m[2], 10) : 0;
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return { hour, minute };
    }
  }

  // 早八点 / 晚八点 (中文数字)
  const cnMap: Record<string, number> = {
    '零': 0, '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '十一': 11, '十二': 12,
  };
  m = lower.match(/(?:早|早上|早晨|上午|下午|晚|晚上|夜晚)?\s*([零一二两三四五六七八九十]+)\s*点\s*(?:半|([零一二三四五六七八九十]+)\s*分)?/);
  if (m) {
    const h = cnMap[m[1]];
    if (h !== undefined) {
      let hour = h;
      // 下午/晚上 +12
      if ((lower.includes('下午') || lower.includes('晚') || lower.includes('夜晚')) && hour < 12) {
        hour += 12;
      }
      let minute = 0;
      if (m[2] === '半') minute = 30;
      else if (m[3]) minute = cnMap[m[3]] || 0;
      return { hour, minute };
    }
  }

  return null;
};

// 日期解析
const parseDateExpression = (text: string): { date: Date; matched: boolean } => {
  const now = new Date();
  const lower = text.toLowerCase();
  const result = new Date(now);

  if (lower.includes('今天')) {
    // 保持今天
  } else if (lower.includes('明天')) {
    result.setDate(result.getDate() + 1);
  } else if (lower.includes('后天')) {
    result.setDate(result.getDate() + 2);
  } else if (lower.includes('大后天')) {
    result.setDate(result.getDate() + 3);
  } else if (lower.includes('下周一')) { result.setDate(result.getDate() + ((8 - result.getDay()) % 7 || 7)); }
  else if (lower.includes('下周二')) { result.setDate(result.getDate() + ((9 - result.getDay()) % 7 || 7)); }
  else if (lower.includes('下周三')) { result.setDate(result.getDate() + ((10 - result.getDay()) % 7 || 7)); }
  else if (lower.includes('下周四')) { result.setDate(result.getDate() + ((11 - result.getDay()) % 7 || 7)); }
  else if (lower.includes('下周五')) { result.setDate(result.getDate() + ((12 - result.getDay()) % 7 || 7)); }
  else if (lower.includes('下周六')) { result.setDate(result.getDate() + ((13 - result.getDay()) % 7 || 7)); }
  else if (lower.includes('下周日') || lower.includes('下周天')) { result.setDate(result.getDate() + ((14 - result.getDay()) % 7 || 7)); }
  // 周X / 星期X
  else {
    const weekdayMatch = lower.match(/(?:周|星期|礼拜)\s*([一二三四五六日天])/);
    if (weekdayMatch) {
      const dayMap: Record<string, number> = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 0, '天': 0 };
      const target = dayMap[weekdayMatch[1]];
      const current = result.getDay();
      let diff = (target - current + 7) % 7;
      if (diff === 0) diff = 7; // 下个周X
      result.setDate(result.getDate() + diff);
    }
  }

  return { date: result, matched: lower !== text };
};

// 提醒规则解析
const parseReminderRule = (content: string): { rule: NoteReminderRule | null; cleanedContent: string } => {
  const lower = content.toLowerCase();

  // 检测是否包含提醒关键词
  const reminderKeywords = ['提醒', '通知', '叫我', '别忘', '记得'];
  const hasReminder = reminderKeywords.some((k) => lower.includes(k));

  if (!hasReminder) {
    return { rule: null, cleanedContent: content };
  }

  // 找到提醒相关句子
  const sentences = content.split(/[。\n；;]/).filter((s) => s.trim());
  let reminderSentence = '';
  let cleanedContent = content;

  for (const s of sentences) {
    if (reminderKeywords.some((k) => s.toLowerCase().includes(k))) {
      reminderSentence = s.trim();
      break;
    }
  }

  if (!reminderSentence) {
    return { rule: null, cleanedContent: content };
  }

  // 从内容中移除提醒句子
  cleanedContent = content.replace(reminderSentence, '').replace(/[。\n；;]{2,}/g, '\n').trim();
  if (!cleanedContent) cleanedContent = reminderSentence; // 保留原文

  const now = new Date();
  const rule: Partial<NoteReminderRule> = {
    originalText: reminderSentence,
    triggeredCount: 0,
  };

  // 解析时间
  const timeInfo = parseTimeExpression(reminderSentence);

  // 解析日期
  const dateInfo = parseDateExpression(reminderSentence);

  // 设置基础时间
  const baseTime = new Date(dateInfo.date);
  if (timeInfo) {
    baseTime.setHours(timeInfo.hour, timeInfo.minute, 0, 0);
  } else {
    // 没有时间，默认9点
    baseTime.setHours(9, 0, 0, 0);
  }

  // 如果是今天但时间已过，推到明天
  if (baseTime <= now && !reminderSentence.includes('明天') && !reminderSentence.includes('后天')) {
    // 检查是否是重复任务
    if (!reminderSentence.includes('每天') && !reminderSentence.includes('每周') && !reminderSentence.includes('每月')) {
      baseTime.setDate(baseTime.getDate() + 1);
    }
  }

  rule.reminderTime = baseTime.toISOString();

  // 判断类型
  // 1. 直至完成
  if (reminderSentence.includes('直至完成') || reminderSentence.includes('直到完成') || reminderSentence.includes('直到做完') || reminderSentence.includes('直至做完')) {
    rule.type = 'until-done';
    rule.untilDone = true;

    // 每天/每周
    if (reminderSentence.includes('每天') || reminderSentence.includes('每日')) {
      rule.frequency = 'daily';
      rule.interval = 1;
    } else if (reminderSentence.includes('每周')) {
      rule.frequency = 'weekly';
      rule.interval = 1;
      // 解析周几
      const weekdayMatch = reminderSentence.match(/周\s*([一二三四五六日天])/);
      if (weekdayMatch) {
        const dayMap: Record<string, number> = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 0, '天': 0 };
        rule.weekdays = [dayMap[weekdayMatch[1]]];
      }
    }
  }
  // 2. 重复任务 - 每天/每周/每月
  else if (reminderSentence.includes('每天') || reminderSentence.includes('每日')) {
    rule.type = 'recurring';
    rule.frequency = 'daily';
    rule.interval = 1;
  } else if (reminderSentence.includes('每周')) {
    rule.type = 'recurring';
    rule.frequency = 'weekly';
    rule.interval = 1;
    const weekdayMatch = reminderSentence.match(/周\s*([一二三四五六日天])/);
    if (weekdayMatch) {
      const dayMap: Record<string, number> = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 0, '天': 0 };
      rule.weekdays = [dayMap[weekdayMatch[1]]];
    }
  } else if (reminderSentence.includes('每月') || reminderSentence.includes('每月')) {
    rule.type = 'recurring';
    rule.frequency = 'monthly';
    rule.interval = 1;
  }
  // 3. 多次提醒
  else {
    const multiMatch = reminderSentence.match(/(\d+)\s*遍|(\d+)\s*次/);
    const cnMultiMatch = reminderSentence.match(/([一二三四五六七八九十])\s*(?:遍|次)/);
    const cnMap: Record<string, number> = {
      '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5,
      '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
    };

    let repeatCount = 0;
    if (multiMatch) {
      repeatCount = parseInt(multiMatch[1] || multiMatch[2], 10);
    } else if (cnMultiMatch) {
      repeatCount = cnMap[cnMultiMatch[1]] || 0;
    }

    if (repeatCount > 1) {
      rule.type = 'multi';
      rule.repeatCount = repeatCount;
      // 每次间隔5分钟
    } else {
      rule.type = 'once';
    }
  }

  // 生成描述
  let description = '';
  if (rule.type === 'until-done') {
    description = rule.frequency === 'weekly'
      ? `每周${rule.weekdays?.length ? ['日', '一', '二', '三', '四', '五', '六'][rule.weekdays[0]] : ''}提醒，直至完成`
      : '每天提醒，直至完成';
  } else if (rule.type === 'recurring') {
    if (rule.frequency === 'daily') description = '每天重复提醒';
    else if (rule.frequency === 'weekly') {
      const wd = rule.weekdays?.length ? ['日', '一', '二', '三', '四', '五', '六'][rule.weekdays[0]] : '';
      description = `每周${wd}重复提醒`;
    } else if (rule.frequency === 'monthly') description = '每月重复提醒';
  } else if (rule.type === 'multi') {
    description = `提醒${rule.repeatCount}次（每次间隔5分钟）`;
  } else {
    description = '单次提醒';
  }

  const timeStr = `${baseTime.getHours().toString().padStart(2, '0')}:${baseTime.getMinutes().toString().padStart(2, '0')}`;
  const dateStr = `${baseTime.getMonth() + 1}/${baseTime.getDate()}`;
  description += ` · ${dateStr} ${timeStr}`;

  rule.description = description;

  return { rule: rule as NoteReminderRule, cleanedContent };
};

const initialNotes: Note[] = [
  {
    id: '1',
    content: '1. Q3产品规划讨论\n2. 团队招聘进度\n3. 新功能上线安排\n4. 客户反馈整理',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    pinned: true,
    aiTitle: '下周会议要点',
    aiTags: ['会议', '产品规划', '招聘', '客户反馈'],
    aiCategory: '工作',
    aiSummary: '下周会议将讨论Q3产品规划、团队招聘、新功能上线和客户反馈等事项。',
    aiKeyPoints: ['Q3产品规划', '团队招聘', '新功能上线', '客户反馈'],
    reminder: null,
    completed: false,
  },
  {
    id: '2',
    content: '《原子习惯》- 讲述如何通过微小的改变获得惊人的结果，核心是习惯养成的四大定律：让它显而易见、让它有吸引力、让它简便易行、让它令人愉悦。\n《思考，快与慢》- 丹尼尔·卡尼曼的经典著作，探讨人类思维的两种模式：快速的直觉思维和缓慢的理性思维。\n《穷查理宝典》- 收录了查理·芒格的智慧箴言，涵盖投资、人生哲学和决策思维。\n《创新者的窘境》- 分析为什么成功的公司会被颠覆性创新所颠覆。',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    aiTitle: '读书清单',
    aiTags: ['阅读', '书籍', '习惯', '思维', '投资', '创新'],
    aiCategory: '学习',
    aiSummary: '推荐四本个人成长书籍，涵盖习惯养成、思维模式、投资智慧和创新理论。',
    aiKeyPoints: ['原子习惯：四大定律养成习惯', '思考快与慢：两种思维模式', '穷查理宝典：投资与人生智慧', '创新者的窘境：颠覆性创新'],
    reminder: null,
    completed: false,
  },
  {
    id: '3',
    content: '奶油色风格设计系统：使用温暖的米色和棕色色调，营造温馨舒适的视觉体验，适合家居、美妆等行业。\n极简主义 dashboard：简洁的布局，大量留白，突出核心数据，减少视觉干扰。\n玻璃拟态卡片设计：半透明背景配合模糊效果，增加层次感和现代感。\n微交互动效参考：按钮悬停效果、页面切换动画、加载状态反馈等细节提升用户体验。',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    aiTitle: '设计灵感收集',
    aiTags: ['设计', '奶油色', '极简主义', '玻璃拟态', '动效'],
    aiCategory: '灵感',
    aiSummary: '收集了四种设计风格灵感：奶油色系统、极简dashboard、玻璃拟态和微交互动效。',
    aiKeyPoints: ['奶油色风格：温暖米色棕色', '极简dashboard：简洁留白', '玻璃拟态：半透明模糊', '微交互动效：细节提升体验'],
    reminder: null,
    completed: false,
  },
  {
    id: '4',
    content: '回复客户邮件',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiTitle: '回复客户邮件',
    aiTags: ['邮件', '客户'],
    aiCategory: '工作',
    aiSummary: '需要回复客户邮件',
    aiKeyPoints: ['回复客户邮件'],
    reminder: {
      type: 'until-done',
      reminderTime: new Date(Date.now() + 3600000).toISOString(),
      frequency: 'daily',
      interval: 1,
      untilDone: true,
      triggeredCount: 0,
      description: '每天提醒，直至完成 · ' + new Date(Date.now() + 3600000).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      originalText: '每天早8点提醒我一次直至完成',
    },
    completed: false,
  },
  {
    id: '5',
    content: '健身打卡',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    aiTitle: '健身打卡',
    aiTags: ['运动', '健身'],
    aiCategory: '生活',
    aiSummary: '每周六健身打卡提醒',
    aiKeyPoints: ['健身打卡'],
    reminder: {
      type: 'recurring',
      reminderTime: new Date(Date.now() + 86400000).toISOString(),
      frequency: 'weekly',
      interval: 1,
      weekdays: [6],
      triggeredCount: 0,
      description: '每周六重复提醒',
      originalText: '每周六早八点和晚八点提醒我',
    },
    completed: false,
  },
];

const aiProcess = (content: string): {
  aiTitle: string;
  aiTags: string[];
  aiCategory: string;
  aiSummary: string;
  aiKeyPoints: string[];
} => {
  if (!content.trim()) {
    return {
      aiTitle: '空白笔记',
      aiTags: [],
      aiCategory: '其他',
      aiSummary: '',
      aiKeyPoints: [],
    };
  }

  const lines = content.split('\n').filter((l) => l.trim());
  const allText = content.toLowerCase();

  // 生成标题
  let aiTitle = '';
  const firstLine = lines[0]?.trim() || '';
  if (firstLine.length <= 15) {
    aiTitle = firstLine.replace(/^[0-9.\-*•]+[\s]*|^[-*•]+[\s]*/u, '').replace(/^(✅|⏳|📋)+[\s]*/, '');
  } else if (firstLine.includes(':') || firstLine.includes('：')) {
    const parts = firstLine.split(/[:：]/);
    aiTitle = parts[0].trim().slice(0, 15);
  } else {
    aiTitle = firstLine.slice(0, 12) + (firstLine.length > 12 ? '...' : '');
  }
  if (!aiTitle.trim()) {
    aiTitle = '新笔记';
  }

  // 分类判断
  let aiCategory = '其他';
  let maxScore = 0;
  Object.entries(CATEGORY_CONFIG).forEach(([cat, config]) => {
    const score = config.keywords.filter((k) => allText.includes(k)).length;
    if (score > maxScore) {
      maxScore = score;
      aiCategory = cat;
    }
  });

  // 生成标签
  const aiTags: string[] = [];
  Object.values(CATEGORY_CONFIG).forEach((config) => {
    config.keywords.forEach((keyword) => {
      if (allText.includes(keyword) && !aiTags.includes(keyword) && aiTags.length < 6) {
        aiTags.push(keyword);
      }
    });
  });
  if (aiTags.length === 0) {
    aiTags.push('笔记');
  }

  // 生成关键要点
  const aiKeyPoints: string[] = [];
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.length > 5 && trimmed.length < 80) {
      const cleaned = trimmed.replace(/^[0-9.\-*•]+[\s]*|^[-*•]+[\s]*/u, '').replace(/^(✅|⏳|📋)+[\s]*/, '');
      if (cleaned.length > 3 && !aiKeyPoints.some((p) => p.includes(cleaned.slice(0, 20)))) {
        aiKeyPoints.push(cleaned);
      }
    }
  });
  if (aiKeyPoints.length === 0 && lines.length > 0) {
    lines.slice(0, 4).forEach((line) => {
      const trimmed = line.trim().slice(0, 50);
      if (trimmed && !aiKeyPoints.includes(trimmed)) {
        aiKeyPoints.push(trimmed);
      }
    });
  }

  // 生成摘要
  const aiSummary = lines.length <= 2
    ? content.slice(0, 60) + (content.length > 60 ? '...' : '')
    : `共包含 ${lines.length} 条内容，涉及${aiTags.slice(0, 3).join('、')}等方面。`;

  return {
    aiTitle: aiTitle.slice(0, 20),
    aiTags: aiTags.slice(0, 6),
    aiCategory,
    aiSummary: aiSummary.slice(0, 80),
    aiKeyPoints: aiKeyPoints.slice(0, 6),
  };
};

// 将笔记同步为任务
const syncNoteToTask = (note: Note, isNew: boolean = true) => {
  const category = note.aiCategory || '其他';
  const isWorkOrPlan = category === '工作' || category === '规划';

  if (!isWorkOrPlan) return;

  const taskStore = useTaskStore.getState();

  // 检查是否已经存在关联的任务（避免重复创建）
  const existingTask = taskStore.tasks.find(
    (t) => t.title === note.aiTitle && t.notes?.includes(`note-id:${note.id}`)
  );

  if (existingTask && !isNew) {
    // 更新已有任务
    taskStore.updateTask(existingTask.id, {
      title: note.aiTitle || '未命名任务',
      description: note.aiSummary,
      priority: category === '工作' ? 'high' : 'medium',
      dueDate: note.reminder?.reminderTime
        ? new Date(note.reminder.reminderTime).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      reminderTime: note.reminder?.reminderTime,
      status: note.completed ? 'completed' : 'pending',
    });
  } else if (!existingTask) {
    // 创建新任务
    const dueDate = note.reminder?.reminderTime
      ? new Date(note.reminder.reminderTime).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    let taskType: Task['taskType'] = 'short';
    let recurringRule: Task['recurringRule'] = undefined;

    if (note.reminder?.type === 'recurring' || note.reminder?.type === 'until-done') {
      taskType = 'recurring';
      recurringRule = {
        frequency: note.reminder.frequency || 'daily',
        interval: note.reminder.interval,
        weekdays: note.reminder.weekdays,
      };
    } else if (note.reminder?.type === 'multi') {
      taskType = 'short';
    }

    taskStore.addTask({
      title: note.aiTitle || '未命名任务',
      description: note.aiSummary,
      priority: category === '工作' ? 'high' : 'medium',
      status: note.completed ? 'completed' : 'pending',
      taskType,
      dueDate,
      startDate: new Date().toISOString().split('T')[0],
      endDate: dueDate,
      reminderTime: note.reminder?.reminderTime,
      recurringRule,
      notes: `来自笔记：${note.aiTitle}\nnote-id:${note.id}`,
    });
  }
};

interface NoteState {
  notes: Note[];
  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  togglePinned: (id: string) => void;
  toggleCompleted: (id: string) => void;
  clearReminder: (id: string) => void;
  incrementReminderTrigger: (id: string) => void;
  searchNotes: (query: string) => Note[];
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: initialNotes,

  addNote: (content: string) => {
    const now = new Date().toISOString();
    const { rule, cleanedContent } = parseReminderRule(content);
    const finalContent = cleanedContent || content;
    const finalAiData = aiProcess(finalContent);

    const newNote: Note = {
      id: Date.now().toString(),
      content: finalContent,
      createdAt: now,
      updatedAt: now,
      ...finalAiData,
      reminder: rule,
      completed: false,
    };
    set((state) => ({ notes: [newNote, ...state.notes] }));

    // 同步到每日计划
    setTimeout(() => syncNoteToTask(newNote, true), 0);
  },

  updateNote: (id: string, content: string) => {
    const { rule, cleanedContent } = parseReminderRule(content);
    const finalContent = cleanedContent || content;
    const finalAiData = aiProcess(finalContent);

    let updatedNote: Note | null = null;

    set((state) => ({
      notes: state.notes.map((note) => {
        if (note.id === id) {
          updatedNote = {
            ...note,
            content: finalContent,
            ...finalAiData,
            reminder: rule,
            updatedAt: new Date().toISOString(),
          };
          return updatedNote;
        }
        return note;
      }),
    }));

    // 同步到每日计划
    if (updatedNote) {
      setTimeout(() => syncNoteToTask(updatedNote!, false), 0);
    }
  },

  deleteNote: (id: string) => {
    set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
  },

  togglePinned: (id: string) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      ),
    }));
  },

  toggleCompleted: (id: string) => {
    let toggledNote: Note | null = null;
    set((state) => ({
      notes: state.notes.map((note) => {
        if (note.id === id) {
          toggledNote = {
            ...note,
            completed: !note.completed,
            // 完成后清除 until-done 提醒
            ...(note.completed ? {} : { reminder: note.reminder?.type === 'until-done' ? null : note.reminder }),
          };
          return toggledNote;
        }
        return note;
      }),
    }));

    // 同步任务完成状态
    if (toggledNote && (toggledNote.aiCategory === '工作' || toggledNote.aiCategory === '规划')) {
      const taskStore = useTaskStore.getState();
      const existingTask = taskStore.tasks.find(
        (t) => t.notes?.includes(`note-id:${id}`)
      );
      if (existingTask) {
        taskStore.updateTask(existingTask.id, {
          status: toggledNote.completed ? 'completed' : 'pending',
        });
      }
    }
  },

  clearReminder: (id: string) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, reminder: null } : note
      ),
    }));
  },

  incrementReminderTrigger: (id: string) => {
    set((state) => ({
      notes: state.notes.map((note) => {
        if (note.id !== id || !note.reminder) return note;
        const triggeredCount = (note.reminder.triggeredCount || 0) + 1;
        const now = Date.now();

        // 多次提醒：达到次数后清除
        if (note.reminder.type === 'multi' && triggeredCount >= (note.reminder.repeatCount || 0)) {
          return { ...note, reminder: null };
        }

        // 计算下次提醒时间
        let nextTime = new Date(note.reminder.reminderTime);
        if (note.reminder.type === 'multi') {
          // 多次提醒：间隔5分钟
          nextTime = new Date(now + 5 * 60 * 1000);
        } else if (note.reminder.type === 'once') {
          // 单次提醒：触发后清除
          return { ...note, reminder: null };
        } else if (note.reminder.frequency === 'daily') {
          nextTime.setDate(nextTime.getDate() + (note.reminder.interval || 1));
        } else if (note.reminder.frequency === 'weekly') {
          nextTime.setDate(nextTime.getDate() + 7 * (note.reminder.interval || 1));
        } else if (note.reminder.frequency === 'monthly') {
          nextTime.setMonth(nextTime.getMonth() + (note.reminder.interval || 1));
        }

        return {
          ...note,
          reminder: {
            ...note.reminder,
            triggeredCount,
            reminderTime: nextTime.toISOString(),
            lastTriggerTime: now,
          },
        };
      }),
    }));
  },

  searchNotes: (query: string) => {
    const lower = query.toLowerCase();
    return get().notes.filter(
      (note) =>
        note.content.toLowerCase().includes(lower) ||
        note.aiTitle?.toLowerCase().includes(lower) ||
        note.aiTags?.some((tag) => tag.toLowerCase().includes(lower)) ||
        note.aiSummary?.toLowerCase().includes(lower) ||
        note.aiKeyPoints?.some((point) => point.toLowerCase().includes(lower))
    );
  },
}));

export { getCategoryColor, CATEGORY_CONFIG, parseReminderRule };
