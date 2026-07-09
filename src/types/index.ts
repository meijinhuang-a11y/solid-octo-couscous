export type TaskType = 'short' | 'long' | 'recurring';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly';

export interface RecurringRule {
  frequency: RecurringFrequency;
  interval?: number;
  weekdays?: number[];
  endDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  taskType: TaskType;
  dueDate: string;
  startDate: string;
  endDate: string;
  reminderTime?: string;
  recurringRule?: RecurringRule;
  lastRemindedAt?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  reminded?: boolean;
}

export type NoteReminderType = 'none' | 'once' | 'recurring' | 'multi' | 'until-done';

export interface NoteReminderRule {
  type: NoteReminderType;
  reminderTime: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  weekdays?: number[];
  interval?: number;
  repeatCount?: number;
  triggeredCount?: number;
  untilDone?: boolean;
  endTime?: string;
  originalText?: string;
  description?: string;
  lastTriggerTime?: number;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  aiTitle?: string;
  aiTags?: string[];
  aiCategory?: string;
  aiSummary?: string;
  aiKeyPoints?: string[];
  pinned?: boolean;
  reminder?: NoteReminderRule | null;
  completed?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
  category: string;
  source: string;
  publishDate: string;
  isRead: boolean;
  isFavorite: boolean;
  tags: string[];
}

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type PhotoItemStatus = 'original' | 'processing' | 'enhanced';

// 平台规格
export type PlatformType = 'xiaohongshu' | 'douyin' | 'wechat_video' | 'bilibili';

export interface PlatformSpec {
  type: PlatformType;
  name: string;
  icon: string;
  // 图片规格
  imageRatio: string;        // 推荐比例 如 "3:4"
  imageSize: string;         // 推荐尺寸 如 "1242x1656"
  imageMaxCount: number;     // 最多图片数
  // 视频规格
  videoRatio: string;        // 视频比例 如 "9:16"
  videoResolution: string;   // 推荐分辨率 如 "1080x1920"
  videoMaxDuration: number;  // 最大时长(秒)
  videoMaxSize: string;      // 最大文件大小
  // 文案规格
  titleMaxLength: number;    // 标题最大字数
  contentMaxLength: number;  // 正文最大字数
  // 发布规则
  rules: string[];           // 平台发布规则
  hashtagLimit: number;      // 话题标签数量上限
}

// 大模型选项
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  isFree: boolean;
  description: string;
  capabilities: ('text' | 'image' | 'video')[];
}

// 滤镜参数
export interface FilterParams {
  brightness: number;   // 亮度 0-200
  contrast: number;     // 对比度 0-200
  saturation: number;   // 饱和度 0-200
  warmth: number;       // 暖色调 0-100
  sharpness: number;    // 锐度 0-100
  filterPreset: string; // 滤镜预设
}

// 导出格式
export type ExportFormat = 'png' | 'jpg' | 'webp' | 'mp4' | 'mov' | 'gif';

export interface ExportOption {
  format: ExportFormat;
  label: string;
  quality: 'low' | 'medium' | 'high';
  platform?: PlatformType;
}

export interface PhotoItem {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  size: number;
  width: number;
  height: number;
  status: PhotoItemStatus;
  enhancementType?: string;
  uploadDate: string;
  enhancedAt?: string;
  // 新增：批量生成相关
  prompt?: string;                  // 生成描述
  platform?: PlatformType;          // 目标平台
  model?: string;                   // 使用的模型
  filterParams?: FilterParams;      // 滤镜参数
  batchVersions?: PhotoItem[];      // 批量生成的5个版本
  exportFormat?: ExportFormat;      // 导出格式
  isBatchVersion?: boolean;         // 是否为批量版本
  versionIndex?: number;            // 版本序号 1-5
}

export type CopywritingStyle = 'marketing' | 'xiaohongshu' | 'douyin' | 'formal' | 'humorous' | 'emotional';

// 文案交付物字段
export interface CopywritingDeliverable {
  title: string;           // 标题
  coverText: string;       // 首页文案（封面文案）
  detailText: string;      // 详情页文案（正文）
  coverImagePrompt: string; // 首页图片生成提示词
  detailImagePrompt: string; // 详情页图片生成提示词
  hashtags: string[];      // 话题标签
}

export interface CopywritingItem {
  id: string;
  original: string;
  optimized: string;
  style: CopywritingStyle;
  tags: string[];
  createdAt: string;
  // 新增：批量生成相关
  platform?: PlatformType;           // 目标平台
  model?: string;                    // 使用的模型
  deliverables?: CopywritingDeliverable[]; // 5个版本的交付物
  isBatchVersion?: boolean;          // 是否为批量版本
  versionIndex?: number;             // 版本序号 1-5
}

export type VideoEnhancementType = 'subtitle' | 'clip' | 'cover' | 'beauty' | 'resize' | 'bgm';

// 视频参数调整
export interface VideoAdjustParams {
  brightness: number;   // 亮度 0-200
  contrast: number;     // 对比度 0-200
  saturation: number;   // 饱和度 0-200
  speed: number;        // 播放速度 0.5-2.0
  volume: number;       // 音量 0-100
  filterPreset: string; // 滤镜预设
}

export interface VideoItem {
  id: string;
  name: string;
  thumbnail: string;
  duration: number;
  size: number;
  resolution: string;
  status: 'original' | 'processing' | 'enhanced';
  enhancementType?: string;
  uploadDate: string;
  enhancedAt?: string;
  // 新增：批量生成相关
  prompt?: string;                  // 生成描述
  platform?: PlatformType;          // 目标平台
  model?: string;                   // 使用的模型
  adjustParams?: VideoAdjustParams; // 参数调整
  batchVersions?: VideoItem[];      // 批量生成的5个版本
  exportFormat?: ExportFormat;      // 导出格式
  isBatchVersion?: boolean;         // 是否为批量版本
  versionIndex?: number;            // 版本序号 1-5
}

export type FileCategory = 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
export type StorageLocation = 'cloud' | 'local';

export interface FileItem {
  id: string;
  name: string;
  category: FileCategory;
  size: number;
  modifiedAt: string;
  path: string;
  storageLocation: StorageLocation;
}

export type WhitepaperCategory = 'marketing' | 'media' | 'insight' | 'platform';

export interface ProductImage {
  url: string;
  alt: string;
}

export type ProductStatus = 'pending' | 'ready' | 'listed' | 'downlisted' | 'rejected';

export type SupplierTag = '旗舰店' | '源头旗舰' | '实力商家' | '超级工厂';

export interface SupplierInfo {
  name: string;
  url: string;
  location: string;
  rating: number;
  yearsInBusiness: number;
  responseTime: string;
  tags: SupplierTag[];
}

export interface DropshippingRules {
  supportsDropshipping: boolean;
  providesXhsWaybill: boolean;
  supportsFreeReturn: boolean;
  minOrderQuantity: number;
  returnPolicy: string;
}

export interface ProfitInfo {
  costPrice: number;
  sellingPrice: number;
  shippingCost: number;
  platformFee: number;
  profitPerUnit: number;
  profitMargin: number;
}

export type ProductCategory = '服饰' | '家居' | '数码' | '美妆' | '食品' | '母婴' | '运动' | '配饰' | '其他';

export interface ProductInfo {
  id: string;
  url: string;
  title: string;
  images: ProductImage[];
  price: string;
  originalPrice?: string;
  sales: string;
  storeName: string;
  storeUrl: string;
  location: string;
  shipping: string;
  deliveryTime: string;
  specifications: Record<string, string>;
  description: string;
  tags: string[];
  scrapedAt: string;
  status: ProductStatus;
  supplier: SupplierInfo;
  dropshipping: DropshippingRules;
  profit: ProfitInfo;
  notes: string;
  xhsUrl?: string;
  xhsTitle?: string;
  xhsPrice?: number;
  listedAt?: string;
  matchScore?: number;
  matchAnalysis?: string;
  category: ProductCategory;
}

export interface WhitepaperItem {
  id: string;
  title: string;
  category: WhitepaperCategory;
  description: string;
  source: string;
  publishDate: string;
  originalUrl: string;
  downloadUrl?: string;
  canDownload: boolean;
  tags: string[];
}

export interface TrendingVideo {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  growthRate: number;
  platform: string;
  category: string;
  publishDate: string;
  tags: string[];
  description: string;
  trend: 'up' | 'down' | 'stable';
  duration: string;
}

export interface TrendingProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  originalPrice: number;
  sales: string;
  growthRate: number;
  platform: string;
  rating: number;
  reviewCount: number;
  trend: 'up' | 'down' | 'stable';
  tags: string[];
  description: string;
}

export interface HotSearchItem {
  id: string;
  title: string;
  hotnum: number;
  rank: number;
  source?: string;
  url?: string;
  isNew?: boolean;
  isHot?: boolean;
}

export interface HotSearchConfig {
  apiKey: string;
  autoRefresh: boolean;
  refreshInterval: number;
  displayCount: number;
}
