import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  browserNotification: boolean;
  feishuNotification: boolean;
  feishuWebhookUrl: string;
  setBrowserNotification: (enabled: boolean) => void;
  setFeishuNotification: (enabled: boolean) => void;
  setFeishuWebhookUrl: (url: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      browserNotification: true,
      feishuNotification: false,
      feishuWebhookUrl: '',
      setBrowserNotification: (enabled) => set({ browserNotification: enabled }),
      setFeishuNotification: (enabled) => set({ feishuNotification: enabled }),
      setFeishuWebhookUrl: (url) => set({ feishuWebhookUrl: url }),
    }),
    {
      name: 'app-settings',
    }
  )
);
