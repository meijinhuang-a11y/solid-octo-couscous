import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNoteStore, getCategoryColor, parseReminderRule } from '@/store/note';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import type { Note, NoteReminderRule } from '@/types';

const reminderTypeIcons: Record<string, string> = {
  once: '🔔',
  recurring: '🔁',
  multi: '⚡',
  'until-done': '♾️',
};

const reminderTypeLabels: Record<string, string> = {
  once: '单次',
  recurring: '重复',
  multi: '多次',
  'until-done': '直至完成',
};

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, togglePinned, toggleCompleted, clearReminder, searchNotes } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [showEditor, setShowEditor] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [detailNote, setDetailNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [parsedReminder, setParsedReminder] = useState<NoteReminderRule | null>(null);
  const voiceBaseContentRef = useRef('');

  const voice = useVoiceInput();

  const categories = useMemo(() => {
    const cats = new Set(notes.map((n) => n.aiCategory || '其他'));
    return ['全部', ...Array.from(cats)];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let result = notes;
    if (searchQuery) {
      result = searchNotes(searchQuery);
    }
    if (selectedCategory !== '全部') {
      result = result.filter((n) => (n.aiCategory || '其他') === selectedCategory);
    }
    return [...result].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, searchQuery, selectedCategory, searchNotes]);

  // 实时解析输入内容的提醒规则
  useEffect(() => {
    if (content.trim()) {
      const { rule } = parseReminderRule(content);
      setParsedReminder(rule);
    } else {
      setParsedReminder(null);
    }
  }, [content]);

  // 语音输入开始时记录当前内容
  useEffect(() => {
    if (voice.isListening) {
      voiceBaseContentRef.current = content;
    }
  }, [voice.isListening, content]);

  // 语音输入结束后追加到内容
  useEffect(() => {
    if (!voice.isListening && voice.transcript) {
      const newContent = voice.appendTranscript(voiceBaseContentRef.current);
      setContent(newContent);
      voice.clearTranscript();
      voiceBaseContentRef.current = '';
    }
  }, [voice.isListening, voice.transcript, voice]);

  // 语音输入过程中实时显示内容
  const displayContent = voice.isListening
    ? voiceBaseContentRef.current + (voiceBaseContentRef.current && (voice.transcript || voice.interimTranscript) ? '\n' : '') + voice.transcript + voice.interimTranscript
    : content;

  const openEditor = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setContent(note.content);
    } else {
      setEditingNote(null);
      setContent('');
    }
    setParsedReminder(null);
    setShowEditor(true);
    setShowDetail(false);
  };

  const openDetail = (note: Note) => {
    setDetailNote(note);
    setShowDetail(true);
    setShowEditor(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (editingNote) {
      updateNote(editingNote.id, content.trim());
    } else {
      addNote(content.trim());
    }
    setShowEditor(false);
  };

  const handleVoiceToggle = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) {
      return `今天 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return `${d.getMonth() + 1}月${d.getDate()}日`;
    }
  };

  const formatReminderTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const d = new Date(timeStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === d.toDateString();
    const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    if (isToday) return `今天 ${time}`;
    if (isTomorrow) return `明天 ${time}`;
    return `${d.getMonth() + 1}/${d.getDate()} ${time}`;
  };

  return (
    <div className="p-4 sm:p-6">
      <motion.div
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="relative w-full sm:w-auto">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cream-text-muted)', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索笔记..."
            className="w-full sm:w-64 h-11 pl-10 pr-4 rounded-xl outline-none"
            style={{
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '16px',
              color: 'var(--cream-dark)',
            }}
          />
        </div>
        <motion.button
          type="button"
          onClick={() => openEditor()}
          className="w-full sm:w-auto h-11 px-5 rounded-xl flex items-center justify-center gap-2"
          style={{
            background: 'var(--soft-blue)',
            color: 'var(--text-on-primary)',
            border: 'none',
            fontFamily: "'Poppins',var(--font-sans)",
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(106,155,204,0.3)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新建笔记
        </motion.button>
      </motion.div>

      <motion.div
        className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className="flex-shrink-0 px-4 h-11 rounded-full flex items-center justify-center"
            style={{
              background: selectedCategory === cat
                ? `color-mix(in srgb, ${getCategoryColor(cat)} 15%, transparent)`
                : 'var(--cream-bg)',
              color: selectedCategory === cat ? getCategoryColor(cat) : 'var(--cream-text-muted)',
              border: `1px solid ${selectedCategory === cat ? getCategoryColor(cat) : 'var(--cream-border)'}`,
              fontFamily: "'Poppins',var(--font-sans)",
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              className="p-4 rounded-2xl cursor-pointer group relative cream-card-hover"
              style={{
                background: note.completed
                  ? 'rgba(138,191,146,0.08)'
                  : note.pinned
                  ? 'rgba(251,191,36,0.08)'
                  : 'var(--cream-bg)',
                border: note.completed
                  ? '1px solid rgba(138,191,146,0.3)'
                  : note.pinned
                  ? '1px solid rgba(251,191,36,0.3)'
                  : '1px solid var(--cream-border)',
                minHeight: '140px',
                opacity: note.completed ? 0.7 : 1,
              }}
              onClick={() => openDetail(note)}
              whileTap={{ scale: 0.98 }}
            >
              {/* Pinned indicator */}
              {note.pinned && !note.completed && (
                <motion.div
                  className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--warm-orange)',
                    boxShadow: '0 2px 6px rgba(217,119,87,0.3)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none">
                    <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
                  </svg>
                </motion.div>
              )}

              {/* Reminder indicator */}
              {note.reminder && !note.completed && (
                <div
                  className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(106,155,204,0.12)',
                    border: '1px solid rgba(106,155,204,0.2)',
                  }}
                  title={note.reminder.description}
                >
                  <span style={{ fontSize: '0.625rem' }}>
                    {reminderTypeIcons[note.reminder.type]}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.5625rem',
                      color: 'var(--soft-blue)',
                      fontWeight: 500,
                    }}
                  >
                    {formatReminderTime(note.reminder.reminderTime)}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-2">
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    fontFamily: "'Poppins',var(--font-sans)",
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    color: getCategoryColor(note.aiCategory || '其他'),
                    background: `color-mix(in srgb, ${getCategoryColor(note.aiCategory || '其他')} 15%, transparent)`,
                  }}
                >
                  {note.aiCategory || '其他'}
                </span>
                {/* 操作按钮：默认隐藏，hover/卡片激活时显示 */}
                <div
                  className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ marginRight: note.reminder ? '90px' : '0' }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompleted(note.id);
                    }}
                    className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/60"
                    style={{
                      color: note.completed ? 'var(--moss-green)' : 'var(--cream-text-muted)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    title={note.completed ? '标记未完成' : '标记完成'}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill={note.completed ? 'var(--moss-green)' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinned(note.id);
                    }}
                    className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/60"
                    style={{
                      color: note.pinned ? 'var(--warm-orange)' : 'var(--cream-text-muted)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    title={note.pinned ? '取消置顶' : '置顶'}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill={note.pinned ? 'var(--warm-orange)' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditor(note);
                    }}
                    className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/60"
                    style={{
                      color: 'var(--soft-blue)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    title="编辑"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/60"
                    style={{
                      color: 'var(--warm-orange)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    title="删除"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <h4
                className="m-0 mb-2"
                style={{
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--cream-dark)',
                  lineHeight: 1.4,
                  textDecoration: note.completed ? 'line-through' : 'none',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {note.aiTitle || '新笔记'}
              </h4>
              {note.aiSummary && (
                <p
                  className="m-0 mb-3"
                  style={{
                    fontFamily: "'Lora',var(--font-sans)",
                    fontSize: '0.8125rem',
                    color: 'var(--soft-blue)',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {note.aiSummary}
                </p>
              )}
              {note.aiKeyPoints && note.aiKeyPoints.length > 0 && (
                <div className="mb-3">
                  {note.aiKeyPoints.slice(0, 3).map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-1.5 mb-1"
                    >
                      <span
                        style={{
                          color: 'var(--moss-green)',
                          fontSize: '0.625rem',
                          marginTop: '0.125rem',
                        }}
                      >
                        •
                      </span>
                      <span
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--cream-text-muted)',
                        }}
                      >
                        {point.slice(0, 40)}
                        {point.length > 40 && '...'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {note.aiTags && note.aiTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.625rem',
                        color: 'var(--soft-blue)',
                        background: 'rgba(106,155,204,0.1)',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "'Lora',var(--font-sans)",
                    fontSize: '0.625rem',
                    color: 'var(--cream-text-muted)',
                  }}
                >
                  {formatDate(note.updatedAt)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredNotes.length === 0 && (
        <motion.div
          className="text-center py-16 rounded-2xl"
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
            暂无笔记，点击右上角新建一条吧
          </p>
        </motion.div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.4)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (voice.isListening) voice.stopListening();
                setShowEditor(false);
              }}
            />
            <motion.div
              className="fixed z-50 w-[95vw] sm:w-[600px] max-h-[85vh] rounded-2xl p-4 sm:p-6 flex flex-col"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--cream-bg)',
                border: '1px solid var(--cream-border)',
                boxShadow: 'var(--shadow-2xl)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <form onSubmit={handleSave} className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="m-0"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    {editingNote ? '编辑笔记' : '新建笔记'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (voice.isListening) voice.stopListening();
                      setShowEditor(false);
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="mb-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(106,155,204,0.05)', border: '1px solid rgba(106,155,204,0.1)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--soft-blue)' }}>
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                      <span
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--soft-blue)',
                          fontWeight: 500,
                        }}
                      >
                        智能识别
                      </span>
                    </div>
                    <p
                      className="m-0"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--cream-text-muted)',
                        lineHeight: 1.6,
                      }}
                    >
                      输入内容后，AI 会自动生成标题、分类、标签、摘要。包含"提醒"关键词会自动解析提醒规则。
                    </p>
                    <p
                      className="m-0 mt-1"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.6875rem',
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      示例：每天早8点提醒我一次直至完成 / 每周六早八点提醒我 / 明天晚上9点提醒我三遍
                    </p>
                  </div>

                  {/* 实时解析的提醒预览 */}
                  {parsedReminder && (
                    <motion.div
                      className="mb-3 p-3 rounded-xl"
                      style={{
                        background: 'rgba(167,139,250,0.08)',
                        border: '1px solid rgba(167,139,250,0.2)',
                      }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ fontSize: '0.875rem' }}>
                          {reminderTypeIcons[parsedReminder.type]}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Poppins',var(--font-sans)",
                            fontSize: '0.75rem',
                            color: '#a78bfa',
                            fontWeight: 500,
                          }}
                        >
                          已识别提醒 · {reminderTypeLabels[parsedReminder.type]}
                        </span>
                      </div>
                      <p
                        className="m-0"
                        style={{
                          fontFamily: "'Lora',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--cream-dark)',
                        }}
                      >
                        {parsedReminder.description}
                      </p>
                    </motion.div>
                  )}

                  {/* 语音输入实时反馈 */}
                  {voice.isListening && (
                    <motion.div
                      className="mb-3 p-3 rounded-xl flex items-center gap-3"
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                      }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex gap-1">
                        <div style={{ width: 4, height: 12, background: '#ef4444', borderRadius: 2 }} />
                        <div style={{ width: 4, height: 18, background: '#ef4444', borderRadius: 2 }} />
                        <div style={{ width: 4, height: 8, background: '#ef4444', borderRadius: 2 }} />
                      </div>
                      <span
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: '#ef4444',
                          fontWeight: 500,
                        }}
                      >
                        正在聆听... {voice.interimTranscript}
                      </span>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className="block uppercase tracking-wide"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--cream-text-muted)',
                      }}
                    >
                      内容
                    </label>
                    {voice.isSupported && (
                      <motion.button
                        type="button"
                        onClick={handleVoiceToggle}
                        className="flex items-center gap-1.5 px-3 h-9 rounded-lg"
                        style={{
                          background: voice.isListening ? 'rgba(239,68,68,0.1)' : 'rgba(106,155,204,0.1)',
                          color: voice.isListening ? '#ef4444' : 'var(--soft-blue)',
                          border: `1px solid ${voice.isListening ? 'rgba(239,68,68,0.3)' : 'rgba(106,155,204,0.2)'}`,
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="22" />
                        </svg>
                        {voice.isListening ? '停止' : '语音输入'}
                      </motion.button>
                    )}
                  </div>
                  <textarea
                    value={displayContent}
                    onChange={(e) => {
                      if (!voice.isListening) {
                        setContent(e.target.value);
                      }
                    }}
                    placeholder="输入你的笔记内容...&#10;例如：明天上午10点提醒我开会"
                    rows={8}
                    className="w-full px-3.5 py-2.5 rounded-xl outline-none resize-none"
                    style={{
                      background: voice.isListening ? 'rgba(239,68,68,0.03)' : 'var(--surface)',
                      border: `1px solid ${voice.isListening ? 'rgba(239,68,68,0.3)' : 'var(--cream-border)'}`,
                      fontFamily: "'Lora',var(--font-sans)",
                      fontSize: '16px',
                      color: 'var(--cream-dark)',
                      lineHeight: 1.8,
                      cursor: voice.isListening ? 'not-allowed' : 'text',
                    }}
                    readOnly={voice.isListening}
                  />
                  {voice.error && (
                    <p
                      className="m-0 mt-2"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.6875rem',
                        color: '#ef4444',
                      }}
                    >
                      语音识别出错：{voice.error === 'not-allowed' ? '请允许麦克风权限' : voice.error}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--cream-border)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (voice.isListening) voice.stopListening();
                      setShowEditor(false);
                    }}
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
                      background: 'var(--soft-blue)',
                      color: 'var(--text-on-primary)',
                      border: 'none',
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      boxShadow: '0 3px 10px rgba(106,155,204,0.25)',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {editingNote ? '保存修改' : '创建笔记'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && detailNote && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.4)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetail(false)}
            />
            <motion.div
              className="fixed z-50 w-[95vw] sm:w-[700px] max-h-[85vh] rounded-2xl p-4 sm:p-6 flex flex-col"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--cream-bg)',
                border: '1px solid var(--cream-border)',
                boxShadow: 'var(--shadow-2xl)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.625rem',
                      fontWeight: 500,
                      color: getCategoryColor(detailNote.aiCategory || '其他'),
                      background: `color-mix(in srgb, ${getCategoryColor(detailNote.aiCategory || '其他')} 15%, transparent)`,
                    }}
                  >
                    {detailNote.aiCategory || '其他'}
                  </span>
                  {detailNote.completed && (
                    <span
                      className="px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.625rem',
                        fontWeight: 500,
                        color: 'var(--moss-green)',
                        background: 'rgba(138,191,146,0.1)',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--moss-green)" stroke="none">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      已完成
                    </span>
                  )}
                  {detailNote.pinned && !detailNote.completed && (
                    <span
                      className="px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.625rem',
                        fontWeight: 500,
                        color: 'var(--warm-orange)',
                        background: 'rgba(217,119,87,0.1)',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--warm-orange)" stroke="none">
                        <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
                      </svg>
                      已置顶
                    </span>
                  )}
                  {detailNote.reminder && !detailNote.completed && (
                    <span
                      className="px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.625rem',
                        fontWeight: 500,
                        color: 'var(--soft-blue)',
                        background: 'rgba(106,155,204,0.1)',
                      }}
                    >
                      <span style={{ fontSize: '0.625rem' }}>
                        {reminderTypeIcons[detailNote.reminder.type]}
                      </span>
                      {detailNote.reminder.description}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: "'Lora',var(--font-sans)",
                      fontSize: '0.75rem',
                      color: 'var(--cream-text-muted)',
                    }}
                  >
                    {formatDate(detailNote.updatedAt)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCompleted(detailNote.id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: detailNote.completed ? 'var(--moss-green)' : 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                    title={detailNote.completed ? '标记未完成' : '标记完成'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={detailNote.completed ? 'var(--moss-green)' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      togglePinned(detailNote.id);
                      setDetailNote({ ...detailNote, pinned: !detailNote.pinned });
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: detailNote.pinned ? 'var(--warm-orange)' : 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                    title={detailNote.pinned ? '取消置顶' : '置顶'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={detailNote.pinned ? 'var(--warm-orange)' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
                    </svg>
                  </button>
                  {detailNote.reminder && (
                    <button
                      type="button"
                      onClick={() => {
                        clearReminder(detailNote.id);
                        setDetailNote({ ...detailNote, reminder: null });
                      }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--soft-blue)',
                        cursor: 'pointer',
                      }}
                      title="清除提醒"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditor(detailNote)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDetail(false)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--cream-text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              <h2
                className="m-0 mb-4"
                style={{
                  fontFamily: "'Poppins',var(--font-sans)",
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--cream-dark)',
                  textDecoration: detailNote.completed ? 'line-through' : 'none',
                }}
              >
                {detailNote.aiTitle || '新笔记'}
              </h2>

              {/* 提醒信息卡片 */}
              {detailNote.reminder && !detailNote.completed && (
                <motion.div
                  className="mb-4 p-4 rounded-2xl"
                  style={{
                    background: 'rgba(167,139,250,0.08)',
                    border: '1px solid rgba(167,139,250,0.2)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: '1rem' }}>
                      {reminderTypeIcons[detailNote.reminder.type]}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#a78bfa',
                      }}
                    >
                      提醒规则 · {reminderTypeLabels[detailNote.reminder.type]}
                    </span>
                  </div>
                  <p
                    className="m-0 mb-2"
                    style={{
                      fontFamily: "'Lora',var(--font-sans)",
                      fontSize: '0.8125rem',
                      color: 'var(--cream-dark)',
                      lineHeight: 1.6,
                    }}
                  >
                    {detailNote.reminder.description}
                  </p>
                  {detailNote.reminder.originalText && (
                    <p
                      className="m-0"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--cream-text-muted)',
                        fontStyle: 'italic',
                      }}
                    >
                      原文："{detailNote.reminder.originalText}"
                    </p>
                  )}
                  {detailNote.reminder.triggeredCount ? (
                    <p
                      className="m-0 mt-2"
                      style={{
                        fontFamily: "'Lora',var(--font-sans)",
                        fontSize: '0.75rem',
                        color: 'var(--moss-green)',
                      }}
                    >
                      已触发 {detailNote.reminder.triggeredCount} 次
                    </p>
                  ) : null}
                </motion.div>
              )}

              {detailNote.aiSummary && (
                <motion.div
                  className="mb-4 p-4 rounded-2xl"
                  style={{
                    background: 'rgba(106,155,204,0.08)',
                    border: '1px solid rgba(106,155,204,0.15)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--soft-blue)' }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 15s1.5-2 4-2 4 2 4 2" />
                      <path d="M9 9h.01" />
                      <path d="M15 9h.01" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--soft-blue)',
                      }}
                    >
                      AI 摘要
                    </span>
                  </div>
                  <p
                    className="m-0"
                    style={{
                      fontFamily: "'Lora',var(--font-sans)",
                      fontSize: '0.8125rem',
                      color: 'var(--cream-dark)',
                      lineHeight: 1.7,
                    }}
                  >
                    {detailNote.aiSummary}
                  </p>
                </motion.div>
              )}

              {detailNote.aiKeyPoints && detailNote.aiKeyPoints.length > 0 && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--moss-green)' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--moss-green)',
                      }}
                    >
                      关键要点
                    </span>
                  </div>
                  <ul className="m-0 pl-0" style={{ listStyle: 'none' }}>
                    {detailNote.aiKeyPoints.map((point, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-2 mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.03 }}
                      >
                        <span
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(138,191,146,0.15)',
                            color: 'var(--moss-green)',
                            fontFamily: "'Poppins',var(--font-sans)",
                            fontSize: '0.625rem',
                            fontWeight: 600,
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Lora',var(--font-sans)",
                            fontSize: '0.8125rem',
                            color: 'var(--cream-dark)',
                            lineHeight: 1.6,
                          }}
                        >
                          {point}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {detailNote.aiTags && detailNote.aiTags.length > 0 && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--warm-orange)' }}>
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      <path d="m8.5 4.616 4.5 2.375" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Poppins',var(--font-sans)",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--warm-orange)',
                      }}
                    >
                      AI 标签
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detailNote.aiTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full"
                        style={{
                          fontFamily: "'Poppins',var(--font-sans)",
                          fontSize: '0.75rem',
                          color: 'var(--text-on-primary)',
                          background: 'var(--warm-orange)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                className="flex-1 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cream-text-muted)' }}>
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--cream-text-muted)',
                    }}
                  >
                    原始内容
                  </span>
                </div>
                <pre
                  className="m-0 p-4 rounded-2xl whitespace-pre-wrap"
                  style={{
                    background: 'rgba(0,0,0,0.03)',
                    fontFamily: "'Lora',var(--font-sans)",
                    fontSize: '0.8125rem',
                    color: 'var(--cream-text-muted)',
                    lineHeight: 1.8,
                  }}
                >
                  {detailNote.content}
                </pre>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
