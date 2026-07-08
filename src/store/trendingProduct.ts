import { create } from 'zustand';
import type { TrendingProduct } from '@/types';

const initialProducts: TrendingProduct[] = [
  {
    id: '1',
    name: '无线降噪蓝牙耳机 Pro',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    category: '数码配件',
    price: 299,
    originalPrice: 499,
    sales: '12.8万',
    growthRate: 156,
    platform: '抖音',
    rating: 4.8,
    reviewCount: 8562,
    trend: 'up',
    tags: ['降噪', '蓝牙', '高性价比'],
    description: '主动降噪蓝牙耳机，40小时续航，IPX5防水，舒适佩戴。',
  },
  {
    id: '2',
    name: '便携式榨汁杯',
    image: 'https://images.unsplash.com/photo-1622597467836-f3a149e7755b?w=300',
    category: '家居生活',
    price: 99,
    originalPrice: 199,
    sales: '8.6万',
    growthRate: 234,
    platform: '淘宝',
    rating: 4.6,
    reviewCount: 5234,
    trend: 'up',
    tags: ['便携', '充电', '高颜值'],
    description: 'USB充电便携式榨汁杯，40秒快速榨汁，迷你随身带。',
  },
  {
    id: '3',
    name: '智能手表 Ultra',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300',
    category: '智能穿戴',
    price: 1299,
    originalPrice: 1599,
    sales: '5.2万',
    growthRate: 78,
    platform: '京东',
    rating: 4.9,
    reviewCount: 12450,
    trend: 'up',
    tags: ['智能', '运动', '健康监测'],
    description: '全天候健康监测，100+运动模式，20天超长续航。',
  },
  {
    id: '4',
    name: '香薰机加湿器',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=300',
    category: '家居生活',
    price: 168,
    originalPrice: 258,
    sales: '3.4万',
    growthRate: -12,
    platform: '小红书',
    rating: 4.5,
    reviewCount: 2890,
    trend: 'down',
    tags: ['香薰', '加湿', '卧室'],
    description: '超声波静音加湿器，香薰二合一，浪漫氛围灯。',
  },
  {
    id: '5',
    name: '磁吸充电宝',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300',
    category: '数码配件',
    price: 159,
    originalPrice: 239,
    sales: '6.7万',
    growthRate: 189,
    platform: '抖音',
    rating: 4.7,
    reviewCount: 6780,
    trend: 'up',
    tags: ['磁吸', '无线充电', '便携'],
    description: 'MagSafe磁吸无线充电宝，10000mAh大容量，快充支持。',
  },
  {
    id: '6',
    name: '空气炸锅 5L',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=300',
    category: '厨房电器',
    price: 399,
    originalPrice: 599,
    sales: '4.1万',
    growthRate: 56,
    platform: '拼多多',
    rating: 4.6,
    reviewCount: 4560,
    trend: 'up',
    tags: ['空气炸锅', '大容量', '无油'],
    description: '5L大容量可视空气炸锅，无油烹饪更健康，智能触控屏。',
  },
  {
    id: '7',
    name: '颈椎按摩仪',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
    category: '个护健康',
    price: 249,
    originalPrice: 399,
    sales: '2.9万',
    growthRate: 145,
    platform: '视频号',
    rating: 4.4,
    reviewCount: 3120,
    trend: 'up',
    tags: ['按摩', '颈椎', '热敷'],
    description: '脉冲+热敷双效颈椎按摩仪，TENS理疗技术，便携设计。',
  },
  {
    id: '8',
    name: '多功能料理锅',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
    category: '厨房电器',
    price: 599,
    originalPrice: 899,
    sales: '1.8万',
    growthRate: 8,
    platform: '淘宝',
    rating: 4.8,
    reviewCount: 2340,
    trend: 'stable',
    tags: ['多功能', '料理锅', '网红'],
    description: '一锅多用，火锅/烧烤/蒸炖全搞定，不粘涂层易清洗。',
  },
];

interface TrendingProductState {
  products: TrendingProduct[];
  selectedPlatform: string;
  selectedCategory: string;
  sortBy: 'sales' | 'growth' | 'price';
  lastRefresh: string;
  isRefreshing: boolean;
  setSelectedPlatform: (platform: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: 'sales' | 'growth' | 'price') => void;
  getFilteredProducts: () => TrendingProduct[];
  refresh: () => Promise<void>;
  platforms: string[];
  categories: string[];
}

export const useTrendingProductStore = create<TrendingProductState>((set, get) => ({
  products: initialProducts,
  selectedPlatform: '全部',
  selectedCategory: '全部',
  sortBy: 'growth',
  lastRefresh: new Date().toISOString(),
  isRefreshing: false,
  platforms: ['全部', '抖音', '淘宝', '京东', '小红书', '拼多多', '视频号'],
  categories: ['全部', '数码配件', '家居生活', '智能穿戴', '厨房电器', '个护健康'],

  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSortBy: (sort) => set({ sortBy: sort }),

  getFilteredProducts: () => {
    const { products, selectedPlatform, selectedCategory, sortBy } = get();
    let filtered = products.filter((p) => {
      if (selectedPlatform !== '全部' && p.platform !== selectedPlatform) return false;
      if (selectedCategory !== '全部' && p.category !== selectedCategory) return false;
      return true;
    });

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'growth') return b.growthRate - a.growthRate;
      if (sortBy === 'price') return a.price - b.price;
      return parseFloat(b.sales) - parseFloat(a.sales);
    });

    return filtered;
  },

  refresh: async () => {
    set({ isRefreshing: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isRefreshing: false, lastRefresh: new Date().toISOString() });
  },
}));
