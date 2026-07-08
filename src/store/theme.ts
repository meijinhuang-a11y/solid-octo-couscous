import { create } from 'zustand';
import type { ThemeMode } from '@/types';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const getSystemTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  isDark: false,

  setMode: (mode) => {
    localStorage.setItem('theme-mode', mode);
    let isDark = false;
    if (mode === 'system') {
      isDark = getSystemTheme();
    } else {
      isDark = mode === 'dark';
    }
    set({ mode, isDark });
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  },

  toggleTheme: () => {
    const { isDark } = get();
    const newMode: ThemeMode = isDark ? 'light' : 'dark';
    get().setMode(newMode);
  },

  initTheme: () => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode | null;
    const mode = savedMode || 'system';
    get().setMode(mode);

    if (mode === 'system') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (get().mode === 'system') {
          set({ isDark: e.matches });
          document.documentElement.classList.toggle('dark', e.matches);
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
      });
    }
  },
}));
