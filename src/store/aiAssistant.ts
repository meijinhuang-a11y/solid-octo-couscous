import { create } from 'zustand';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelId?: string;
}

export const AI_MODELS: AIModel[] = [
  { id: 'doubao', name: '豆包', description: '字节跳动（演示）', color: '#3B82F6' },
  { id: 'gpt4', name: 'GPT-4', description: 'OpenAI（演示）', color: '#10A37F' },
  { id: 'claude', name: 'Claude', description: 'Anthropic（演示）', color: '#D97757' },
  { id: 'qwen', name: '通义千问', description: '阿里云（演示）', color: '#1677FF' },
  { id: 'kimi', name: 'Kimi', description: '月之暗面（演示）', color: '#6366F1' },
];

interface AIAssistantState {
  isOpen: boolean;
  selectedModel: string;
  messages: ChatMessage[];
  isLoading: boolean;
  position: { x: number; y: number };
  setIsOpen: (open: boolean) => void;
  setSelectedModel: (modelId: string) => void;
  addMessage: (message: ChatMessage) => void;
  setIsLoading: (loading: boolean) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  clearMessages: () => void;
}

export const useAIAssistantStore = create<AIAssistantState>((set) => ({
  isOpen: false,
  selectedModel: 'doubao',
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是你的 AI 助手。当前为演示模式，回复内容为预设示例。接入真实大模型API后即可获得真实的智能问答能力。请选择一个模型开始对话。',
      timestamp: new Date().toISOString(),
    },
  ],
  isLoading: false,
  position: { x: 20, y: 120 },
  setIsOpen: (open) => set({ isOpen: open }),
  setSelectedModel: (modelId) => set({ selectedModel: modelId }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setPosition: (pos) => set({ position: pos }),
  clearMessages: () => set({
    messages: [{
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是你的 AI 助手。当前为演示模式，回复内容为预设示例。接入真实大模型API后即可获得真实的智能问答能力。请选择一个模型开始对话。',
      timestamp: new Date().toISOString(),
    }],
  }),
}));
