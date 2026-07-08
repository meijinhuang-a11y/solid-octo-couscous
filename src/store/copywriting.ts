import { create } from 'zustand';
import type { CopywritingItem, CopywritingStyle, CopywritingDeliverable, PlatformType } from '@/types';
import { VARIANT_SUFFIXES, MAX_VARIANTS } from '@/config/platform';

const initialCopywritings: CopywritingItem[] = [
  {
    id: '1',
    original: '我们的蓝牙耳机音质很好，续航也不错，价格还很实惠。',
    optimized: '🎧 戴上它，世界与我无关\n\n不是所有耳机都敢叫「性价比之王」\n40dB 深度降噪，地铁里也能沉浸式听感\n40小时超长续航，一周一充毫无压力\n百元价位，千元体验，闭眼入不踩雷！',
    style: 'xiaohongshu',
    tags: ['种草笔记', '高性价比'],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    platform: 'xiaohongshu',
    model: 'qwen-free',
    deliverables: [
      {
        title: '百元耳机天花板｜降噪+长续航',
        coverText: '🎧 戴上它，世界与我无关',
        detailText: '不是所有耳机都敢叫「性价比之王」\n40dB 深度降噪，地铁里也能沉浸式听感\n40小时超长续航，一周一充毫无压力\n百元价位，千元体验，闭眼入不踩雷！',
        coverImagePrompt: '蓝牙耳机产品图，简约白色背景，高级感，3:4竖版',
        detailImagePrompt: '耳机佩戴场景图，地铁通勤场景，沉浸式体验',
        hashtags: ['#好物分享', '#蓝牙耳机', '#降噪耳机', '#性价比'],
      },
    ],
  },
  {
    id: '2',
    original: '618大促，全场商品5折起，还有更多优惠等你来。',
    optimized: '🔥 618狂欢启幕｜全场低至5折\n\n不止是折扣，是把心动变成行动的时刻。\n精选好物，限时优惠，错过再等一年。\n现在下单，还有神秘好礼相赠～',
    style: 'marketing',
    tags: ['促销文案', '转化话术'],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    platform: 'douyin',
    model: 'glm-free',
  },
  {
    id: '3',
    original: '今天给大家分享一个超好用的学习方法，亲测有效。',
    optimized: '家人们谁懂啊！这个方法我怎么才发现😭\n\n用了这个方法之后，\n我效率直接提升了300%！\n之前3天做不完的事，现在1天搞定！\n宝子们赶快收藏起来，真的绝绝子✅',
    style: 'douyin',
    tags: ['短视频脚本', '干货分享'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    platform: 'douyin',
    model: 'baichuan-free',
  },
];

interface CopywritingState {
  copywritings: CopywritingItem[];
  isGenerating: boolean;
  optimizeCopy: (params: {
    original: string;
    style: CopywritingStyle;
    tags: string[];
    platform?: PlatformType;
    model?: string;
  }) => void;
  batchGenerate: (params: {
    original: string;
    style: CopywritingStyle;
    tags: string[];
    platform: PlatformType;
    model: string;
    variantCount?: number;
  }) => void;
  updateDeliverable: (copyId: string, versionIndex: number, updates: Partial<CopywritingDeliverable>) => void;
  deleteCopywriting: (id: string) => void;
}

// 根据风格和平台生成单版文案
const generateOptimized = (original: string, style: CopywritingStyle): string => {
  const templates: Record<CopywritingStyle, (text: string) => string> = {
    marketing: (text) =>
      `🔥 限时特惠｜错过再等一年\n\n${text.slice(0, 30)}...\n\n不只是产品，更是品质生活的开始。\n现在下单享专属优惠，还有好礼相赠～\n立即行动，让美好发生！`,
    xiaohongshu: (text) =>
      `姐妹们！这个真的绝绝子😭\n\n${text.slice(0, 40)}\n\n用了之后才知道什么叫相见恨晚\n素颜也能自信出门\n亲测有效，闭眼入不踩雷✅\n\n#好物分享 #真实测评 #种草`,
    douyin: (text) =>
      `家人们谁懂啊！\n\n${text.slice(0, 30)}\n\n我怎么才发现这个宝藏！\n点赞收藏不迷路，下期分享更多干货\n关注我，每天一个实用小技巧💡`,
    formal: (text) =>
      `尊敬的用户：\n\n${text}\n\n我们始终致力于为您提供最优质的产品和服务。如有任何疑问，欢迎随时联系我们的客服团队。\n\n感谢您的信任与支持。`,
    humorous: (text) =>
      `听说你在找这个？👀\n\n${text.slice(0, 35)}\n\n别犹豫了，买它！\n大不了吃土几天，但快乐是永久的😎\n（开玩笑的，理性消费，按需购买）`,
    emotional: (text) =>
      `有些东西，值得等待。\n\n${text}\n\n就像生活中的那些小确幸，\n虽然平凡，却总能在不经意间温暖你我。\n愿每一份用心，都能被温柔以待。`,
  };
  return templates[style](original);
};

// 根据风格、平台、变体索引生成交付物
const generateDeliverable = (
  original: string,
  style: CopywritingStyle,
  platform: PlatformType,
  variantIndex: number
): CopywritingDeliverable => {
  const variantLabel = VARIANT_SUFFIXES[variantIndex] || '';
  const baseText = original.slice(0, 30);

  // 标题生成
  const titleTemplates: Record<string, (t: string, i: number) => string> = {
    xiaohongshu: (t, i) => {
      const titles = [
        `姐妹们冲！${t.slice(0, 8)}😭`,
        `被治愈了｜${t.slice(0, 10)}`,
        `亲测300%｜${t.slice(0, 10)}`,
        `终于等到了！${t.slice(0, 8)}`,
        `年度最佳｜${t.slice(0, 10)}`,
      ];
      return titles[i] || titles[0];
    },
    douyin: (t, i) => {
      const titles = [
        `家人们！${t.slice(0, 10)}`,
        `这谁顶得住！${t.slice(0, 10)}`,
        `绝了！${t.slice(0, 12)}`,
        `才发现的宝藏｜${t.slice(0, 8)}`,
        `火爆全网！${t.slice(0, 10)}`,
      ];
      return titles[i] || titles[0];
    },
  };
  const titleFn = titleTemplates[platform] || ((t: string) => t.slice(0, 20));
  const title = titleFn(baseText, variantIndex);

  // 首页文案（封面文案）
  const coverTexts = [
    `${baseText}... ${variantLabel}`,
    `忍不住分享！${baseText}`,
    `后悔没早知道的${baseText}`,
    `${baseText} 真的太香了`,
    `2024必入｜${baseText}`,
  ];

  // 详情页文案
  const detailTexts = [
    `${original}\n\n${variantLabel}\n用心分享，值得收藏✨`,
    `关于「${baseText}」我想说...\n\n${original}\n\n希望对你有帮助 💫`,
    `数据说话📊\n\n${original}\n\n实测有效，放心抄作业 ✅`,
    `故事要从那天说起...\n\n${original}\n\n每个细节都值得记录 📝`,
    `最近超火的${baseText}！\n\n${original}\n\n跟上潮流不迷路 🔥`,
  ];

  // 图片提示词
  const coverImagePrompts = [
    `产品精美展示，${platform === 'xiaohongshu' ? '3:4竖版' : '9:16竖版'}，高级简约风格`,
    `生活场景使用图，温馨氛围，自然光线`,
    `数据对比图，清晰直观，信息可视化`,
    `故事化场景，人物互动，情感表达`,
    `潮流风格，热门元素，吸睛设计`,
  ];

  const detailImagePrompts = [
    `产品细节特写，高清质感，多角度展示`,
    `使用前后对比，效果一目了然`,
    `功能亮点图解，信息清晰`,
    `用户真实体验场景，生活化拍摄`,
    `热门话题元素结合，潮流感强`,
  ];

  // 话题标签
  const hashtagSets = [
    ['#好物分享', '#真实测评', '#种草笔记', '#生活好物'],
    ['#好物推荐', '#亲测有效', '#闭眼入', '#性价比'],
    ['#干货分享', '#实用技巧', '#效率提升', '#必看'],
    ['#热门好物', '#新品推荐', '#限时优惠', '#必买'],
    ['#年度好物', '#口碑推荐', '#回购无限', '#安利'],
  ];

  return {
    title,
    coverText: coverTexts[variantIndex] || coverTexts[0],
    detailText: detailTexts[variantIndex] || detailTexts[0],
    coverImagePrompt: coverImagePrompts[variantIndex] || coverImagePrompts[0],
    detailImagePrompt: detailImagePrompts[variantIndex] || detailImagePrompts[0],
    hashtags: hashtagSets[variantIndex] || hashtagSets[0],
  };
};

// 批量生成交付物（支持1-10版）
const generateBatchDeliverables = (
  original: string,
  style: CopywritingStyle,
  platform: PlatformType,
  count: number = 5
): CopywritingDeliverable[] => {
  const actualCount = Math.min(count, MAX_VARIANTS);
  return Array.from({ length: actualCount }, (_, i) =>
    generateDeliverable(original, style, platform, i)
  );
};

export const useCopywritingStore = create<CopywritingState>((set) => ({
  copywritings: initialCopywritings,
  isGenerating: false,

  optimizeCopy: ({ original, style, tags, platform, model }) => {
    const optimized = generateOptimized(original, style);
    const deliverables = platform
      ? generateBatchDeliverables(original, style, platform)
      : undefined;

    const newItem: CopywritingItem = {
      id: Date.now().toString(),
      original,
      optimized,
      style,
      tags,
      createdAt: new Date().toISOString(),
      platform,
      model,
      deliverables,
    };
    set((state) => ({
      copywritings: [newItem, ...state.copywritings],
    }));
  },

  batchGenerate: ({ original, style, tags, platform, model, variantCount = 5 }) => {
    set({ isGenerating: true });

    const deliverables = generateBatchDeliverables(original, style, platform, variantCount);
    const optimized = generateOptimized(original, style);

    const newItem: CopywritingItem = {
      id: Date.now().toString(),
      original,
      optimized,
      style,
      tags,
      createdAt: new Date().toISOString(),
      platform,
      model,
      deliverables,
    };

    setTimeout(() => {
      set((state) => ({
        copywritings: [newItem, ...state.copywritings],
        isGenerating: false,
      }));
    }, 1500);
  },

  updateDeliverable: (copyId, versionIndex, updates) => {
    set((state) => ({
      copywritings: state.copywritings.map((c) => {
        if (c.id !== copyId || !c.deliverables) return c;
        return {
          ...c,
          deliverables: c.deliverables.map((d, i) =>
            i === versionIndex ? { ...d, ...updates } : d
          ),
        };
      }),
    }));
  },

  deleteCopywriting: (id) => {
    set((state) => ({
      copywritings: state.copywritings.filter((c) => c.id !== id),
    }));
  },
}));
