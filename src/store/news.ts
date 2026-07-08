import { create } from 'zustand';
import type { NewsItem } from '@/types';

const initialNews: NewsItem[] = [
  {
    id: '1',
    title: '短视频广告投放新趋势：竖屏原生内容转化率提升40%',
    titleEn: 'New Trends in Short Video Ads: Vertical Native Content Boosts Conversion by 40%',
    summary: '最新行业数据显示，竖屏原生广告的用户停留时间、完播率和转化率均显著高于传统横屏广告...',
    summaryEn: 'Latest industry data shows that vertical native ads significantly outperform traditional horizontal ads in user engagement, completion rates, and conversion rates...',
    content: '随着移动互联网的深入发展，用户的内容消费习惯正在发生深刻变化。竖屏内容凭借其沉浸感强、操作便捷的特点，正在成为广告投放的主流选择。\n\n根据最新的行业报告，竖屏原生广告的平均用户停留时间比横屏广告高出65%，完播率提升52%，而最终的转化率更是提升了40%以上。\n\n业内专家表示，这一趋势将持续加速，品牌方需要尽快调整广告策略，适应竖屏内容的创作和投放模式。',
    contentEn: 'With the deep development of mobile internet, users\' content consumption habits are undergoing profound changes. Vertical content, with its strong immersion and convenient operation, is becoming the mainstream choice for advertising.\n\nAccording to the latest industry report, vertical native ads have 65% higher average user retention time, 52% higher completion rate, and over 40% higher conversion rate compared to horizontal ads.\n\nIndustry experts say this trend will continue to accelerate, and brands need to quickly adjust their advertising strategies to adapt to vertical content creation and delivery models.',
    category: '广告',
    source: '广告观察',
    publishDate: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    isFavorite: false,
    tags: ['短视频', '广告投放', '转化率'],
  },
  {
    id: '2',
    title: 'AI 赋能广告创意：AIGC 工具渗透率突破 70%',
    titleEn: 'AI Empowers Advertising Creativity: AIGC Tool Penetration Exceeds 70%',
    summary: 'AI 生成内容技术正在深刻改变广告创意生产方式，70% 的广告公司已在日常工作中使用 AIGC 工具...',
    summaryEn: 'AI-generated content technology is profoundly changing the way advertising creativity is produced, with 70% of advertising agencies already using AIGC tools in daily work...',
    content: '人工智能技术的快速发展，正在重塑广告创意的生产流程。从文案撰写、图片生成到视频制作，AI 工具正在渗透到创意生产的每一个环节。\n\n最新调研数据显示，目前已有超过 70% 的广告公司和品牌营销部门在日常工作中使用 AIGC 工具。其中，文案写作、图片生成和数据分析是应用最广泛的三个场景。\n\n虽然 AI 工具大幅提升了效率，但行业普遍认为，人的创意洞察和策略思维仍然是不可替代的核心竞争力。',
    contentEn: 'The rapid development of artificial intelligence technology is reshaping the production process of advertising creativity. From copywriting and image generation to video production, AI tools are penetrating every aspect of creative production.\n\nLatest research shows that over 70% of advertising agencies and brand marketing departments now use AIGC tools in their daily work. Among these, copywriting, image generation, and data analysis are the three most widely used scenarios.\n\nAlthough AI tools significantly improve efficiency, the industry generally believes that human creative insight and strategic thinking remain irreplaceable core competencies.',
    category: 'AI',
    source: '数字营销',
    publishDate: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
    isFavorite: true,
    tags: ['AI', 'AIGC', '创意生产'],
  },
  {
    id: '3',
    title: '直播电商进入精细化运营时代',
    titleEn: 'Live E-commerce Enters Era of Refined Operations',
    summary: '从粗放增长到精细化运营，直播电商行业正在经历深刻的转型升级，人货场协同成为关键...',
    summaryEn: 'From extensive growth to refined operations, the live e-commerce industry is undergoing profound transformation, with people-goods-place synergy becoming the key...',
    content: '经过几年的高速发展，直播电商行业正在从粗放式增长向精细化运营转型。主播、选品、运营、数据等各个环节都在不断优化升级。\n\n业内人士指出，直播电商已经度过了靠流量红利就能成功的阶段。未来的竞争将更加依赖精细化运营能力，包括用户分层运营、供应链管理、数据驱动决策等多个维度。\n\n品牌方也在从单纯追求 GMV 转向追求长期价值，更加重视用户沉淀和品牌建设。',
    contentEn: 'After several years of rapid development, the live e-commerce industry is transitioning from extensive growth to refined operations. Various aspects including hosts, product selection, operations, and data are continuously being optimized.\n\nIndustry insiders point out that live e-commerce has passed the stage where success could be achieved through traffic dividends alone. Future competition will depend more on refined operational capabilities, including user segmentation, supply chain management, and data-driven decision-making.\n\nBrands are also shifting from pure GMV pursuit to long-term value, with greater emphasis on user retention and brand building.',
    category: '营销',
    source: '电商报',
    publishDate: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    isFavorite: false,
    tags: ['直播电商', '精细化运营', '供应链'],
  },
  {
    id: '4',
    title: '苹果发布全新 Vision Pro 2，重新定义空间计算',
    titleEn: 'Apple Unveils New Vision Pro 2, Redefining Spatial Computing',
    summary: '苹果在 WWDC 2026 上发布了第二代 Vision Pro，带来更轻的设计、更强的性能和全新的交互体验...',
    summaryEn: 'Apple announced the second-generation Vision Pro at WWDC 2026, featuring lighter design, stronger performance, and new interaction experiences...',
    content: '苹果公司在年度全球开发者大会上正式发布了 Vision Pro 2。这款新一代空间计算设备采用了全新的设计语言，重量减轻了30%，同时性能提升了50%。\n\n全新的 Vision Pro 2 引入了多项创新功能，包括眼动追踪增强、手势识别升级以及更加流畅的空间音频体验。开发者可以利用新的工具包创建更加丰富的沉浸式应用。\n\n分析师预测，Vision Pro 2 的发布将进一步推动 AR/VR 行业的发展，加速空间计算从概念走向主流消费市场。',
    contentEn: 'Apple officially unveiled the Vision Pro 2 at its annual Worldwide Developers Conference. This next-generation spatial computing device features a new design language, with 30% lighter weight and 50% improved performance.\n\nThe new Vision Pro 2 introduces several innovative features, including enhanced eye tracking, upgraded gesture recognition, and a more immersive spatial audio experience. Developers can create richer immersive applications using new toolkits.\n\nAnalysts predict that the launch of Vision Pro 2 will further drive the development of the AR/VR industry, accelerating spatial computing from concept to mainstream consumer market.',
    category: '科技',
    source: '科技日报',
    publishDate: new Date(Date.now() - 172800000).toISOString(),
    isRead: false,
    isFavorite: true,
    tags: ['Apple', 'Vision Pro', 'AR/VR', '空间计算'],
  },
  {
    id: '5',
    title: '小红书成为品牌种草首选平台',
    titleEn: 'Xiaohongshu Becomes Brand\'s Preferred Grassroots Marketing Platform',
    summary: '凭借真实的用户分享和强大的种草能力，小红书正在成为品牌新品首发和口碑营销的首选平台...',
    summaryEn: 'With authentic user sharing and strong grassroots marketing capabilities, Xiaohongshu is becoming the preferred platform for brand launches and word-of-mouth marketing...',
    content: '作为中国最具影响力的生活方式平台，小红书凭借其独特的内容生态和用户信任度，正在成为品牌种草营销的首选阵地。\n\n数据显示，超过 70% 的消费者在购买决策前会在小红书上搜索相关内容，了解产品评价和使用体验。而小红书的种草内容也被证明对消费者的购买决策有着显著的影响。\n\n越来越多的品牌开始将小红书作为新品首发的重要平台，通过 KOC 种草、品牌账号运营等方式，建立品牌口碑和用户认知。',
    contentEn: 'As China\'s most influential lifestyle platform, Xiaohongshu is becoming the preferred destination for brand grassroots marketing due to its unique content ecosystem and user trust.\n\nData shows that over 70% of consumers search for relevant content on Xiaohongshu before making purchase decisions, to understand product reviews and usage experiences. Xiaohongshu\'s grassroots content has been proven to significantly influence consumer purchasing decisions.\n\nMore and more brands are using Xiaohongshu as an important platform for new product launches, establishing brand reputation and user awareness through KOC marketing and brand account operations.',
    category: '平台',
    source: '新媒体观察',
    publishDate: new Date(Date.now() - 259200000).toISOString(),
    isRead: false,
    isFavorite: false,
    tags: ['小红书', '种草', 'KOC'],
  },
  {
    id: '6',
    title: '特斯拉发布新款 Model Y，续航里程突破 700 公里',
    titleEn: 'Tesla Unveils New Model Y with Over 700km Range',
    summary: '特斯拉在上海超级工厂发布了新款 Model Y，续航里程大幅提升，同时引入多项智能化升级...',
    summaryEn: 'Tesla launched the new Model Y at its Shanghai Gigafactory, with significantly improved range and multiple intelligent upgrades...',
    content: '特斯拉公司正式发布了新款 Model Y 车型。这款备受期待的电动 SUV 在续航里程上实现了重大突破，达到了 700 公里的 CLTC 标准续航。\n\n新款 Model Y 还引入了多项智能化升级，包括全新的智能驾驶辅助系统、升级的中控大屏以及更智能的语音交互功能。车辆的充电速度也得到了提升，充电 10 分钟可增加 200 公里续航。\n\n业内人士认为，新款 Model Y 的发布将进一步巩固特斯拉在电动汽车市场的领先地位，同时推动整个行业的技术进步。',
    contentEn: 'Tesla officially launched the new Model Y. This highly anticipated electric SUV achieved a major breakthrough in range, reaching 700km CLTC standard range.\n\nThe new Model Y also introduces multiple intelligent upgrades, including a new intelligent driving assistance system, upgraded central control screen, and smarter voice interaction. The vehicle\'s charging speed has also been improved, adding 200km of range in 10 minutes of charging.\n\nIndustry insiders believe that the launch of the new Model Y will further consolidate Tesla\'s leading position in the electric vehicle market while driving technological progress across the entire industry.',
    category: '汽车',
    source: '汽车周刊',
    publishDate: new Date(Date.now() - 345600000).toISOString(),
    isRead: false,
    isFavorite: false,
    tags: ['特斯拉', 'Model Y', '电动汽车'],
  },
  {
    id: '7',
    title: '字节跳动推出全新 AI 创作平台，赋能内容创作者',
    titleEn: 'ByteDance Launches New AI Creation Platform for Content Creators',
    summary: '字节跳动正式推出了面向内容创作者的 AI 工具平台，提供从文案生成到视频剪辑的全方位支持...',
    summaryEn: 'ByteDance officially launched an AI tool platform for content creators, providing comprehensive support from copywriting to video editing...',
    content: '字节跳动在创作者大会上宣布推出全新的 AI 创作平台。这个平台整合了字节跳动旗下的多项 AI 技术，为内容创作者提供一站式的智能创作工具。\n\n平台功能包括智能文案生成、AI 图像创作、视频智能剪辑、背景音乐推荐等。创作者可以通过简单的指令，快速生成高质量的内容素材。\n\n据介绍，该平台目前已向部分优质创作者开放测试，预计将在年内全面上线。字节跳动表示，希望通过 AI 技术降低内容创作门槛，激发更多创作活力。',
    contentEn: 'ByteDance announced the launch of a new AI creation platform at its Creator Conference. This platform integrates multiple AI technologies from ByteDance, providing one-stop intelligent creation tools for content creators.\n\nPlatform features include intelligent copywriting, AI image creation, video intelligent editing, background music recommendation, etc. Creators can quickly generate high-quality content materials through simple instructions.\n\nThe platform is currently open to selected high-quality creators for testing, with a full launch expected within the year. ByteDance stated that it hopes to lower the barrier to content creation through AI technology and stimulate more creative vitality.',
    category: '媒体',
    source: '传媒圈',
    publishDate: new Date(Date.now() - 432000000).toISOString(),
    isRead: true,
    isFavorite: false,
    tags: ['字节跳动', 'AI创作', '内容平台'],
  },
  {
    id: '8',
    title: '数据隐私保护新规出台，广告行业如何应对',
    titleEn: 'New Data Privacy Regulations: How Will the Advertising Industry Respond?',
    summary: '数据隐私保护法规的不断完善正在给广告行业带来新的挑战，精准营销面临转型压力...',
    summaryEn: 'The continuous improvement of data privacy regulations is bringing new challenges to the advertising industry, with precision marketing facing transformation pressure...',
    content: '随着数据隐私保护法规的不断完善，广告行业传统的精准营销模式正在面临新的挑战。第三方 Cookie 的逐步淘汰、数据合规要求的提高，都在推动行业寻找新的解决方案。\n\n业内专家认为，第一方数据的运营能力将成为品牌的核心竞争力。通过私域运营、会员体系建设等方式，品牌可以在合规的前提下，更好地理解用户需求，提供个性化的服务。\n\n同时，注重内容质量和用户体验的软性营销方式，也将获得更大的发展空间。',
    contentEn: 'With the continuous improvement of data privacy regulations, the advertising industry\'s traditional precision marketing model is facing new challenges. The gradual elimination of third-party cookies and increased data compliance requirements are driving the industry to find new solutions.\n\nIndustry experts believe that first-party data operation capabilities will become brands\' core competitiveness. Through private domain operations and membership system building, brands can better understand user needs and provide personalized services under compliance.\n\nMeanwhile, soft marketing methods that focus on content quality and user experience will also gain more development space.',
    category: '社会',
    source: '法律观察',
    publishDate: new Date(Date.now() - 518400000).toISOString(),
    isRead: true,
    isFavorite: false,
    tags: ['数据隐私', '合规', '精准营销'],
  },
];

interface NewsState {
  news: NewsItem[];
  selectedCategory: string;
  searchQuery: string;
  lastRefresh: string;
  isRefreshing: boolean;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  toggleRead: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getFilteredNews: () => NewsItem[];
  markAllRead: () => void;
  refresh: () => Promise<void>;
  categories: string[];
  unreadCount: number;
  favoriteCount: number;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  news: initialNews,
  selectedCategory: '全部',
  searchQuery: '',
  lastRefresh: new Date().toISOString(),
  isRefreshing: false,
  categories: ['全部', '科技', 'AI', '媒体', '广告', '营销', '汽车', '社会'],

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleRead: (id) => {
    set((state) => ({
      news: state.news.map((item) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      ),
    }));
  },

  toggleFavorite: (id) => {
    set((state) => ({
      news: state.news.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      ),
    }));
  },

  getFilteredNews: () => {
    const { news, selectedCategory, searchQuery } = get();
    const lower = searchQuery.toLowerCase();
    return news.filter((item) => {
      if (selectedCategory !== '全部' && item.category !== selectedCategory) return false;
      if (searchQuery && !item.title.toLowerCase().includes(lower) && !item.summary.toLowerCase().includes(lower)) {
        return false;
      }
      return true;
    });
  },

  markAllRead: () => {
    set((state) => ({
      news: state.news.map((item) => ({ ...item, isRead: true })),
    }));
  },

  refresh: async () => {
    set({ isRefreshing: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isRefreshing: false, lastRefresh: new Date().toISOString() });
  },

  get unreadCount() {
    return get().news.filter((item) => !item.isRead).length;
  },

  get favoriteCount() {
    return get().news.filter((item) => item.isFavorite).length;
  },
}));
