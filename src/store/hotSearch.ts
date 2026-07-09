import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HotSearchItem, HotSearchConfig } from '@/types';

const mockHotSearches: HotSearchItem[] = [
  { id: '1', title: '你的感觉没错：极端天气越来越常见了', hotnum: 6030990, rank: 1, isHot: true },
  { id: '2', title: '2026年下半年经济走势如何', hotnum: 5280450, rank: 2, isHot: true },
  { id: '3', title: '教育部发布最新中小学课程标准', hotnum: 4861230, rank: 3, isNew: true },
  { id: '4', title: '国产大飞机C919再获新订单', hotnum: 4125680, rank: 4 },
  { id: '5', title: 'AI大模型竞赛进入下半场', hotnum: 3890450, rank: 5 },
  { id: '6', title: '新能源汽车销量再创历史新高', hotnum: 3567890, rank: 6 },
  { id: '7', title: '多地发布高温红色预警', hotnum: 3245670, rank: 7 },
  { id: '8', title: '国家队出手 股市迎来反弹', hotnum: 2987650, rank: 8, isNew: true },
  { id: '9', title: '暑期旅游市场火爆 机票价格上涨', hotnum: 2765430, rank: 9 },
  { id: '10', title: '最新研究：每天运动30分钟可降低患病风险', hotnum: 2543210, rank: 10 },
  { id: '11', title: '华为发布新一代鸿蒙系统', hotnum: 2345670, rank: 11, isHot: true },
  { id: '12', title: '房地产新政出台 多城松绑限购', hotnum: 2134560, rank: 12 },
  { id: '13', title: '年轻人为什么爱上Citywalk', hotnum: 1987650, rank: 13, isNew: true },
  { id: '14', title: '奥运会倒计时 中国队备战情况', hotnum: 1876540, rank: 14 },
  { id: '15', title: '直播带货行业迎来最强监管', hotnum: 1765430, rank: 15 },
  { id: '16', title: '低代码开发成企业数字化新趋势', hotnum: 1654320, rank: 16 },
  { id: '17', title: '国产芯片取得重大突破', hotnum: 1543210, rank: 17, isHot: true },
  { id: '18', title: '暑假档电影票房预测', hotnum: 1432100, rank: 18 },
  { id: '19', title: '远程办公成新常态 企业如何应对', hotnum: 1321090, rank: 19 },
  { id: '20', title: '健康饮食新潮流：地中海饮食走红', hotnum: 1210980, rank: 20, isNew: true },
];

interface HotSearchState {
  items: HotSearchItem[];
  config: HotSearchConfig;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string;

  setConfig: (config: Partial<HotSearchConfig>) => void;
  fetchHotSearches: () => Promise<void>;
  getTopItems: (count: number) => HotSearchItem[];
  formatHotNum: (num: number) => string;
}

export const useHotSearchStore = create<HotSearchState>()(
  persist(
    (set, get) => ({
      items: mockHotSearches,
      config: {
        apiKey: '',
        autoRefresh: true,
        refreshInterval: 30,
        displayCount: 20,
      },
      isLoading: false,
      error: null,
      lastUpdated: new Date().toISOString(),

      setConfig: (config) =>
        set((state) => ({
          config: { ...state.config, ...config },
        })),

      fetchHotSearches: async () => {
        const { config } = get();

        if (!config.apiKey || config.apiKey.trim() === '') {
          set({
            items: mockHotSearches,
            lastUpdated: new Date().toISOString(),
            error: null,
            isLoading: false,
          });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(
            `https://apis.tianapi.com/networkhot/index?key=${config.apiKey}`
          );
          const data = await response.json();

          if (data.code === 200 && data.result && data.result.list) {
            const items: HotSearchItem[] = data.result.list.map(
              (item: any, index: number) => ({
                id: `${index + 1}-${Date.now()}`,
                title: item.title,
                hotnum: item.hotnum || 0,
                rank: index + 1,
                isNew: index < 3 && Math.random() > 0.5,
                isHot: index < 5,
              })
            );
            set({
              items,
              lastUpdated: new Date().toISOString(),
              isLoading: false,
            });
          } else {
            set({
              error: data.msg || '获取热搜数据失败',
              isLoading: false,
            });
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '网络请求失败',
            isLoading: false,
          });
        }
      },

      getTopItems: (count) => {
        return get().items.slice(0, count);
      },

      formatHotNum: (num) => {
        if (num >= 10000) {
          return (num / 10000).toFixed(1) + '万';
        }
        return num.toString();
      },
    }),
    {
      name: 'hot-search-storage',
      partialize: (state) => ({
        items: state.items,
        config: state.config,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
