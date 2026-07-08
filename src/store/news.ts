import { create } from 'zustand';
import type { NewsItem } from '@/types';

const initialNews: NewsItem[] = [
  {
    id: '1',
    title: '广告门独家：品牌短视频投放ROI提升指南',
    titleEn: 'AdDoor Exclusive: Guide to Improving Brand Short Video Ad ROI',
    summary: '广告门发布最新研究报告，深度解析短视频广告投放的优化策略，帮助品牌提升投放效率和转化率...',
    summaryEn: 'AdDoor releases the latest research report, deeply analyzing optimization strategies for short video advertising to help brands improve delivery efficiency and conversion rates...',
    content: '广告门研究院发布了《2026年品牌短视频投放ROI提升指南》。报告基于对1000+品牌广告投放数据的深度分析，总结了提升短视频广告效果的核心策略。\n\n报告指出，优质原生内容、精准人群定向、数据分析优化是提升ROI的三大关键要素。其中，原生内容的用户接受度比硬广高出3倍以上。\n\n报告还提供了详细的投放流程优化建议，包括素材测试、投放节奏把控、数据监控等实操技巧，为品牌方提供了全面的参考框架。',
    contentEn: 'AdDoor Research Institute released the "2026 Guide to Improving Brand Short Video Ad ROI". Based on in-depth analysis of over 1000 brand ad delivery data, the report summarizes core strategies for improving short video ad effectiveness.\n\nThe report points out that high-quality native content, precise audience targeting, and data analysis optimization are the three key factors for improving ROI. Among them, user acceptance of native content is more than 3 times higher than that of hard ads.\n\nThe report also provides detailed suggestions for optimizing the delivery process, including material testing, delivery rhythm control, data monitoring and other practical tips, providing a comprehensive reference framework for brands.',
    category: '广告',
    source: '广告门',
    publishDate: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    isFavorite: false,
    tags: ['广告门', '短视频', 'ROI', '投放优化'],
  },
  {
    id: '2',
    title: '麦迪逊邦：AI创意工具重塑广告行业格局',
    titleEn: 'MadisonBoom: AI Creative Tools Reshape Advertising Industry Landscape',
    summary: '麦迪逊邦深度分析AI创意工具对广告行业的影响，探讨人机协同创作的未来趋势...',
    summaryEn: 'MadisonBoom deeply analyzes the impact of AI creative tools on the advertising industry and explores the future trends of human-machine collaborative creation...',
    content: '麦迪逊邦最新发布的《AI创意工具行业调研报告》显示，人工智能正在深刻改变广告创意的生产方式。调研覆盖了全国200+家广告公司，描绘了AI工具应用的全景图。\n\n数据显示，超过60%的创意团队已经在使用AI工具辅助创作，其中AI文案生成的使用率最高，达到了85%。而AI图像生成和视频制作工具的使用增长率最快，同比增长超过200%。\n\n报告强调，AI不是取代创意人，而是赋能创意人。未来的创意工作将是人机协同的新模式，创意人需要学会与AI工具协作，发挥各自的优势。',
    contentEn: 'MadisonBoom\'s latest "AI Creative Tools Industry Research Report" shows that artificial intelligence is profoundly changing the production methods of advertising creativity. The research covers over 200 advertising companies nationwide, depicting a panoramic view of AI tool applications.\n\nData shows that over 60% of creative teams are already using AI tools to assist creation, with AI copywriting generation having the highest usage rate at 85%. AI image generation and video production tools have the fastest growth rate, increasing by over 200% year-on-year.\n\nThe report emphasizes that AI is not replacing creatives, but empowering them. Future creative work will be a new model of human-machine collaboration, and creatives need to learn to collaborate with AI tools and leverage their respective strengths.',
    category: 'AI',
    source: '麦迪逊邦',
    publishDate: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
    isFavorite: true,
    tags: ['麦迪逊邦', 'AI创意', '人机协同', '广告行业'],
  },
  {
    id: '3',
    title: 'SocialBeta：2026年品牌社媒营销趋势预测',
    titleEn: 'SocialBeta: 2026 Brand Social Media Marketing Trend Forecast',
    summary: 'SocialBeta发布年度趋势报告，预测2026年社媒营销的六大核心趋势，为品牌营销规划提供参考...',
    summaryEn: 'SocialBeta releases the annual trend report, forecasting six core trends for social media marketing in 2026 to provide reference for brand marketing planning...',
    content: 'SocialBeta基于对2025年社媒营销数据的深度分析，发布了《2026年品牌社媒营销趋势预测报告》，预测了六大核心趋势。\n\n趋势一：内容即服务，品牌需要提供更实用的内容价值；趋势二：短视频长视频融合，内容形式更加多元化；趋势三：私域运营精细化，从流量运营转向用户运营；趋势四：AI驱动的个性化营销；趋势五：ESG营销成为标配；趋势六：跨平台整合营销。\n\n报告还指出，2026年社媒营销的竞争将更加激烈，品牌需要具备更强的内容创造力、数据分析能力和用户运营能力。',
    contentEn: 'Based on in-depth analysis of 2025 social media marketing data, SocialBeta released the "2026 Brand Social Media Marketing Trend Forecast Report", predicting six core trends.\n\nTrend 1: Content as service, brands need to provide more practical content value; Trend 2: Short video and long video integration, more diversified content forms; Trend 3: Refined private domain operations, shifting from traffic operations to user operations; Trend 4: AI-driven personalized marketing; Trend 5: ESG marketing becomes standard; Trend 6: Cross-platform integrated marketing.\n\nThe report also points out that social media marketing competition will be more intense in 2026, and brands need to have stronger content creativity, data analysis capabilities, and user operation capabilities.',
    category: '营销',
    source: 'SocialBeta',
    publishDate: new Date(Date.now() - 14400000).toISOString(),
    isRead: false,
    isFavorite: false,
    tags: ['SocialBeta', '社媒营销', '趋势预测', '品牌营销'],
  },
  {
    id: '4',
    title: '广告门：直播带货新玩法——品牌自播崛起',
    titleEn: 'AdDoor: New Live Streaming Trends - Brand Self-Broadcasting Rising',
    summary: '广告门观察到品牌自播正在成为直播带货的主流模式，探讨品牌如何构建可持续的自播体系...',
    summaryEn: 'AdDoor observes that brand self-broadcasting is becoming the mainstream model for live streaming sales, exploring how brands can build sustainable self-broadcasting systems...',
    content: '广告门最新行业观察显示，品牌自播正在取代达人带货，成为直播电商的主流模式。数据显示，2025年品牌自播的GMV占比已经超过50%，并且保持着快速增长的趋势。\n\n品牌自播的优势在于可以更好地控制品牌形象、降低营销成本、积累私域用户。但同时也面临着人才短缺、内容同质化等挑战。\n\n报告建议品牌从团队建设、内容规划、数据分析三个维度入手，构建可持续的自播运营体系。',
    contentEn: 'AdDoor\'s latest industry observation shows that brand self-broadcasting is replacing influencer sales and becoming the mainstream model for live e-commerce. Data shows that brand self-broadcasting accounted for over 50% of GMV in 2025 and continues to grow rapidly.\n\nThe advantages of brand self-broadcasting include better control of brand image, lower marketing costs, and accumulation of private domain users. However, it also faces challenges such as talent shortage and content homogenization.\n\nThe report recommends that brands start from three dimensions: team building, content planning, and data analysis, to build a sustainable self-broadcasting operation system.',
    category: '营销',
    source: '广告门',
    publishDate: new Date(Date.now() - 28800000).toISOString(),
    isRead: false,
    isFavorite: false,
    tags: ['广告门', '品牌自播', '直播带货', '私域运营'],
  },
  {
    id: '5',
    title: '麦迪逊邦：程序化广告购买的未来之路',
    titleEn: 'MadisonBoom: The Future of Programmatic Ad Buying',
    summary: '麦迪逊邦探讨程序化广告购买的发展趋势，分析AI技术如何提升程序化投放的精准度和效率...',
    summaryEn: 'MadisonBoom explores the development trends of programmatic ad buying and analyzes how AI technology improves the precision and efficiency of programmatic delivery...',
    content: '麦迪逊邦发布《程序化广告购买白皮书》，深入探讨程序化广告的未来发展方向。白皮书指出，程序化广告正在从"买量"向"买效果"转变。\n\nAI技术的应用是推动这一转变的核心动力。机器学习算法可以实时分析用户行为，优化投放策略，实现更精准的人群定向和出价决策。\n\n白皮书还分析了程序化广告面临的挑战，包括数据隐私保护、投放透明度、效果归因等问题，并提出了相应的解决方案。',
    contentEn: 'MadisonBoom released the "Programmatic Ad Buying White Paper", deeply exploring the future development direction of programmatic advertising. The white paper points out that programmatic advertising is shifting from "buying volume" to "buying results".\n\nThe application of AI technology is the core driving force behind this transformation. Machine learning algorithms can analyze user behavior in real-time, optimize delivery strategies, and achieve more precise audience targeting and bidding decisions.\n\nThe white paper also analyzes the challenges faced by programmatic advertising, including data privacy protection, delivery transparency, and performance attribution, and proposes corresponding solutions.',
    category: '广告',
    source: '麦迪逊邦',
    publishDate: new Date(Date.now() - 43200000).toISOString(),
    isRead: true,
    isFavorite: false,
    tags: ['麦迪逊邦', '程序化广告', 'AI技术', '精准投放'],
  },
  {
    id: '6',
    title: 'SocialBeta精选：2026年最值得关注的50个营销案例',
    titleEn: 'SocialBeta Selection: 50 Most Notable Marketing Cases in 2026',
    summary: 'SocialBeta精选2026年上半年最具影响力的营销案例，涵盖品牌传播、产品推广、用户运营等多个领域...',
    summaryEn: 'SocialBeta selects the most influential marketing cases in the first half of 2026, covering brand communication, product promotion, user operation and other fields...',
    content: 'SocialBeta推出《2026年度营销案例精选》，收录了50个最具影响力和创新性的营销案例。这些案例涵盖了快消、美妆、汽车、科技等多个行业。\n\n精选案例展示了营销领域的最新趋势：情感营销依然有效，互动体验成为新宠，AI技术广泛应用，私域运营持续深化。\n\n每个案例都包含背景分析、策略解读、执行过程和效果评估，为营销从业者提供了宝贵的参考素材和灵感来源。',
    contentEn: 'SocialBeta launched "2026 Annual Marketing Case Selection", featuring 50 of the most influential and innovative marketing cases. These cases cover FMCG, beauty, automotive, technology and other industries.\n\nThe selected cases showcase the latest trends in marketing: emotional marketing is still effective, interactive experience has become popular, AI technology is widely applied, and private domain operations continue to deepen.\n\nEach case includes background analysis, strategy interpretation, execution process and effect evaluation, providing valuable reference materials and inspiration for marketing practitioners.',
    category: '营销',
    source: 'SocialBeta',
    publishDate: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    isFavorite: true,
    tags: ['SocialBeta', '营销案例', '品牌传播', '创新营销'],
  },
  {
    id: '7',
    title: '广告门：元宇宙营销从概念到落地',
    titleEn: 'AdDoor: Metaverse Marketing from Concept to Implementation',
    summary: '广告门深度报道元宇宙营销的最新进展，探讨品牌如何在虚拟空间中构建沉浸式营销体验...',
    summaryEn: 'AdDoor deeply reports on the latest developments in metaverse marketing, exploring how brands can build immersive marketing experiences in virtual spaces...',
    content: '广告门发布《元宇宙营销实践指南》，系统梳理了元宇宙营销的发展现状和实践路径。报告指出，元宇宙营销正在从概念走向落地，越来越多的品牌开始探索虚拟空间的营销机会。\n\n目前元宇宙营销的主要形式包括虚拟产品发布、虚拟代言人、虚拟空间互动体验等。这些创新营销方式为品牌带来了新的用户触点和互动方式。\n\n报告提醒品牌，元宇宙营销需要结合自身特点，找到合适的切入点，避免盲目跟风。同时，需要关注用户体验和数据安全等问题。',
    contentEn: 'AdDoor released the "Metaverse Marketing Practice Guide", systematically reviewing the development status and practice paths of metaverse marketing. The report points out that metaverse marketing is moving from concept to implementation, with more and more brands exploring marketing opportunities in virtual spaces.\n\nCurrent forms of metaverse marketing include virtual product launches, virtual spokespersons, and virtual space interactive experiences. These innovative marketing methods bring new user touchpoints and interaction methods for brands.\n\nThe report reminds brands that metaverse marketing needs to be combined with their own characteristics to find appropriate entry points and avoid blindly following trends. At the same time, attention should be paid to user experience and data security.',
    category: '科技',
    source: '广告门',
    publishDate: new Date(Date.now() - 172800000).toISOString(),
    isRead: false,
    isFavorite: false,
    tags: ['广告门', '元宇宙', '虚拟营销', '沉浸式体验'],
  },
  {
    id: '8',
    title: '麦迪逊邦：Z世代消费洞察与品牌营销启示',
    titleEn: 'MadisonBoom: Generation Z Consumer Insights and Brand Marketing Implications',
    summary: '麦迪逊邦深入研究Z世代的消费特征和价值观念，为品牌营销提供针对性策略建议...',
    summaryEn: 'MadisonBoom deeply studies Generation Z\'s consumption characteristics and values, providing targeted strategic suggestions for brand marketing...',
    content: '麦迪逊邦联合知名调研机构发布《Z世代消费行为与品牌偏好调研报告》。报告基于对5000+Z世代消费者的问卷调查，揭示了这一群体独特的消费特征。\n\n调研发现，Z世代更加注重品牌价值观、产品体验和社交属性。他们喜欢通过社交媒体获取产品信息，信任KOC的真实分享。同时，他们对价格敏感但愿意为品质和体验付费。\n\n报告为品牌提供了针对性的营销策略建议，包括品牌价值观建设、内容营销优化、社交电商布局等。',
    contentEn: 'MadisonBoom, in collaboration with a well-known research institute, released the "Generation Z Consumption Behavior and Brand Preference Research Report". Based on a questionnaire survey of over 5000 Gen Z consumers, the report reveals this group\'s unique consumption characteristics.\n\nThe research found that Gen Z pays more attention to brand values, product experience, and social attributes. They prefer to obtain product information through social media and trust KOC\'s authentic sharing. At the same time, they are price-sensitive but willing to pay for quality and experience.\n\nThe report provides targeted marketing strategy suggestions for brands, including brand value construction, content marketing optimization, and social e-commerce layout.',
    category: '社会',
    source: '麦迪逊邦',
    publishDate: new Date(Date.now() - 259200000).toISOString(),
    isRead: false,
    isFavorite: true,
    tags: ['麦迪逊邦', 'Z世代', '消费洞察', '品牌策略'],
  },
  {
    id: '9',
    title: 'SocialBeta：小红书品牌营销全攻略',
    titleEn: 'SocialBeta: Complete Guide to Xiaohongshu Brand Marketing',
    summary: 'SocialBeta发布小红书品牌营销实操指南，涵盖内容创作、达人合作、话题运营等核心策略...',
    summaryEn: 'SocialBeta releases a practical guide to Xiaohongshu brand marketing, covering core strategies including content creation, influencer collaboration, and topic operation...',
    content: 'SocialBeta推出《小红书品牌营销实战手册》，为品牌提供全面的小红书营销解决方案。手册涵盖了从账号定位、内容规划到达人合作、数据优化的全流程。\n\n手册指出，小红书营销的核心在于"种草"，需要通过优质内容建立用户信任。关键成功因素包括：真实的产品体验分享、专业的内容创作、精准的人群匹配、持续的运营投入。\n\n手册还提供了详细的KPI体系和数据分析方法，帮助品牌衡量营销效果，优化投放策略。',
    contentEn: 'SocialBeta launched the "Xiaohongshu Brand Marketing Practical Handbook", providing brands with comprehensive Xiaohongshu marketing solutions. The handbook covers the entire process from account positioning and content planning to influencer collaboration and data optimization.\n\nThe handbook points out that the core of Xiaohongshu marketing lies in "grassroots planting", which requires building user trust through high-quality content. Key success factors include: authentic product experience sharing, professional content creation, precise audience matching, and continuous operational investment.\n\nThe handbook also provides detailed KPI systems and data analysis methods to help brands measure marketing effectiveness and optimize delivery strategies.',
    category: '平台',
    source: 'SocialBeta',
    publishDate: new Date(Date.now() - 345600000).toISOString(),
    isRead: false,
    isFavorite: false,
    tags: ['SocialBeta', '小红书', '种草营销', 'KOL合作'],
  },
  {
    id: '10',
    title: '广告门：品牌出海数字营销策略',
    titleEn: 'AdDoor: Brand Overseas Digital Marketing Strategy',
    summary: '广告门探讨品牌出海的数字营销策略，分析不同目标市场的特点和投放要点...',
    summaryEn: 'AdDoor explores digital marketing strategies for brand overseas expansion, analyzing the characteristics and delivery key points of different target markets...',
    content: '广告门发布《品牌出海数字营销白皮书》，为中国品牌出海提供全面的策略指导。白皮书分析了东南亚、欧美、中东等主要目标市场的数字营销环境和用户特点。\n\n报告指出，品牌出海需要因地制宜，根据不同市场的特点制定差异化策略。例如，东南亚市场社交媒体渗透率高，适合短视频和直播营销；欧美市场注重品牌故事和内容营销；中东市场则有独特的文化和消费习惯。\n\n白皮书还提供了出海营销的实操建议，包括平台选择、内容本地化、合规运营等方面。',
    contentEn: 'AdDoor released the "Brand Overseas Digital Marketing White Paper", providing comprehensive strategic guidance for Chinese brands going overseas. The white paper analyzes the digital marketing environment and user characteristics of major target markets such as Southeast Asia, Europe, America, and the Middle East.\n\nThe report points out that brand overseas expansion needs to be adapted to local conditions, with differentiated strategies formulated based on the characteristics of different markets. For example, Southeast Asian markets have high social media penetration, suitable for short video and live streaming marketing; European and American markets focus on brand storytelling and content marketing; Middle Eastern markets have unique cultural and consumption habits.\n\nThe white paper also provides practical suggestions for overseas marketing, including platform selection, content localization, and compliance operations.',
    category: '营销',
    source: '广告门',
    publishDate: new Date(Date.now() - 432000000).toISOString(),
    isRead: true,
    isFavorite: false,
    tags: ['广告门', '品牌出海', '数字营销', '国际化'],
  },
  {
    id: '11',
    title: '麦迪逊邦：私域流量运营的底层逻辑与实战方法',
    titleEn: 'MadisonBoom: Underlying Logic and Practical Methods of Private Domain Traffic Operations',
    summary: '麦迪逊邦深度解析私域流量运营的核心逻辑，分享成功品牌的实战经验和方法论...',
    summaryEn: 'MadisonBoom deeply analyzes the core logic of private domain traffic operations and shares the practical experience and methodology of successful brands...',
    content: '麦迪逊邦发布《私域流量运营实战指南》，系统梳理私域流量运营的底层逻辑和实战方法。指南指出，私域运营的本质是用户关系管理，需要建立长期信任和价值输出。\n\n成功的私域运营需要具备三个核心能力：用户获取能力、用户运营能力和商业转化能力。具体包括：精准获客、分层运营、内容运营、社群管理、数据驱动等关键环节。\n\n指南还分享了多个成功案例的实操经验，为品牌提供了可借鉴的运营框架和方法体系。',
    contentEn: 'MadisonBoom released the "Private Domain Traffic Operation Practical Guide", systematically reviewing the underlying logic and practical methods of private domain traffic operations. The guide points out that the essence of private domain operations is user relationship management, which requires establishing long-term trust and value output.\n\nSuccessful private domain operations require three core capabilities: user acquisition capability, user operation capability, and commercial conversion capability. Specifically including: precise customer acquisition, layered operations, content operations, community management, data-driven and other key links.\n\nThe guide also shares practical experiences of multiple successful cases, providing brands with referenceable operation frameworks and methodology systems.',
    category: '营销',
    source: '麦迪逊邦',
    publishDate: new Date(Date.now() - 518400000).toISOString(),
    isRead: true,
    isFavorite: false,
    tags: ['麦迪逊邦', '私域流量', '用户运营', '社群管理'],
  },
  {
    id: '12',
    title: 'SocialBeta：AI客服重塑品牌用户体验',
    titleEn: 'SocialBeta: AI Customer Service Reshaping Brand User Experience',
    summary: 'SocialBeta探讨AI客服技术的发展趋势，分析智能客服如何提升品牌服务效率和用户满意度...',
    summaryEn: 'SocialBeta explores the development trends of AI customer service technology and analyzes how intelligent customer service improves brand service efficiency and user satisfaction...',
    content: 'SocialBeta发布《AI客服行业应用报告》，分析人工智能技术在客服领域的应用现状和发展趋势。报告显示，AI客服正在从简单的问答机器人向智能化服务助手演进。\n\n智能客服的应用场景包括：智能问答、个性化推荐、订单处理、售后服务等。数据显示，AI客服可以处理70%以上的常规咨询，大幅提升服务效率。\n\n报告指出，AI客服不是取代人工客服，而是与人工客服形成互补。未来的客服模式将是人机协同，AI负责高效处理常规问题，人工负责复杂问题和情感沟通。',
    contentEn: 'SocialBeta released the "AI Customer Service Industry Application Report", analyzing the application status and development trends of artificial intelligence technology in the customer service field. The report shows that AI customer service is evolving from simple Q&A robots to intelligent service assistants.\n\nApplication scenarios of intelligent customer service include: intelligent Q&A, personalized recommendation, order processing, after-sales service, etc. Data shows that AI customer service can handle over 70% of routine inquiries, significantly improving service efficiency.\n\nThe report points out that AI customer service is not replacing human customer service, but complementing it. The future customer service model will be human-machine collaboration, with AI efficiently handling routine issues and humans handling complex issues and emotional communication.',
    category: 'AI',
    source: 'SocialBeta',
    publishDate: new Date(Date.now() - 604800000).toISOString(),
    isRead: true,
    isFavorite: false,
    tags: ['SocialBeta', 'AI客服', '用户体验', '智能服务'],
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
