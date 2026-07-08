import { create } from 'zustand';
import type { TrendingVideo } from '@/types';

const initialTrendingVideos: TrendingVideo[] = [
  {
    id: '1',
    title: '30秒学会高效信息流广告创意公式',
    author: '创意研究所',
    thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400',
    views: '256.8万',
    likes: '18.5万',
    comments: '2.3万',
    shares: '5.6万',
    growthRate: 156,
    platform: '抖音',
    category: '创意教程',
    publishDate: new Date(Date.now() - 86400000).toISOString(),
    tags: ['广告创意', '信息流', '干货'],
    description: '用一个公式搞定所有信息流广告创意，从标题、画面、音乐三要素拆解，让你的广告效果翻倍。',
    trend: 'up',
    duration: '02:34',
  },
  {
    id: '2',
    title: '短视频爆款内容的5个底层逻辑',
    author: '运营黑客',
    thumbnail: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400',
    views: '189.2万',
    likes: '12.8万',
    comments: '1.5万',
    shares: '3.2万',
    growthRate: 89,
    platform: '视频号',
    category: '运营干货',
    publishDate: new Date(Date.now() - 172800000).toISOString(),
    tags: ['爆款逻辑', '运营', '方法论'],
    description: '为什么有的视频一发就火？揭秘爆款视频背后的5个底层逻辑，掌握了就能复制成功。',
    trend: 'up',
    duration: '05:12',
  },
  {
    id: '3',
    title: '产品开箱视频拍摄全流程',
    author: '数码达人',
    thumbnail: 'https://images.unsplash.com/photo-1593508512255-86ab42a0e6d?w=400',
    views: '145.6万',
    likes: '9.2万',
    comments: '8千',
    shares: '2.1万',
    growthRate: 67,
    platform: 'B站',
    category: '产品测评',
    publishDate: new Date(Date.now() - 259200000).toISOString(),
    tags: ['开箱', '数码', '测评'],
    description: '从场景布置到灯光设置，专业开箱视频的完整制作流程，小白也能学会。',
    trend: 'up',
    duration: '08:45',
  },
  {
    id: '4',
    title: '直播间话术模板，新手主播必看',
    author: '直播运营说',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
    views: '98.3万',
    likes: '6.7万',
    comments: '1.2万',
    shares: '4.5万',
    growthRate: 234,
    platform: '快手',
    category: '直播运营',
    publishDate: new Date(Date.now() - 345600000).toISOString(),
    tags: ['直播', '话术', '电商'],
    description: '直播间留人、逼单、互动话术模板，新手主播直接套用，转化率提升300%。',
    trend: 'up',
    duration: '06:20',
  },
  {
    id: '5',
    title: '竖屏原生内容转化率提升40%',
    author: '广告观察',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
    views: '76.5万',
    likes: '5.1万',
    comments: '6千',
    shares: '1.8万',
    growthRate: 45,
    platform: '小红书',
    category: '行业报告',
    publishDate: new Date(Date.now() - 432000000).toISOString(),
    tags: ['竖屏广告', '转化率', '数据'],
    description: '最新数据显示，竖屏原生内容的用户停留时间和转化率均显著高于横屏广告。',
    trend: 'stable',
    duration: '03:56',
  },
  {
    id: '6',
    title: 'AI生成视频质量测评',
    author: 'AI科技',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    views: '312.4万',
    likes: '25.3万',
    comments: '3.8万',
    shares: '8.9万',
    growthRate: 312,
    platform: '抖音',
    category: 'AI工具',
    publishDate: new Date(Date.now() - 518400000).toISOString(),
    tags: ['AI', '视频生成', '测评'],
    description: '实测5款AI视频生成工具，哪个最好用？看完这个视频你就知道了。',
    trend: 'up',
    duration: '10:32',
  },
  {
    id: '7',
    title: '百万粉丝博主的一天vlog',
    author: '生活家小美',
    thumbnail: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?w=400',
    views: '245.6万',
    likes: '19.8万',
    comments: '2.1万',
    shares: '3.4万',
    growthRate: 78,
    platform: '小红书',
    category: '生活方式',
    publishDate: new Date(Date.now() - 604800000).toISOString(),
    tags: ['vlog', '生活', '博主日常'],
    description: '跟大家分享百万粉丝博主的一天，看看背后有哪些不为人知的努力。',
    trend: 'up',
    duration: '12:15',
  },
  {
    id: '8',
    title: '过气网红的生存现状',
    author: '八卦研究所',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400',
    views: '523.1万',
    likes: '35.2万',
    comments: '5.6万',
    shares: '12.3万',
    growthRate: -15,
    platform: 'B站',
    category: '行业观察',
    publishDate: new Date(Date.now() - 691200000).toISOString(),
    tags: ['网红', '行业', '深度'],
    description: '深度揭秘过气网红的真实生存状态，流量褪去之后何去何从？',
    trend: 'down',
    duration: '15:48',
  },
];

interface TrendingVideoState {
  videos: TrendingVideo[];
  selectedPlatform: string;
  selectedCategory: string;
  sortBy: 'views' | 'likes' | 'comments';
  lastRefresh: string;
  isRefreshing: boolean;
  setSelectedPlatform: (platform: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: 'views' | 'likes' | 'comments') => void;
  toggleFavorite: (id: string) => void;
  getFilteredVideos: () => TrendingVideo[];
  refresh: () => Promise<void>;
  platforms: string[];
  categories: string[];
}

export const useTrendingVideoStore = create<TrendingVideoState>((set, get) => ({
  videos: initialTrendingVideos,
  selectedPlatform: '全部',
  selectedCategory: '全部',
  sortBy: 'views',
  lastRefresh: new Date().toISOString(),
  isRefreshing: false,
  platforms: ['全部', '抖音', '视频号', 'B站', '快手', '小红书'],
  categories: ['全部', '创意教程', '运营干货', '产品测评', '直播运营', '行业报告', 'AI工具', '生活方式', '行业观察'],

  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSortBy: (sort) => set({ sortBy: sort }),

  toggleFavorite: () => {
    // 收藏逻辑可以扩展，这里仅作演示
  },

  getFilteredVideos: () => {
    const { videos, selectedPlatform, selectedCategory, sortBy } = get();
    let filtered = videos.filter((v) => {
      if (selectedPlatform !== '全部' && v.platform !== selectedPlatform) return false;
      if (selectedCategory !== '全部' && v.category !== selectedCategory) return false;
      return true;
    });

    filtered = [...filtered].sort((a, b) => {
      const parseNum = (s: string) => {
        const wan = s.includes('万');
        const num = parseFloat(s.replace(/[^0-9.]/g, ''));
        return wan ? num * 10000 : num;
      };
      if (sortBy === 'likes') return parseNum(b.likes) - parseNum(a.likes);
      if (sortBy === 'comments') return parseNum(b.comments) - parseNum(a.comments);
      return parseNum(b.views) - parseNum(a.views);
    });

    return filtered;
  },

  refresh: async () => {
    set({ isRefreshing: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isRefreshing: false, lastRefresh: new Date().toISOString() });
  },
}));
