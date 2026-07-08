import { create } from 'zustand';
import type { WhitepaperItem, WhitepaperCategory } from '@/types';

const initialWhitepapers: WhitepaperItem[] = [
  {
    id: '1',
    title: '2026年中国数字营销趋势报告',
    category: 'marketing',
    description: '深度剖析数字营销行业最新趋势，涵盖短视频营销、直播电商、AI营销等热门领域，为品牌方提供战略参考。',
    source: '艾瑞咨询',
    publishDate: '2026-06-15',
    originalUrl: 'https://www.iresearch.cn/report/1001',
    downloadUrl: 'https://www.iresearch.cn/report/download/1001',
    canDownload: true,
    tags: ['数字营销', '趋势报告', '短视频', '直播电商'],
  },
  {
    id: '2',
    title: '程序化广告投放优化指南',
    category: 'media',
    description: '详解程序化广告投放策略与优化方法，包括投放平台选择、出价策略、数据分析与效果优化等实操技巧。',
    source: '秒针系统',
    publishDate: '2026-06-10',
    originalUrl: 'https://www.miaozhen.com/guide/programmatic',
    downloadUrl: 'https://www.miaozhen.com/guide/download/programmatic',
    canDownload: true,
    tags: ['程序化广告', '投放优化', '数据分析'],
  },
  {
    id: '3',
    title: 'Z世代消费行为洞察白皮书',
    category: 'insight',
    description: '深入研究Z世代消费群体的消费习惯、价值观念和决策路径，帮助品牌更好地理解年轻消费者。',
    source: '腾讯营销洞察',
    publishDate: '2026-06-05',
    originalUrl: 'https://marketing.qq.com/report/z-generation',
    downloadUrl: undefined,
    canDownload: false,
    tags: ['Z世代', '消费行为', '用户洞察'],
  },
  {
    id: '4',
    title: '小红书营销方法论',
    category: 'platform',
    description: '系统介绍小红书平台的营销逻辑与实操方法，包括内容创作、达人合作、话题运营等核心策略。',
    source: '小红书商业平台',
    publishDate: '2026-05-30',
    originalUrl: 'https://business.xiaohongshu.com/methodology',
    downloadUrl: 'https://business.xiaohongshu.com/download/methodology',
    canDownload: true,
    tags: ['小红书', '内容营销', 'KOL合作'],
  },
  {
    id: '5',
    title: 'AI驱动的创意生产白皮书',
    category: 'marketing',
    description: '探讨AI技术在广告创意生产中的应用场景与发展趋势，提供AI工具使用指南与最佳实践案例。',
    source: '百度营销研究院',
    publishDate: '2026-05-25',
    originalUrl: 'https://e.baidu.com/research/ai-creative',
    downloadUrl: 'https://e.baidu.com/research/download/ai-creative',
    canDownload: true,
    tags: ['AI创意', 'AIGC', '创意生产'],
  },
  {
    id: '6',
    title: '私域流量运营实战手册',
    category: 'media',
    description: '全面解析私域流量的搭建与运营策略，包括用户获取、社群运营、转化变现等核心环节。',
    source: '微盟研究院',
    publishDate: '2026-05-20',
    originalUrl: 'https://www.weimob.com/research/private-domain',
    downloadUrl: undefined,
    canDownload: false,
    tags: ['私域流量', '社群运营', '用户增长'],
  },
  {
    id: '7',
    title: '2026年社交媒体趋势报告',
    category: 'platform',
    description: '分析各大社交平台的发展趋势与用户行为变化，为品牌社交媒体运营提供决策依据。',
    source: 'SocialBeta',
    publishDate: '2026-05-15',
    originalUrl: 'https://www.socialbeta.com/report/social-trends-2026',
    downloadUrl: 'https://www.socialbeta.com/report/download/social-trends-2026',
    canDownload: true,
    tags: ['社交媒体', '平台趋势', '用户行为'],
  },
  {
    id: '8',
    title: '消费者决策路径演变研究',
    category: 'insight',
    description: '研究消费者购买决策路径的变化趋势，分析影响消费者决策的关键因素与触点。',
    source: '益普索',
    publishDate: '2026-05-10',
    originalUrl: 'https://www.ipsos.com/research/consumer-journey',
    downloadUrl: undefined,
    canDownload: false,
    tags: ['消费者研究', '决策路径', '用户体验'],
  },
];

interface WhitepaperState {
  whitepapers: WhitepaperItem[];
  selectedCategory: WhitepaperCategory | 'all';
  searchQuery: string;
  lastRefresh: string;
  isRefreshing: boolean;
  setSelectedCategory: (category: WhitepaperCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  getFilteredWhitepapers: () => WhitepaperItem[];
  refresh: () => Promise<void>;
  categories: { value: WhitepaperCategory | 'all'; label: string; icon: string }[];
}

export const useWhitepaperStore = create<WhitepaperState>((set, get) => ({
  whitepapers: initialWhitepapers,
  selectedCategory: 'all',
  searchQuery: '',
  lastRefresh: new Date().toISOString(),
  isRefreshing: false,
  categories: [
    { value: 'all', label: '全部', icon: '📚' },
    { value: 'marketing', label: '营销类', icon: '📈' },
    { value: 'media', label: '媒介类', icon: '📡' },
    { value: 'insight', label: '社会洞察', icon: '🔍' },
    { value: 'platform', label: '平台类', icon: '🌐' },
  ],

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredWhitepapers: () => {
    const { whitepapers, selectedCategory, searchQuery } = get();
    const lower = searchQuery.toLowerCase();
    return whitepapers.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (searchQuery && !item.title.toLowerCase().includes(lower) && !item.description.toLowerCase().includes(lower)) {
        return false;
      }
      return true;
    });
  },

  refresh: async () => {
    set({ isRefreshing: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isRefreshing: false, lastRefresh: new Date().toISOString() });
  },
}));
