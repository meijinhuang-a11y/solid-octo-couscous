import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductInfo, ProductStatus, ProductCategory } from '@/types';
import { parse1688Html, validateHtmlContent } from '@/utils/parse1688Html';

const categoryKeywords: Record<ProductCategory, string[]> = {
  '服饰': ['T恤', '连衣裙', '衣服', '服装', '衬衫', '裤子', '裙子', '外套', '卫衣', '汉服', '旗袍', '内衣', '袜子', '童装', '女装', '男装', '棉服', '毛衣', '牛仔'],
  '家居': ['花瓶', '摆件', '四件套', '床单', '被子', '枕头', '收纳', '厨具', '餐具', '家具', '装饰', '插花瓶', '抱枕', '窗帘', '地毯', '收纳盒', '置物架'],
  '数码': ['耳机', '风扇', '手机', '电脑', '充电', '蓝牙', '电子', '智能', '键盘', '鼠标', '音箱', '充电宝', '数据线', '充电器', '摄像头', '耳机'],
  '美妆': ['口红', '面膜', '护肤', '彩妆', '香水', '化妆', '美容', '洗面奶', '粉底', '眼影', '腮红', '唇膏', '精华', '乳液', '防晒'],
  '食品': ['零食', '茶叶', '咖啡', '坚果', '果干', '糖果', '巧克力', '蜂蜜', '糕点', '饼干', '特产', '干货', '饮品'],
  '母婴': ['婴儿', '宝宝', '奶粉', '尿布', '玩具', '童装', '孕妇', '奶瓶', '推车', '辅食', '纸尿裤', '婴儿车', '摇铃'],
  '运动': ['跑步', '健身', '瑜伽', '运动鞋', '球拍', '运动服', '户外', '篮球', '足球', '羽毛球', '登山', '骑行', '瑜伽垫'],
  '配饰': ['钱包', '包包', '项链', '耳环', '手链', '帽子', '围巾', '皮带', '墨镜', '戒指', '手镯', '背包', '斜挎包', '发饰'],
  '其他': [],
};

export function autoClassify(title: string, tags: string[], description: string): ProductCategory {
  const text = (title + ' ' + tags.join(' ') + ' ' + description).toLowerCase();
  let bestCategory: ProductCategory = '其他';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === '其他') continue;
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as ProductCategory;
    }
  }

  return bestCategory;
}

interface CategoryStats {
  category: ProductCategory;
  total: number;
  listed: number;
  ready: number;
  pending: number;
  totalProfit: number;
  avgMargin: number;
  color: string;
}

interface ProductExtractorState {
  products: ProductInfo[];
  isExtracting: boolean;
  extractError: string | null;
  lastExtracted: ProductInfo | null;
  lastRefresh: string;
  isRefreshing: boolean;
  activeTab: ProductStatus | 'all';
  extractFromHtml: (html: string, url: string) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => ProductInfo | undefined;
  refresh: () => Promise<void>;
  updateProductStatus: (id: string, status: ProductStatus) => void;
  updateProductProfit: (id: string, sellingPrice: number, shippingCost: number) => void;
  updateProductNotes: (id: string, notes: string) => void;
  updateDropshippingRules: (id: string, rules: Partial<ProductInfo['dropshipping']>) => void;
  updateProductInfo: (id: string, updates: Partial<ProductInfo>) => void;
  setActiveTab: (tab: ProductStatus | 'all') => void;
  getFilteredProducts: () => ProductInfo[];
  getStats: () => { pending: number; ready: number; listed: number; downlisted: number; total: number; avgMargin: number };
  listProduct: (id: string, xhsUrl: string, xhsTitle: string, xhsPrice: number) => void;
  downlistProduct: (id: string) => void;
  calculateMatch: (id: string) => void;
  getDashboardStats: () => {
    totalProducts: number;
    listedProducts: number;
    totalProfit: number;
    avgMargin: number;
    categories: CategoryStats[];
  };
  hasProductWithUrl: (url: string) => boolean;
  hasProductWithTitle: (title: string) => boolean;
}

const parsePrice = (priceStr: string): number => {
  const match = priceStr.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const calculateMatchScore = (product: ProductInfo): number => {
  let score = 0;
  if (product.dropshipping.supportsDropshipping) score += 30;
  if (product.dropshipping.providesXhsWaybill) score += 25;
  if (product.dropshipping.supportsFreeReturn) score += 20;
  if (product.profit.profitMargin >= 50) score += 15;
  else if (product.profit.profitMargin >= 30) score += 10;
  if (product.supplier.rating >= 4.5) score += 10;
  return Math.min(score, 100);
};

const generateMatchAnalysis = (product: ProductInfo): string => {
  const parts: string[] = [];
  if (product.dropshipping.supportsDropshipping) {
    parts.push('供应商支持一件代发');
  } else {
    parts.push('⚠️ 供应商暂不支持一件代发，需进一步沟通');
  }
  if (product.dropshipping.providesXhsWaybill) {
    parts.push('支持小红书面单');
  } else {
    parts.push('⚠️ 暂不提供小红书面单');
  }
  if (product.dropshipping.supportsFreeReturn) {
    parts.push('支持包邮退货');
  } else {
    parts.push('⚠️ 退货政策需确认');
  }
  if (product.profit.profitMargin >= 50) {
    parts.push(`利润率${product.profit.profitMargin}%，表现优秀`);
  } else if (product.profit.profitMargin >= 30) {
    parts.push(`利润率${product.profit.profitMargin}%，中等水平`);
  } else {
    parts.push(`利润率${product.profit.profitMargin}%，偏低`);
  }
  return parts.join('；') + '。';
};

export const categoryColors: Record<ProductCategory, string> = {
  '服饰': '#E87C6B',
  '家居': '#7BA3A8',
  '数码': '#5B8DB8',
  '美妆': '#D478A8',
  '食品': '#C4A35A',
  '母婴': '#8FB8A8',
  '运动': '#7A9E7E',
  '配饰': '#A890C4',
  '其他': '#B8B0A0',
};

export const useProductExtractorStore = create<ProductExtractorState>()(
  persist(
    (set, get) => ({
      products: [],
      isExtracting: false,
      extractError: null,
      lastExtracted: null,
      lastRefresh: new Date().toISOString(),
      isRefreshing: false,
      activeTab: 'all',

      extractFromHtml: async (html, url) => {
        set({ isExtracting: true, extractError: null });
        try {
          const validation = validateHtmlContent(html);
          if (!validation.valid) {
            set({ isExtracting: false, extractError: validation.error });
            return { success: false, error: validation.error };
          }

          await new Promise((resolve) => setTimeout(resolve, 800));
          const product = parse1688Html(html, url || '');

          if (url && get().hasProductWithUrl(url)) {
            set({ isExtracting: false, extractError: '该商品已在选品库中' });
            return { success: false, error: '该商品已在选品库中' };
          }

          if (!url && get().hasProductWithTitle(product.title)) {
            set({ isExtracting: false, extractError: '该商品已在选品库中' });
            return { success: false, error: '该商品已在选品库中' };
          }

          set((state) => ({
            products: [product, ...state.products],
            isExtracting: false,
            lastExtracted: product,
            activeTab: 'pending',
          }));
          return { success: true };
        } catch (e) {
          const errorMsg = (e as Error).message || '提取失败，请重试';
          set({ isExtracting: false, extractError: errorMsg });
          return { success: false, error: errorMsg };
        }
      },

      hasProductWithUrl: (url) => {
        if (!url) return false;
        return get().products.some((p) => p.url && p.url === url);
      },

      hasProductWithTitle: (title) => {
        if (!title) return false;
        return get().products.some((p) => p.title === title);
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      refresh: async () => {
        set({ isRefreshing: true });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set({ isRefreshing: false, lastRefresh: new Date().toISOString() });
      },

      updateProductStatus: (id, status) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, status } : p
          ),
        }));
      },

      updateProductProfit: (id, sellingPrice, shippingCost) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const costPrice = parsePrice(p.price);
            const platformFee = +(sellingPrice * 0.05).toFixed(2);
            const profitPerUnit = +(sellingPrice - costPrice - shippingCost - platformFee).toFixed(2);
            const profitMargin = +((profitPerUnit / sellingPrice) * 100).toFixed(1);
            return {
              ...p,
              profit: { costPrice, sellingPrice, shippingCost, platformFee, profitPerUnit, profitMargin },
            };
          }),
        }));
      },

      updateProductNotes: (id, notes) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, notes } : p
          ),
        }));
      },

      updateDropshippingRules: (id, rules) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, dropshipping: { ...p.dropshipping, ...rules } } : p
          ),
        }));
      },

      updateProductInfo: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      getFilteredProducts: () => {
        const { products, activeTab } = get();
        if (activeTab === 'all') return products;
        return products.filter((p) => p.status === activeTab);
      },

      getStats: () => {
        const { products } = get();
        const pending = products.filter((p) => p.status === 'pending');
        const ready = products.filter((p) => p.status === 'ready');
        const listed = products.filter((p) => p.status === 'listed');
        const downlisted = products.filter((p) => p.status === 'downlisted');
        const allProfit = [...ready, ...listed];
        const avgMargin = allProfit.length > 0
          ? +(allProfit.reduce((sum, p) => sum + p.profit.profitMargin, 0) / allProfit.length).toFixed(1)
          : 0;
        return {
          pending: pending.length,
          ready: ready.length,
          listed: listed.length,
          downlisted: downlisted.length,
          total: products.length,
          avgMargin,
        };
      },

      listProduct: (id, xhsUrl, xhsTitle, xhsPrice) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const updated = {
              ...p,
              status: 'listed' as const,
              xhsUrl,
              xhsTitle,
              xhsPrice,
              listedAt: new Date().toISOString(),
              matchScore: 0,
              matchAnalysis: '',
            };
            updated.matchScore = calculateMatchScore(updated);
            updated.matchAnalysis = generateMatchAnalysis(updated);
            return updated;
          }),
        }));
      },

      downlistProduct: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, status: 'downlisted' as const } : p
          ),
        }));
      },

      calculateMatch: (id) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            return {
              ...p,
              matchScore: calculateMatchScore(p),
              matchAnalysis: generateMatchAnalysis(p),
            };
          }),
        }));
      },

      getDashboardStats: () => {
        const { products } = get();
        const listed = products.filter((p) => p.status === 'listed');

        const totalProfit = listed.reduce((sum, p) => sum + p.profit.profitPerUnit, 0);
        const avgMargin = listed.length > 0
          ? +(listed.reduce((sum, p) => sum + p.profit.profitMargin, 0) / listed.length).toFixed(1)
          : 0;

        const categories = (Object.keys(categoryKeywords) as ProductCategory[])
          .filter((c) => c !== '其他')
          .map((category) => {
            const catProducts = products.filter((p) => p.category === category);
            const catListed = catProducts.filter((p) => p.status === 'listed');
            const catTotalProfit = catListed.reduce((sum, p) => sum + p.profit.profitPerUnit, 0);
            const catAvgMargin = catListed.length > 0
              ? +(catListed.reduce((sum, p) => sum + p.profit.profitMargin, 0) / catListed.length).toFixed(1)
              : 0;

            return {
              category,
              total: catProducts.length,
              listed: catListed.length,
              ready: catProducts.filter((p) => p.status === 'ready').length,
              pending: catProducts.filter((p) => p.status === 'pending').length,
              totalProfit: +catTotalProfit.toFixed(2),
              avgMargin: catAvgMargin,
              color: categoryColors[category],
            };
          })
          .filter((c) => c.total > 0)
          .sort((a, b) => b.totalProfit - a.totalProfit);

        return {
          totalProducts: products.length,
          listedProducts: listed.length,
          totalProfit: +totalProfit.toFixed(2),
          avgMargin,
          categories,
        };
      },
    }),
    {
      name: 'product-extractor-storage',
      partialize: (state) => ({
        products: state.products,
        activeTab: state.activeTab,
        lastRefresh: state.lastRefresh,
      }),
    }
  )
);
