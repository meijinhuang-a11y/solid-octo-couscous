import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistantStore, AI_MODELS } from '@/store/aiAssistant';
import { askAI } from '@/services/ai';
import { useLocation } from 'react-router-dom';

export default function AIAssistant() {
  const {
    isOpen,
    selectedModel,
    messages,
    isLoading,
    position,
    setIsOpen,
    setSelectedModel,
    addMessage,
    setIsLoading,
    setPosition,
    clearMessages,
  } = useAIAssistantStore();

  const [inputValue, setInputValue] = useState('');
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [hasDragged, setHasDragged] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posRef = useRef(position);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  const getPageContext = useCallback(() => {
    const path = location.pathname;
    if (path.includes('photo')) return 'photo';
    if (path.includes('copywriting')) return 'copywriting';
    if (path.includes('video')) return 'video';
    if (path.includes('news')) return 'news';
    return 'default';
  }, [location.pathname]);

  useEffect(() => {
    posRef.current = position;
  }, [position]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isOpen) return;
    if (!hasDragged) {
      const initialX = 24;
      const initialY = window.innerHeight - 24 - 48;
      setPosition({ x: initialX, y: initialY });
      posRef.current = { x: initialX, y: initialY };
      setHasDragged(true);
    }
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
  }, [isOpen, hasDragged, setPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newX = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragStartRef.current.x));
    const newY = Math.max(60, Math.min(window.innerHeight - 60, e.clientY - dragStartRef.current.y));
    setPosition({ x: newX, y: newY });
  }, [isDragging, setPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInputValue('');
    setIsLoading(true);

    try {
      const answer = await askAI(userMsg.content, selectedModel, getPageContext());
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date().toISOString(),
        modelId: selectedModel,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed z-50"
        style={{
          left: hasDragged ? position.x : 24,
          top: hasDragged ? position.y : 'auto',
          bottom: hasDragged ? 'auto' : 24,
          cursor: isDragging ? 'grabbing' : isOpen ? 'default' : 'grab',
        }}
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
      >
        <div
          onMouseDown={handleMouseDown}
          onClick={() => {
            if (!isDragging) setIsOpen(!isOpen);
          }}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: currentModel.color,
            boxShadow: `0 4px 16px ${currentModel.color}40`,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>
        {!isOpen && (
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--warm-orange)',
              border: '2px solid var(--background)',
            }}
          >
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-50 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              left: hasDragged ? Math.min(position.x + 60, viewport.w - 380) : 84,
              top: hasDragged
                ? position.y > viewport.h / 2
                  ? position.y - 460
                  : position.y + 60
                : viewport.h - 24 - 48 - 480,
              width: '360px',
              height: '480px',
              background: 'var(--cream-bg)',
              border: '1px solid var(--cream-border)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--cream-border)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: currentModel.color }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
                <div>
                  <p
                    className="m-0"
                    style={{
                      fontFamily: "'Poppins',var(--font-sans)",
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--cream-dark)',
                    }}
                  >
                    AI 助手
                  </p>
                  <p
                    className="m-0"
                    style={{
                      fontFamily: "'Lora',var(--font-sans)",
                      fontSize: '0.625rem',
                      color: 'var(--cream-text-muted)',
                    }}
                  >
                    {currentModel.name} · {currentModel.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowModelSelect(!showModelSelect)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--cream-text-muted)',
                    cursor: 'pointer',
                  }}
                  title="切换模型"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 21 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={clearMessages}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--cream-text-muted)',
                    cursor: 'pointer',
                  }}
                  title="清空对话"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--cream-text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Model Selector */}
            <AnimatePresence>
              {showModelSelect && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                  style={{ borderBottom: '1px solid var(--cream-border)' }}
                >
                  <div className="p-2 space-y-1">
                    {AI_MODELS.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          setSelectedModel(model.id);
                          setShowModelSelect(false);
                        }}
                        className="w-full px-3 py-2 rounded-lg flex items-center gap-2 transition-all"
                        style={{
                          background: selectedModel === model.id ? `color-mix(in srgb, ${model.color} 10%, transparent)` : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: model.color }}
                        />
                        <span
                          style={{
                            fontFamily: "'Poppins',var(--font-sans)",
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: selectedModel === model.id ? model.color : 'var(--cream-dark)',
                          }}
                        >
                          {model.name}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Lora',var(--font-sans)",
                            fontSize: '0.625rem',
                            color: 'var(--cream-text-muted)',
                          }}
                        >
                          {model.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-3 space-y-3"
              style={{ height: 'calc(100% - 120px)' }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-xl"
                    style={{
                      background: msg.role === 'user' ? currentModel.color : 'var(--background)',
                      color: msg.role === 'user' ? '#fff' : 'var(--cream-dark)',
                      fontFamily: "'Lora',var(--font-sans)",
                      fontSize: '0.8125rem',
                      lineHeight: 1.5,
                      border: msg.role === 'user' ? 'none' : '1px solid var(--cream-border)',
                    }}
                  >
                    <p className="m-0">{msg.content}</p>
                    <p
                      className="m-0 mt-1"
                      style={{
                        fontSize: '0.625rem',
                        opacity: 0.6,
                        textAlign: 'right',
                      }}
                    >
                      {formatTime(msg.timestamp)}
                      {msg.modelId && ` · ${AI_MODELS.find((m) => m.id === msg.modelId)?.name}`}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="px-3 py-2 rounded-xl"
                    style={{
                      background: 'var(--background)',
                      border: '1px solid var(--cream-border)',
                    }}
                  >
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: currentModel.color, animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: currentModel.color, animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: currentModel.color, animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-2 flex gap-2"
              style={{ borderTop: '1px solid var(--cream-border)' }}
            >
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入问题，按 Enter 发送..."
                className="flex-1 px-3 py-2 rounded-xl outline-none resize-none"
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--cream-border)',
                  fontFamily: "'Lora',var(--font-sans)",
                  fontSize: '0.8125rem',
                  color: 'var(--cream-dark)',
                  minHeight: '36px',
                  maxHeight: '80px',
                }}
                rows={1}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  background: inputValue.trim() && !isLoading ? currentModel.color : 'var(--cream-border)',
                  border: 'none',
                  cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
