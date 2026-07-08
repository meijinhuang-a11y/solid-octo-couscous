import { create } from 'zustand';
import type { ProductInfo, ProductStatus, ProductCategory } from '@/types';

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

const mockProducts: ProductInfo[] = [
  {
    id: '1',
    url: 'https://www.1688.com/offer/66888888888.html',
    title: '2024新款夏季短袖T恤男纯棉宽松潮流印花半袖上衣',
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', alt: '商品主图' },
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', alt: '细节图1' },
      { url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800', alt: '细节图2' },
    ],
    price: '¥25.00',
    originalPrice: '¥49.00',
    sales: '1000+件',
    storeName: '广州潮流服饰有限公司',
    storeUrl: 'https://www.1688.com/store/xxx',
    location: '广东广州',
    shipping: '包邮',
    deliveryTime: '48小时内发货',
    specifications: {
      '品牌': '潮流优选',
      '货号': 'TX202406',
      '面料': '纯棉',
      '风格': '休闲',
      '版型': '宽松',
      '颜色': '黑色、白色、灰色',
      '尺码': 'S/M/L/XL/XXL',
    },
    description: '优质纯棉面料，舒适透气，潮流印花设计，适合日常穿搭。支持批发定制，量大价优。',
    tags: ['夏季爆款', '纯棉', '宽松', '潮流'],
    scrapedAt: new Date().toISOString(),
    status: 'listed',
    supplier: {
      name: '广州潮流服饰有限公司',
      url: 'https://www.1688.com/store/xxx',
      location: '广东广州',
      rating: 4.8,
      yearsInBusiness: 5,
      responseTime: '2小时内',
      tags: ['超级工厂', '实力商家'],
    },
    dropshipping: {
      supportsDropshipping: true,
      providesXhsWaybill: true,
      supportsFreeReturn: true,
      minOrderQuantity: 1,
      returnPolicy: '7天无理由退货，退货运费由供应商承担',
    },
    profit: {
      costPrice: 25,
      sellingPrice: 69,
      shippingCost: 0,
      platformFee: 3.45,
      profitPerUnit: 40.55,
      profitMargin: 58.8,
    },
    notes: '已通过供应商审核，支持小红书面单和包邮退货，利润空间充足',
    xhsUrl: 'https://www.xiaohongshu.com/goods/66888888',
    xhsTitle: '【夏日必备】纯棉宽松短袖T恤 男女同款',
    xhsPrice: 69,
    listedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    matchScore: 92,
    matchAnalysis: '商品标题匹配度高，价格与1688进价的利润率合理，供应商支持一件代发和小红书面单，整体匹配度优秀。',
    category: '服饰',
  },
  {
    id: '2',
    url: 'https://www.1688.com/offer/66666666666.html',
    title: '北欧风简约陶瓷花瓶现代家居装饰摆件插花器',
    images: [
      { url: 'https://images.unsplash.com/photo-1519711263458-afc8c89f4978?w=800', alt: '商品主图' },
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', alt: '细节图1' },
    ],
    price: '¥18.50',
    originalPrice: '¥35.00',
    sales: '500+件',
    storeName: '景德镇陶瓷工艺品厂',
    storeUrl: 'https://www.1688.com/store/yyy',
    location: '江西景德镇',
    shipping: '满50包邮',
    deliveryTime: '72小时内发货',
    specifications: {
      '材质': '陶瓷',
      '风格': '北欧简约',
      '工艺': '高温烧制',
      '颜色': '白色、米色、灰色',
      '尺寸': '小号/中号/大号',
    },
    description: '精选陶瓷材质，手工打磨，简约北欧风格，为您的家居增添艺术气息。',
    tags: ['北欧风', '陶瓷', '家居装饰', '摆件'],
    scrapedAt: new Date().toISOString(),
    status: 'ready',
    supplier: {
      name: '景德镇陶瓷工艺品厂',
      url: 'https://www.1688.com/store/yyy',
      location: '江西景德镇',
      rating: 4.9,
      yearsInBusiness: 8,
      responseTime: '1小时内',
      tags: ['源头旗舰'],
    },
    dropshipping: {
      supportsDropshipping: true,
      providesXhsWaybill: true,
      supportsFreeReturn: true,
      minOrderQuantity: 1,
      returnPolicy: '7天无理由退货，退货运费由供应商承担',
    },
    profit: {
      costPrice: 18.5,
      sellingPrice: 59,
      shippingCost: 5,
      platformFee: 2.95,
      profitPerUnit: 32.55,
      profitMargin: 55.2,
    },
    notes: '供应商已确认支持小红书面单，利润测算完成，准备上架',
    category: '家居',
  },
  {
    id: '3',
    url: 'https://www.1688.com/offer/66777777777.html',
    title: '创意USB充电小风扇便携式迷你手持风扇学生宿舍静音',
    images: [
      { url: 'https://images.unsplash.com/photo-1594535182308-8ffefbb665e0?w=800', alt: '商品主图' },
      { url: 'https://images.unsplash.com/photo-1594535182308-8ffefbb665e0?w=400', alt: '细节图1' },
    ],
    price: '¥12.80',
    originalPrice: '¥29.90',
    sales: '2000+件',
    storeName: '深圳数码电器批发',
    storeUrl: 'https://www.1688.com/store/zzz',
    location: '广东深圳',
    shipping: '包邮',
    deliveryTime: '24小时内发货',
    specifications: {
      '品牌': '清凉风',
      '材质': 'ABS+电子元件',
      '电池': '2000mAh',
      '档位': '3档调速',
      '颜色': '白色、粉色、蓝色',
    },
    description: '迷你便携式USB充电小风扇，静音设计，三档风速调节，适合学生宿舍和办公室使用。',
    tags: ['小风扇', 'USB充电', '迷你', '静音'],
    scrapedAt: new Date().toISOString(),
    status: 'pending',
    supplier: {
      name: '深圳数码电器批发',
      url: 'https://www.1688.com/store/zzz',
      location: '广东深圳',
      rating: 4.7,
      yearsInBusiness: 3,
      responseTime: '2小时内',
      tags: ['实力商家'],
    },
    dropshipping: {
      supportsDropshipping: true,
      providesXhsWaybill: false,
      supportsFreeReturn: false,
      minOrderQuantity: 2,
      returnPolicy: '质量问题包退，非质量问题不退换',
    },
    profit: {
      costPrice: 12.8,
      sellingPrice: 0,
      shippingCost: 0,
      platformFee: 0,
      profitPerUnit: 0,
      profitMargin: 0,
    },
    notes: '刚提取，待沟通确认小红书面单和退货政策',
    category: '数码',
  },
  {
    id: '4',
    url: 'https://www.1688.com/offer/66555555555.html',
    title: '无线蓝牙耳机降噪运动跑步入耳式高音质耳麦',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', alt: '商品主图' },
    ],
    price: '¥35.00',
    originalPrice: '¥89.00',
    sales: '3000+件',
    storeName: '深圳音频科技',
    storeUrl: 'https://www.1688.com/store/audio',
    location: '广东深圳',
    shipping: '包邮',
    deliveryTime: '48小时内发货',
    specifications: {
      '连接方式': '蓝牙5.3',
      '续航': '30小时',
      '降噪': 'ANC主动降噪',
      '颜色': '黑色、白色',
    },
    description: '高品质蓝牙耳机，主动降噪，超长续航，适合运动和通勤使用。',
    tags: ['蓝牙耳机', '降噪', '运动', '高音质'],
    scrapedAt: new Date().toISOString(),
    status: 'listed',
    supplier: {
      name: '深圳音频科技',
      url: 'https://www.1688.com/store/aaa',
      location: '广东深圳',
      rating: 4.6,
      yearsInBusiness: 6,
      responseTime: '2小时内',
      tags: ['旗舰店'],
    },
    dropshipping: {
      supportsDropshipping: true,
      providesXhsWaybill: true,
      supportsFreeReturn: true,
      minOrderQuantity: 1,
      returnPolicy: '7天无理由退货，退货运费由供应商承担',
    },
    profit: {
      costPrice: 35,
      sellingPrice: 129,
      shippingCost: 0,
      platformFee: 6.45,
      profitPerUnit: 87.55,
      profitMargin: 67.9,
    },
    notes: '数码品类爆款，利润率高',
    xhsUrl: 'https://www.xiaohongshu.com/goods/66555555',
    xhsTitle: '【降噪神器】无线蓝牙耳机 运动必备',
    xhsPrice: 129,
    listedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    matchScore: 95,
    matchAnalysis: '数码品类热门商品，供应商评分高，利润率优秀，匹配度极佳。',
    category: '数码',
  },
  {
    id: '5',
    url: 'https://www.1688.com/offer/66444444444.html',
    title: '纯棉四件套床上用品简约北欧风床单被套',
    images: [
      { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800', alt: '商品主图' },
    ],
    price: '¥68.00',
    originalPrice: '¥128.00',
    sales: '800+件',
    storeName: '南通家纺批发',
    storeUrl: 'https://www.1688.com/store/home',
    location: '江苏南通',
    shipping: '包邮',
    deliveryTime: '72小时内发货',
    specifications: {
      '材质': '100%纯棉',
      '支数': '60支',
      '尺寸': '1.5m/1.8m/2.0m',
      '风格': '北欧简约',
    },
    description: '100%纯棉四件套，60支高密织造，柔软亲肤，北欧简约风格。',
    tags: ['四件套', '纯棉', '北欧风', '床品'],
    scrapedAt: new Date().toISOString(),
    status: 'ready',
    supplier: {
      name: '南通家纺批发',
      url: 'https://www.1688.com/store/home',
      location: '江苏南通',
      rating: 4.6,
      yearsInBusiness: 6,
      responseTime: '3小时内',
      tags: ['实力商家'],
    },
    dropshipping: {
      supportsDropshipping: true,
      providesXhsWaybill: true,
      supportsFreeReturn: true,
      minOrderQuantity: 1,
      returnPolicy: '7天无理由退货，退货运费由供应商承担',
    },
    profit: {
      costPrice: 68,
      sellingPrice: 168,
      shippingCost: 8,
      platformFee: 8.4,
      profitPerUnit: 83.6,
      profitMargin: 49.8,
    },
    notes: '家纺品类利润稳定，准备上架',
    category: '家居',
  },
  {
    id: '6',
    url: 'https://www.1688.com/offer/66333333333.html',
    title: '时尚韩版女士连衣裙夏季新款收腰显瘦气质长裙',
    images: [
      { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', alt: '商品主图' },
    ],
    price: '¥45.00',
    originalPrice: '¥99.00',
    sales: '1500+件',
    storeName: '杭州女装批发',
    storeUrl: 'https://www.1688.com/store/dress',
    location: '浙江杭州',
    shipping: '包邮',
    deliveryTime: '48小时内发货',
    specifications: {
      '材质': '雪纺',
      '风格': '韩版',
      '版型': '收腰',
      '尺码': 'S/M/L/XL',
    },
    description: '时尚韩版连衣裙，收腰显瘦设计，气质优雅，适合夏季穿搭。',
    tags: ['连衣裙', '韩版', '显瘦', '气质'],
    scrapedAt: new Date().toISOString(),
    status: 'pending',
    supplier: {
      name: '杭州女装批发',
      url: 'https://www.1688.com/store/dress',
      location: '浙江杭州',
      rating: 4.5,
      yearsInBusiness: 4,
      responseTime: '2小时内',
      tags: ['源头旗舰'],
    },
    dropshipping: {
      supportsDropshipping: true,
      providesXhsWaybill: false,
      supportsFreeReturn: false,
      minOrderQuantity: 2,
      returnPolicy: '质量问题包退',
    },
    profit: {
      costPrice: 45,
      sellingPrice: 0,
      shippingCost: 0,
      platformFee: 0,
      profitPerUnit: 0,
      profitMargin: 0,
    },
    notes: '女装爆款潜力，需确认代发条件',
    category: '服饰',
  },
  {
    id: '7',
    url: 'https://www.1688.com/offer/66222222222.html',
    title: '轻奢真皮钱包男士短款钱夹多卡位商务皮夹',
    images: [
      { url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', alt: '商品主图' },
    ],
    price: '¥32.00',
    originalPrice: '¥68.00',
    sales: '600+件',
    storeName: '东莞皮具加工厂',
    storeUrl: 'https://www.1688.com/store/leather',
    location: '广东东莞',
    shipping: '满50包邮',
    deliveryTime: '72小时内发货',
    specifications: {
      '材质': '头层牛皮',
      '卡位': '12卡位',
      '颜色': '黑色、棕色',
    },
    description: '头层牛皮短款钱包，多卡位设计，商务休闲两用。',
    tags: ['钱包', '真皮', '商务', '男士'],
    scrapedAt: new Date().toISOString(),
    status: 'listed',
    supplier: {
      name: '东莞皮具加工厂',
      url: 'https://www.1688.com/store/leather',
      location: '广东东莞',
      rating: 4.4,
      yearsInBusiness: 7,
      responseTime: '4小时内',
      tags: ['旗舰店'],
    },
    dropshipping: {
      supportsDropshipping: true,
      providesXhsWaybill: true,
      supportsFreeReturn: true,
      minOrderQuantity: 1,
      returnPolicy: '7天无理由退货，退货运费由供应商承担',
    },
    profit: {
      costPrice: 32,
      sellingPrice: 98,
      shippingCost: 5,
      platformFee: 4.9,
      profitPerUnit: 56.1,
      profitMargin: 57.2,
    },
    notes: '配饰品类利润可观',
    xhsUrl: 'https://www.xiaohongshu.com/goods/66222222',
    xhsTitle: '【头层牛皮】男士短款钱包 多卡位',
    xhsPrice: 98,
    listedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    matchScore: 88,
    matchAnalysis: '配饰品类竞争适中，供应商稳定，利润率良好。',
    category: '配饰',
  },
  {
    id: '8',
    url: 'https://www.1688.com/offer/66111111111.html',
    title: '儿童益智积木玩具拼装早教启蒙礼物',
    images: [
      { url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800', alt: '商品主图' },
    ],
    price: '¥28.00',
    originalPrice: '¥58.00',
    sales: '1200+件',
    storeName: '义乌玩具批发',
    storeUrl: 'https://www.1688.com/store/toy',
    location: '浙江义乌',
    shipping: '包邮',
    deliveryTime: '48小时内发货',
    specifications: {
      '材质': 'ABS环保塑料',
      '颗粒数': '300+',
      '适用年龄': '3-8岁',
    },
    description: '环保ABS材质益智积木，多彩颗粒，激发儿童创造力。',
    tags: ['积木', '益智', '儿童玩具', '早教'],
    scrapedAt: new Date().toISOString(),
    status: 'ready',
    supplier: {
      name: '义乌玩具批发',
      url: 'https://www.1688.com/store/toy',
      location: '浙江义乌',
      rating: 4.7,
      yearsInBusiness: 5,
      responseTime: '2小时内',
      tags: ['实力商家'],
    },
    dropshipping: {
      supportsDropshipping: true,
      providesXhsWaybill: true,
      supportsFreeReturn: true,
      minOrderQuantity: 1,
      returnPolicy: '7天无理由退货，退货运费由供应商承担',
    },
    profit: {
      costPrice: 28,
      sellingPrice: 79,
      shippingCost: 0,
      platformFee: 3.95,
      profitPerUnit: 47.05,
      profitMargin: 59.6,
    },
    notes: '母婴品类热门，利润高',
    category: '母婴',
  },
];

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
  lastExtracted: ProductInfo | null;
  lastRefresh: string;
  isRefreshing: boolean;
  activeTab: ProductStatus | 'all';
  extractFromUrl: (url: string) => Promise<void>;
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
}

const parsePrice = (priceStr: string): number => {
  const match = priceStr.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const generateMockProduct = (url: string): ProductInfo => {
  const titles = [
    '时尚韩版女士连衣裙夏季新款收腰显瘦气质长裙',
    '无线蓝牙耳机降噪运动跑步入耳式高音质耳麦',
    '多功能厨房料理机家用榨汁机搅拌机辅食机',
    '轻奢真皮钱包男士短款钱夹多卡位商务皮夹',
    '纯棉四件套床上用品简约北欧风床单被套',
    '智能手环运动手表心率监测防水计步器',
    '保温杯不锈钢大容量水杯便携车载杯子',
    '儿童益智积木玩具拼装早教启蒙礼物',
  ];

  const stores = [
    '义乌商贸城批发中心',
    '深圳电子科技有限公司',
    '杭州家居用品厂',
    '东莞皮具加工厂',
    '宁波小家电制造公司',
  ];

  const locations = ['浙江义乌', '广东深圳', '浙江杭州', '广东东莞', '浙江宁波'];

  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomStore = stores[Math.floor(Math.random() * stores.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  const randomPrice = (Math.random() * 50 + 10).toFixed(2);
  const costPrice = parseFloat(randomPrice);

  return {
    id: Date.now().toString(),
    url,
    title: randomTitle,
    images: [
      { url: 'https://images.unsplash.com/photo-1556740755-069a4032339c?w=800', alt: '商品主图' },
      { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800', alt: '细节图1' },
      { url: 'https://images.unsplash.com/photo-1560472354-c967d877e767?w=800', alt: '细节图2' },
    ],
    price: `¥${randomPrice}`,
    originalPrice: `¥${(costPrice * 1.8).toFixed(2)}`,
    sales: `${Math.floor(Math.random() * 2000) + 100}+件`,
    storeName: randomStore,
    storeUrl: 'https://www.1688.com/store/default',
    location: randomLocation,
    shipping: '包邮',
    deliveryTime: Math.random() > 0.5 ? '48小时内发货' : '72小时内发货',
    specifications: {
      '品牌': '精选优品',
      '材质': '优质材料',
      '颜色': '多种颜色可选',
      '规格': '多种规格',
    },
    description: '优质商品，品质保证，支持批发定制，量大价优。欢迎咨询选购！',
    tags: ['热销', '批发', '定制', '品质保证'],
    scrapedAt: new Date().toISOString(),
    status: 'pending',
    supplier: {
      name: randomStore,
      url: 'https://www.1688.com/store/default',
      location: randomLocation,
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      yearsInBusiness: Math.floor(Math.random() * 10) + 1,
      responseTime: Math.random() > 0.5 ? '2小时内' : '4小时内',
      tags: ['实力商家'],
    },
    dropshipping: {
      supportsDropshipping: true,
      providesXhsWaybill: false,
      supportsFreeReturn: false,
      minOrderQuantity: 1,
      returnPolicy: '质量问题包退',
    },
    profit: {
      costPrice,
      sellingPrice: 0,
      shippingCost: 0,
      platformFee: 0,
      profitPerUnit: 0,
      profitMargin: 0,
    },
    notes: '',
    category: autoClassify(randomTitle, ['热销', '批发', '定制', '品质保证'], '优质商品，品质保证，支持批发定制，量大价优。欢迎咨询选购！'),
  };
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

const categoryColors: Record<ProductCategory, string> = {
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

export const useProductExtractorStore = create<ProductExtractorState>((set, get) => ({
  products: mockProducts,
  isExtracting: false,
  lastExtracted: null,
  lastRefresh: new Date().toISOString(),
  isRefreshing: false,
  activeTab: 'all',

  extractFromUrl: async (url) => {
    set({ isExtracting: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const product = generateMockProduct(url);
    set((state) => ({
      products: [product, ...state.products],
      isExtracting: false,
      lastExtracted: product,
      activeTab: 'pending',
    }));
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
}));
