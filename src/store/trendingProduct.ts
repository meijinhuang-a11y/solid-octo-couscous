import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrendingProduct } from '@/types';

const initialProducts: TrendingProduct[] = [
  {
    id: '1',
    name: '无线降噪蓝牙耳机 Pro Max',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    category: '数码配件',
    price: 359,
    originalPrice: 599,
    sales: '25.6万',
    growthRate: 286,
    platform: '抖音',
    rating: 4.8,
    reviewCount: 18650,
    trend: 'up',
    tags: ['降噪', '蓝牙', '高性价比', '长续航'],
    description: '主动降噪蓝牙耳机，45小时超长续航，IPX6防水，舒适佩戴体验。',
  },
  {
    id: '2',
    name: '便携式迷你榨汁杯',
    image: 'https://images.unsplash.com/photo-1622597467836-f3a149e7755b?w=300',
    category: '家居生活',
    price: 89,
    originalPrice: 169,
    sales: '18.3万',
    growthRate: 324,
    platform: '淘宝',
    rating: 4.7,
    reviewCount: 12450,
    trend: 'up',
    tags: ['便携', '充电', '高颜值', '迷你'],
    description: 'USB充电便携式榨汁杯，30秒快速榨汁，迷你随身带，一键清洗。',
  },
  {
    id: '3',
    name: '智能手表 Ultra 2',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300',
    category: '智能穿戴',
    price: 1599,
    originalPrice: 1999,
    sales: '12.8万',
    growthRate: 156,
    platform: '京东',
    rating: 4.9,
    reviewCount: 25680,
    trend: 'up',
    tags: ['智能', '运动', '健康监测', '长续航'],
    description: '全天候健康监测，150+运动模式，25天超长续航，血氧心率监测。',
  },
  {
    id: '4',
    name: '香薰加湿器家用静音',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=300',
    category: '家居生活',
    price: 199,
    originalPrice: 299,
    sales: '8.6万',
    growthRate: 78,
    platform: '小红书',
    rating: 4.6,
    reviewCount: 6780,
    trend: 'up',
    tags: ['香薰', '加湿', '卧室', '静音'],
    description: '超声波静音加湿器，香薰二合一，浪漫氛围灯，大容量水箱。',
  },
  {
    id: '5',
    name: 'MagSafe磁吸无线充电宝',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300',
    category: '数码配件',
    price: 199,
    originalPrice: 299,
    sales: '15.2万',
    growthRate: 215,
    platform: '抖音',
    rating: 4.8,
    reviewCount: 14320,
    trend: 'up',
    tags: ['磁吸', '无线充电', '便携', '快充'],
    description: 'MagSafe磁吸无线充电宝，15000mAh大容量，20W有线快充，轻薄设计。',
  },
  {
    id: '6',
    name: '可视空气炸锅 6L',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=300',
    category: '厨房电器',
    price: 459,
    originalPrice: 699,
    sales: '9.4万',
    growthRate: 167,
    platform: '拼多多',
    rating: 4.7,
    reviewCount: 8960,
    trend: 'up',
    tags: ['空气炸锅', '大容量', '可视', '无油'],
    description: '6L大容量可视空气炸锅，无油烹饪更健康，智能触控屏，8大菜单。',
  },
  {
    id: '7',
    name: '智能颈椎按摩仪',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
    category: '个护健康',
    price: 299,
    originalPrice: 499,
    sales: '11.3万',
    growthRate: 189,
    platform: '视频号',
    rating: 4.6,
    reviewCount: 7560,
    trend: 'up',
    tags: ['按摩', '颈椎', '热敷', '脉冲'],
    description: '脉冲+热敷双效颈椎按摩仪，TENS理疗技术，15档力度调节，便携设计。',
  },
  {
    id: '8',
    name: '多功能料理锅',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
    category: '厨房电器',
    price: 699,
    originalPrice: 999,
    sales: '5.2万',
    growthRate: 67,
    platform: '淘宝',
    rating: 4.8,
    reviewCount: 4580,
    trend: 'up',
    tags: ['多功能', '料理锅', '网红', '不粘'],
    description: '一锅多用，火锅/烧烤/蒸炖全搞定，不粘涂层易清洗，颜值担当。',
  },
  {
    id: '9',
    name: '智能台灯护眼学习',
    image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=300',
    category: '家居生活',
    price: 169,
    originalPrice: 269,
    sales: '6.8万',
    growthRate: 98,
    platform: '京东',
    rating: 4.7,
    reviewCount: 5230,
    trend: 'up',
    tags: ['台灯', '护眼', '智能', '学习'],
    description: 'AAA级护眼台灯，无蓝光危害，智能调光，定时功能，学生学习必备。',
  },
  {
    id: '10',
    name: '筋膜枪肌肉放松器',
    image: 'https://images.unsplash.com/photo-1594345442339-5117546d96d6?w=300',
    category: '个护健康',
    price: 329,
    originalPrice: 499,
    sales: '7.5万',
    growthRate: 145,
    platform: '小红书',
    rating: 4.5,
    reviewCount: 4890,
    trend: 'up',
    tags: ['筋膜枪', '肌肉放松', '按摩', '运动'],
    description: '6档力度筋膜枪，静音设计，12mm深度按摩，缓解肌肉酸痛。',
  },
  {
    id: '11',
    name: '无线充电器三合一',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
    category: '数码配件',
    price: 249,
    originalPrice: 399,
    sales: '4.3万',
    growthRate: 56,
    platform: '抖音',
    rating: 4.6,
    reviewCount: 3680,
    trend: 'stable',
    tags: ['无线充电', '三合一', '手机', '耳机'],
    description: '手机+手表+耳机三合一无线充电器，15W快充，LED呼吸灯，简约设计。',
  },
  {
    id: '12',
    name: '保温杯大容量',
    image: 'https://images.unsplash.com/photo-1583450676817-d56056d54539?w=300',
    category: '家居生活',
    price: 89,
    originalPrice: 149,
    sales: '16.7万',
    growthRate: 234,
    platform: '拼多多',
    rating: 4.8,
    reviewCount: 15680,
    trend: 'up',
    tags: ['保温杯', '大容量', '316不锈钢', '便携'],
    description: '316不锈钢保温杯，1000ml大容量，24小时保温保冷，便携防漏设计。',
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
  getProductById: (id: string) => TrendingProduct | undefined;
  addProduct: (product: Omit<TrendingProduct, 'id'>) => void;
  updateProduct: (id: string, product: Partial<TrendingProduct>) => void;
  deleteProduct: (id: string) => void;
  importProducts: (products: TrendingProduct[], mode?: 'replace' | 'merge') => void;
  exportProducts: () => TrendingProduct[];
  resetProducts: () => void;
  refresh: () => Promise<void>;
  platforms: string[];
  categories: string[];
}

export const useTrendingProductStore = create<TrendingProductState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      selectedPlatform: '全部',
      selectedCategory: '全部',
      sortBy: 'growth',
      lastRefresh: new Date().toISOString(),
      isRefreshing: false,
      platforms: ['全部', '抖音', '淘宝', '京东', '小红书', '拼多多', '视频号'],
      categories: ['全部', '数码配件', '家居生活', '智能穿戴', '厨房电器', '个护健康', '美妆个护', '母婴玩具'],

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

      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      addProduct: (product) => {
        const newProduct: TrendingProduct = {
          ...product,
          id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
        };
        set({ products: [newProduct, ...get().products] });
      },

      updateProduct: (id, product) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          ),
        });
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },

      importProducts: (products, mode = 'merge') => {
        if (mode === 'replace') {
          set({ products });
        } else {
          set({ products: [...products, ...get().products] });
        }
      },

      exportProducts: () => {
        return get().products;
      },

      resetProducts: () => {
        set({ products: initialProducts });
      },

      refresh: async () => {
        set({ isRefreshing: true });
        await new Promise((resolve) => setTimeout(resolve, 800));
        set({ isRefreshing: false, lastRefresh: new Date().toISOString() });
      },
    }),
    {
      name: 'trending-products-storage',
      partialize: (state) => ({
        products: state.products,
      }),
    }
  )
);
