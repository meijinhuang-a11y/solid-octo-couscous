import { AI_MODELS } from '@/store/aiAssistant';

const modelResponses: Record<string, string[]> = {
  doubao: [
    '【示例响应】根据你的需求，我建议从以下几个方面考虑：首先明确目标受众，然后选择合适的平台进行投放。',
    '【示例响应】这是一个很好的问题！从数据分析的角度来看，你可以尝试优化关键词布局，提升内容的相关性。',
    '【示例响应】我来帮你分析一下：当前的市场趋势显示，短视频内容仍然是增长最快的领域，建议加大投入。',
    '【示例响应】针对你提到的情况，我的建议是进行 A/B 测试，通过数据对比找到最优方案。',
    '【示例响应】从行业经验来看，这种做法是可行的，但需要注意以下几点：合规性、用户体验和长期价值。',
  ],
  gpt4: [
    '[Demo] Based on my analysis, here are three actionable strategies you can implement immediately...',
    '[Demo] That is an interesting challenge. Let me break it down into manageable steps for you.',
    '[Demo] From a strategic perspective, I recommend focusing on user retention rather than acquisition at this stage.',
    '[Demo] Here is a structured approach to solve this problem: First, audit your current workflow...',
    '[Demo] Consider leveraging automation tools to streamline this process and reduce manual overhead.',
  ],
  claude: [
    '[Demo] I appreciate you sharing this context. Let me provide a thoughtful analysis of your situation.',
    '[Demo] There are several nuanced factors to consider here. Let me walk through each one carefully.',
    '[Demo] From an ethical and practical standpoint, I would suggest the following approach...',
    '[Demo] This is a complex problem with multiple valid solutions. Let me outline the trade-offs...',
    '[Demo] Based on the information provided, here is my detailed recommendation with reasoning...',
  ],
  qwen: [
    '【示例响应】根据阿里巴巴的最佳实践，我建议采用以下策略来优化你的业务流程...',
    '【示例响应】这个问题涉及到多个维度，让我从数据驱动角度来为你分析...',
    '【示例响应】结合当前电商行业的发展趋势，我的建议是重点关注私域流量运营...',
    '【示例响应】从技术实现的角度，你可以考虑使用微服务架构来提升系统的可扩展性...',
    '【示例响应】针对你的场景，我推荐先进行小规模试点，验证效果后再全面推广...',
  ],
  kimi: [
    '【示例响应】让我来详细分析一下这个问题。首先，我们需要理解核心诉求是什么...',
    '【示例响应】从长文本处理的角度，我建议你整理一份完整的背景资料，这样我能给出更精准的建议。',
    '【示例响应】这是一个系统性问题，需要从战略层面和战术层面分别制定方案...',
    '【示例响应】考虑到你的业务特点，我建议采用渐进式优化的策略，分阶段实施...',
    '【示例响应】让我为你梳理一下思路：明确目标 → 分析现状 → 制定方案 → 执行验证 → 持续优化。',
  ],
};

const contextualResponses: Record<string, Record<string, string[]>> = {
  photo: {
    doubao: ['【示例响应】关于照片优化，我建议调整滤镜参数中的色温和对比度，这样能让画面更有质感。', '【示例响应】你可以尝试使用 AI 生成功能，批量产出多个版本进行对比选择。'],
    gpt4: ['[Demo] For photo enhancement, consider adjusting the white balance and saturation levels to achieve a more natural look.', '[Demo] Try using the batch generation feature to create multiple variants for comparison.'],
    claude: ['[Demo] When optimizing photos, pay attention to the lighting conditions and how they affect the overall mood of the image.', '[Demo] The batch generation tool can help you explore different creative directions efficiently.'],
    qwen: ['【示例响应】照片优化关键在于色彩管理和构图调整，建议先用自动增强功能快速预览效果。', '【示例响应】批量生成是提高效率的好方法，可以一次产出多版供客户选择。'],
    kimi: ['【示例响应】让我帮你分析这张照片的优化空间：曝光、色彩、锐度都有提升潜力。', '【示例响应】使用批量生成功能时，建议设置不同的风格参数，覆盖更多用户偏好。'],
  },
  copywriting: {
    doubao: ['【示例响应】文案创作要抓住用户痛点，开头前三秒是关键，建议用疑问句或数据吸引眼球。', '【示例响应】多生成几个版本进行对比测试，数据会告诉你哪个标题点击率更高。'],
    gpt4: ['[Demo] Effective copywriting starts with understanding your audience\'s pain points. Lead with a compelling hook.', '[Demo] A/B test different headlines to determine which resonates best with your target demographic.'],
    claude: ['[Demo] Good copy should speak directly to the reader\'s aspirations and fears. Authenticity builds trust.', '[Demo] Consider generating multiple variants and testing them with a small audience before full deployment.'],
    qwen: ['【示例响应】文案优化要注意平台特性，小红书的种草风格和抖音的短视频文案差异很大。', '【示例响应】建议用数据说话，在标题中加入具体数字能显著提升打开率。'],
    kimi: ['【示例响应】让我帮你优化这段文案：核心信息要前置，让用户一眼看到价值主张。', '【示例响应】生成多版文案时，可以针对不同的用户画像定制差异化内容。'],
  },
  video: {
    doubao: ['【示例响应】视频优化建议关注前3秒的钩子设计，这决定了用户的完播率。', '【示例响应】平台算法更青睐完播率高的内容，所以开头一定要足够吸引人。'],
    gpt4: ['[Demo] Video optimization is all about the first 3 seconds. Your hook determines whether viewers stay or scroll away.', '[Demo] Platform algorithms prioritize completion rate, so structure your content to maintain engagement throughout.'],
    claude: ['[Demo] The most successful videos have one thing in common: they deliver value immediately. Don\'t make viewers wait.', '[Demo] Consider the platform-specific requirements when optimizing aspect ratios and durations.'],
    qwen: ['【示例响应】视频内容优化的核心是前3秒的吸引力，建议用悬念或冲突来抓住注意力。', '【示例响应】不同平台的视频规格不同，记得根据目标平台调整输出参数。'],
    kimi: ['【示例响应】让我分析这个视频的优化点：节奏把控、视觉冲击力、信息密度都需要平衡。', '【示例响应】批量生成视频版本时，可以尝试不同的剪辑节奏和音乐搭配。'],
  },
  news: {
    doubao: ['【示例响应】这条新闻的核心看点是行业趋势变化，建议重点关注其中的数据洞察。', '【示例响应】从营销角度，这类科技新闻可以用来做内容选题，借势传播。'],
    gpt4: ['[Demo] This news highlights an important industry shift. The data points mentioned are particularly noteworthy for strategic planning.', '[Demo] From a marketing perspective, trending tech news can be leveraged for timely content creation.'],
    claude: ['[Demo] The key insight from this news is the changing competitive landscape. Organizations should adapt their strategies accordingly.', '[Demo] News monitoring helps identify emerging opportunities and potential risks early.'],
    qwen: ['【示例响应】这条行业新闻透露了重要的市场信号，建议结合你的业务场景进行分析。', '【示例响应】日报内容可以作为团队晨会素材，帮助团队快速了解行业动态。'],
    kimi: ['【示例响应】让我帮你提炼这条新闻的要点：核心事件、影响范围、对行业的长期意义。', '【示例响应】这类新闻适合作为内容营销的素材，但要注意时效性和角度选择。'],
  },
  default: {
    doubao: ['【示例响应】我来帮你分析一下当前页面的内容...', '【示例响应】根据页面信息，我的建议如下：'],
    gpt4: ['[Demo] Let me analyze the current page content for you...', '[Demo] Based on what I see, here are my recommendations:'],
    claude: ['[Demo] I will examine the content on this page and provide my analysis...', '[Demo] Here is what I observe and my thoughtful recommendations:'],
    qwen: ['【示例响应】让我分析一下当前页面的情况...', '【示例响应】基于页面内容，我的建议如下：'],
    kimi: ['【示例响应】我来帮你梳理当前页面的关键信息...', '【示例响应】根据页面内容分析，这是我的建议：'],
  },
};

export async function askAI(question: string, modelId: string, pageContext?: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

  const model = AI_MODELS.find((m) => m.id === modelId);
  if (!model) return '模型不存在';

  const context = pageContext || 'default';
  const contextResponses = contextualResponses[context]?.[modelId] || modelResponses[modelId];

  if (question.includes('?') || question.includes('？') || question.includes('怎么') || question.includes('如何') || question.includes('建议')) {
    const randomIndex = Math.floor(Math.random() * contextResponses.length);
    return contextResponses[randomIndex];
  }

  const generalResponses = modelResponses[modelId];
  const randomIndex = Math.floor(Math.random() * generalResponses.length);
  return generalResponses[randomIndex];
}
