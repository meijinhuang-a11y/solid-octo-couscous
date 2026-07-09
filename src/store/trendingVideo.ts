import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrendingVideo } from '@/types';

const initialTrendingVideos: TrendingVideo[] = [
  {
    id: '1',
    title: '抖音爆款文案模板大全，直接套用就能火',
    author: '文案变现王',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400',
    views: '456.8万',
    likes: '32.5万',
    comments: '4.8万',
    shares: '12.6万',
    growthRate: 286,
    platform: '抖音',
    category: '创意教程',
    publishDate: new Date(Date.now() - 3600000).toISOString(),
    tags: ['文案模板', '抖音爆款', '短视频'],
    description: '整理了100个抖音爆款文案模板，涵盖种草、测评、剧情等多种类型，直接套用就能出爆款。',
    trend: 'up',
    duration: '03:45',
  },
  {
    id: '2',
    title: '小红书笔记排版技巧，点赞量翻倍的秘密',
    author: '小红书运营官',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    views: '289.2万',
    likes: '21.8万',
    comments: '3.2万',
    shares: '6.5万',
    growthRate: 178,
    platform: '小红书',
    category: '运营干货',
    publishDate: new Date(Date.now() - 7200000).toISOString(),
    tags: ['小红书', '排版技巧', '笔记运营'],
    description: '从小红书头部博主的笔记中总结出的排版技巧，让你的笔记看起来更加专业和高级。',
    trend: 'up',
    duration: '04:22',
  },
  {
    id: '3',
    title: '视频号直播带货实战，新手如何快速起号',
    author: '视频号导师',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
    views: '312.4万',
    likes: '24.3万',
    comments: '5.1万',
    shares: '9.8万',
    growthRate: 215,
    platform: '视频号',
    category: '直播运营',
    publishDate: new Date(Date.now() - 14400000).toISOString(),
    tags: ['视频号', '直播带货', '新手起号'],
    description: '从零开始做视频号直播带货，分享快速起号的实战经验和避坑指南。',
    trend: 'up',
    duration: '08:15',
  },
  {
    id: '4',
    title: 'B站UP主如何打造爆款视频？3个核心要素',
    author: 'B站运营指南',
    thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400',
    views: '198.6万',
    likes: '15.2万',
    comments: '2.8万',
    shares: '4.3万',
    growthRate: 98,
    platform: 'B站',
    category: '运营干货',
    publishDate: new Date(Date.now() - 28800000).toISOString(),
    tags: ['B站', 'UP主', '爆款视频'],
    description: '分析100个B站爆款视频，总结出打造爆款的3个核心要素，让你的视频播放量翻倍。',
    trend: 'up',
    duration: '06:45',
  },
  {
    id: '5',
    title: '快手直播话术完整版，留人成交一套搞定',
    author: '快手运营说',
    thumbnail: 'https://images.unsplash.com/photo-1605348532760-221356614414?w=400',
    views: '175.3万',
    likes: '12.7万',
    comments: '3.5万',
    shares: '7.2万',
    growthRate: 145,
    platform: '快手',
    category: '直播运营',
    publishDate: new Date(Date.now() - 43200000).toISOString(),
    tags: ['快手', '直播话术', '成交技巧'],
    description: '快手直播间最实用的话术模板，从留人、互动到成交，一套完整的话术体系。',
    trend: 'up',
    duration: '07:30',
  },
  {
    id: '6',
    title: 'AI剪辑工具对比：哪个才是短视频创作者的最佳选择',
    author: 'AI工具测评',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    views: '267.8万',
    likes: '19.5万',
    comments: '4.2万',
    shares: '8.6万',
    growthRate: 189,
    platform: '抖音',
    category: 'AI工具',
    publishDate: new Date(Date.now() - 86400000).toISOString(),
    tags: ['AI剪辑', '短视频工具', '效率神器'],
    description: '实测市面上主流的AI剪辑工具，从功能、效果、价格三个维度进行全面对比。',
    trend: 'up',
    duration: '11:20',
  },
  {
    id: '7',
    title: '小红书种草笔记写法，从0到10万赞的完整指南',
    author: '种草达人',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    views: '345.2万',
    likes: '26.8万',
    comments: '5.6万',
    shares: '11.2万',
    growthRate: 234,
    platform: '小红书',
    category: '创意教程',
    publishDate: new Date(Date.now() - 172800000).toISOString(),
    tags: ['小红书种草', '笔记写法', '爆款指南'],
    description: '从选题、标题、内容到配图，全面讲解如何写出高赞小红书种草笔记。',
    trend: 'up',
    duration: '09:45',
  },
  {
    id: '8',
    title: '抖音直播带货选品技巧，爆款商品是怎么选出来的',
    author: '直播选品师',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
    views: '215.6万',
    likes: '16.2万',
    comments: '3.8万',
    shares: '6.9万',
    growthRate: 134,
    platform: '抖音',
    category: '直播运营',
    publishDate: new Date(Date.now() - 259200000).toISOString(),
    tags: ['直播选品', '抖音带货', '爆款商品'],
    description: '分享抖音直播带货的选品技巧，教你如何选出适合直播间的爆款商品。',
    trend: 'up',
    duration: '05:55',
  },
  {
    id: '9',
    title: 'B站科技类UP主成长之路，年入百万的秘密',
    author: '科技UP主说',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    views: '189.4万',
    likes: '14.5万',
    comments: '2.3万',
    shares: '3.8万',
    growthRate: 76,
    platform: 'B站',
    category: '行业观察',
    publishDate: new Date(Date.now() - 345600000).toISOString(),
    tags: ['B站科技', 'UP主收入', '内容创业'],
    description: '对话多位B站科技类UP主，揭秘他们的成长历程和变现方式。',
    trend: 'stable',
    duration: '15:30',
  },
  {
    id: '10',
    title: '视频号VS抖音，2026年哪个平台更值得深耕',
    author: '短视频分析师',
    thumbnail: 'https://images.unsplash.com/photo-1631369162780-8f4679b93f3a?w=400',
    views: '412.5万',
    likes: '29.8万',
    comments: '6.2万',
    shares: '14.5万',
    growthRate: 321,
    platform: '视频号',
    category: '行业观察',
    publishDate: new Date(Date.now() - 432000000).toISOString(),
    tags: ['视频号', '抖音', '平台选择'],
    description: '深度对比视频号和抖音的平台特点、流量机制、变现能力，帮你做出最佳选择。',
    trend: 'up',
    duration: '12:15',
  },
  {
    id: '11',
    title: '快手老铁经济深度解析，如何抓住下沉市场红利',
    author: '下沉市场专家',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    views: '167.3万',
    likes: '11.2万',
    comments: '2.6万',
    shares: '4.5万',
    growthRate: 56,
    platform: '快手',
    category: '行业报告',
    publishDate: new Date(Date.now() - 518400000).toISOString(),
    tags: ['快手', '下沉市场', '老铁经济'],
    description: '解析快手独特的老铁经济模式，探讨品牌如何在下沉市场取得成功。',
    trend: 'stable',
    duration: '10:45',
  },
  {
    id: '12',
    title: 'AI生成图文内容全流程，从prompt到成品只需5分钟',
    author: 'AIGC实战派',
    thumbnail: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
    views: '523.1万',
    likes: '38.5万',
    comments: '7.8万',
    shares: '18.2万',
    growthRate: 412,
    platform: '抖音',
    category: 'AI工具',
    publishDate: new Date(Date.now() - 604800000).toISOString(),
    tags: ['AIGC', 'AI图文', '效率工具'],
    description: '手把手教你用AI工具生成图文内容，从写prompt到生成成品的完整流程演示。',
    trend: 'up',
    duration: '06:30',
  },
];

interface TrendingVideoState {
  videos: TrendingVideo[];
  selectedPlatform: string;
  selectedCategory: string;
  sortBy: 'views' | 'likes' | 'comments';
  lastRefresh: string;
  isRefreshing: boolean;
  apiKey: string;
  useApiData: boolean;
  error: string | null;
  setSelectedPlatform: (platform: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: 'views' | 'likes' | 'comments') => void;
  setApiKey: (key: string) => void;
  toggleFavorite: (id: string) => void;
  getFilteredVideos: () => TrendingVideo[];
  refresh: () => Promise<void>;
  fetchFromApi: () => Promise<void>;
  platforms: string[];
  categories: string[];
}

export const useTrendingVideoStore = create<TrendingVideoState>()(
  persist(
    (set, get) => ({
      videos: initialTrendingVideos,
      selectedPlatform: '全部',
      selectedCategory: '全部',
      sortBy: 'views',
      lastRefresh: new Date().toISOString(),
      isRefreshing: false,
      apiKey: '',
      useApiData: false,
      error: null,
      platforms: ['全部', '抖音', '视频号', 'B站', '快手', '小红书'],
      categories: ['全部', '创意教程', '运营干货', '产品测评', '直播运营', '行业报告', 'AI工具', '生活方式', '行业观察'],

      setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setApiKey: (key) => set({ apiKey: key, useApiData: key.trim() !== '' }),

      toggleFavorite: () => {},

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

      fetchFromApi: async () => {
        const { apiKey } = get();

        if (!apiKey || apiKey.trim() === '') {
          set({ error: null });
          return;
        }

        set({ isRefreshing: true, error: null });

        try {
          const response = await fetch(
            `https://apis.tianapi.com/douyinhot/index?key=${apiKey}`
          );
          const data = await response.json();

          interface TianApiDouyinHotItem {
            title?: string;
            word?: string;
            name?: string;
            author?: string;
            cover?: string;
            pic?: string;
            play_count?: number;
            hot_value?: number;
            hotindex?: number;
            tag?: string;
            tags?: string[];
            description?: string;
            duration?: string;
          }

          if (data.code === 200 && data.result && data.result.list) {
            const apiVideos: TrendingVideo[] = data.result.list.map(
              (item: TianApiDouyinHotItem, index: number) => ({
                id: `douyin-${index}-${Date.now()}`,
                title: item.title || item.word || item.name || '抖音热搜',
                author: item.author || '抖音热榜',
                thumbnail: item.cover || item.pic || `https://picsum.photos/seed/douyin${index}/400/225`,
                views: item.play_count || item.hot_value
                  ? `${(item.play_count || item.hot_value / 10000).toFixed(1)}万`
                  : `${(item.hotindex ? item.hotindex / 10000 : Math.random() * 500 + 100).toFixed(1)}万`,
                likes: `${(Math.random() * 30 + 5).toFixed(1)}万`,
                comments: `${(Math.random() * 5 + 1).toFixed(1)}万`,
                shares: `${(Math.random() * 10 + 2).toFixed(1)}万`,
                growthRate: Math.floor(Math.random() * 300 + 50),
                platform: '抖音',
                category: item.tag || '热榜',
                publishDate: new Date().toISOString(),
                tags: item.tags || ['抖音热榜', '热门'],
                description: item.description || `抖音热搜榜第${index + 1}名：${item.title || item.word || item.name}`,
                trend: index < 5 ? 'up' : 'stable',
                duration: item.duration || `${Math.floor(Math.random() * 10 + 1).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
              })
            );
            set({
              videos: apiVideos,
              useApiData: true,
              lastRefresh: new Date().toISOString(),
              isRefreshing: false,
            });
          } else {
            set({
              error: data.msg || '获取抖音热榜数据失败',
              isRefreshing: false,
            });
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '网络请求失败',
            isRefreshing: false,
          });
        }
      },

      refresh: async () => {
        const { apiKey, fetchFromApi } = get();

        if (apiKey && apiKey.trim() !== '') {
          await fetchFromApi();
        } else {
          set({ isRefreshing: true });
          await new Promise((resolve) => setTimeout(resolve, 1500));
          set({ isRefreshing: false, lastRefresh: new Date().toISOString() });
        }
      },
    }),
    {
      name: 'trending-videos-storage',
      partialize: (state) => ({
        videos: state.videos,
        apiKey: state.apiKey,
        useApiData: state.useApiData,
      }),
    }
  )
);
