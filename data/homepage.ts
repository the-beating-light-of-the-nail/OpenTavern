export interface HomeLinkItem {
  title: string;
  desc: string;
  to: string;
  cta: string;
}

export interface HomeCardSite {
  name: string;
  desc: string;
  note: string;
}

export interface HomeGlossaryItem {
  term: string;
  def: string;
}

export interface HomeFaqItem {
  q: string;
  a: string;
}

export interface HomeContent {
  seo: { title: string; description: string; ogTitle: string; ogDescription: string };
  badge: string;
  h1: string;
  subtitle: string;
  intro: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trust: string;
  chooseTitle: string;
  chooseDesc: string;
  choose: HomeLinkItem[];
  chatTitle: string;
  chatDesc: string;
  chatNote: string;
  chatPlaceholder: string;
  chatCta: string;
  cloudTitle: string;
  cloudDesc: string;
  cloudCriteria: { title: string; desc: string }[];
  cloudNote: string;
  cloudCta: string;
  cardsTitle: string;
  cardsDesc: string;
  cards: HomeCardSite[];
  cardsCta: string;
  guidesTitle: string;
  guidesDesc: string;
  guidesCta: string;
  toolsTitle: string;
  toolsDesc: string;
  toolsCta: string;
  glossaryTitle: string;
  glossaryDesc: string;
  glossary: HomeGlossaryItem[];
  faqTitle: string;
  faq: HomeFaqItem[];
  aboutTitle: string;
  aboutDesc: string;
  aboutPoints: string[];
  aboutCta: string;
  updated: string;
}

export const HOME_CONTENT: Record<'zh-CN' | 'en', HomeContent> = {
  'zh-CN': {
    seo: {
      title: '酒馆AI中文站｜直接开聊、SillyTavern教程与云酒馆',
      description:
        '酒馆AI 中文站：不用安装，选个角色就能聊；也可对比云酒馆、角色卡网站，或看 SillyTavern 安装、API、世界书教程。每周实测更新。',
      ogTitle: '酒馆AI中文站｜直接开聊、SillyTavern教程与云酒馆',
      ogDescription: '不用安装，选个角色就能聊；也可对比云酒馆、角色卡网站，或看 SillyTavern 中文教程。每周实测更新。',
    },
    badge: '酒馆AI 中文站 · 每周实测',
    h1: '酒馆AI：直接开聊，或从 0 学会 SillyTavern',
    subtitle:
      '不用安装，选个角色就能聊；想自己搭，也有 Windows / macOS / Android 安装、API 配置、角色卡和世界书教程。',
    intro:
      '酒馆AI 是给中文玩家用的 AI 角色扮演入口：打开网页就能和原创角色聊天，也可以从零学 SillyTavern 的安装、API、角色卡和世界书。下面把「直接玩」和「自己搭」两条路分开，按你手上的时间选。',
    ctaPrimary: '直接开聊',
    ctaSecondary: '看本地部署教程',
    trust: '免安装 · 免登录 · 可自带 API Key · 每周更新',
    chooseTitle: '你现在想怎么玩？',
    chooseDesc: '三条路，按投入时间选。',
    choose: [
      { title: '直接开聊', desc: '不想装软件、不想配环境，选个角色就能开始。', to: '/ai-chat/', cta: '去开聊' },
      { title: '找云酒馆', desc: '先看免费额度、隐私和中文支持，再决定用哪家。', to: '/cloud-taverns/', cta: '看实测榜' },
      { title: '本地部署', desc: '自己掌控模型、角色卡和世界书，数据留在本机。', to: '/wiki/local-deploy/', cta: '看部署教程' },
    ],
    chatTitle: '直接开聊：不用安装，选个角色就能开始',
    chatDesc:
      '6 个原创角色，点开就能聊。聊天记录默认只存在你的浏览器里；使用自带 API Key 时，消息直接从你的设备发往你配置的模型服务商。',
    chatNote: '免登录 · 可自带 API Key · 聊天记录存本地',
    chatPlaceholder: '输入你想聊的设定，或直接选一个角色…',
    chatCta: '开始聊天',
    cloudTitle: '云酒馆实测：免费、免登录、支持中文',
    cloudDesc:
      '云酒馆的价值不是「能聊」，而是省掉安装和配置。我们按价格、隐私、中文支持、内容边界四项逐家实测，并把最后验证日期写进榜单。',
    cloudCriteria: [
      { title: '价格', desc: '免费额度、订阅价格、是否有隐藏限制。' },
      { title: '隐私', desc: '是否留存对话、是否用于训练、能否导出。' },
      { title: '中文', desc: '界面、角色卡、世界书是否完整支持中文。' },
      { title: '内容边界', desc: '是否有明确开关、边界说明和年龄限制。' },
    ],
    cloudNote: '6 家正在复核，完整榜单与最后验证日期整理中。',
    cloudCta: '看完整实测榜',
    cardsTitle: '角色卡网站：8 个可用站点，标注最后验证',
    cardsDesc:
      '先看 6 个最常用的；完整清单、许可证和最后验证日期在角色卡站页面。下载前请确认站点条款和角色卡作者许可。',
    cards: [
      { name: 'Chatbots Webring', desc: '从多个平台汇聚的角色卡合集。', note: '合集' },
      { name: 'AICharacterCards.com', desc: '大量 SillyTavern 角色卡，附带新手向使用指南和随机抽卡。', note: '角色卡 + 指南' },
      { name: 'Character Tavern', desc: '来自 SillyTavern 社区的角色卡合集。', note: '社区合集' },
      { name: 'realm.risuai.net', desc: '来自 RisuAI 的角色卡合集。', note: 'RisuAI' },
      { name: 'Janny AI', desc: '来自 Janitor AI 的角色卡合集。', note: 'Janitor AI' },
      { name: 'BotBooru', desc: '从多个网站汇聚的角色卡，附带设定集（lorebooks）。', note: '角色卡 + 世界书' },
    ],
    cardsCta: '看完整角色卡站清单',
    guidesTitle: 'SillyTavern 中文教程：安装、部署、API、世界书',
    guidesDesc: '从第一次启动到长期使用，按顺序看这 6 篇。每篇都标注适用平台和最后更新时间。',
    guidesCta: '看全部教程',
    toolsTitle: '酒馆工具：角色卡编辑、世界书校验、预设对比',
    toolsDesc: '全部在浏览器本地运行，不上传你的文件。角色卡、世界书和预设都能在导出前先检查一遍。',
    toolsCta: '打开工具库',
    glossaryTitle: '酒馆术语：角色卡、世界书、预设、Token',
    glossaryDesc: '8 个词，先看懂再上手。',
    glossary: [
      { term: '角色卡', def: '定义角色人设、开场白和示例对话的文件，常见格式是 JSON 或 PNG。' },
      { term: '世界书', def: '按关键词触发的背景设定集合，用来补全世界观、地点和人物关系。' },
      { term: '预设', def: '一组采样参数和提示词模板，决定模型的说话风格、长度和稳定性。' },
      { term: 'Token', def: '模型计费和处理文本的最小单位；上下文越长，消耗越多。' },
      { term: '温度', def: '控制随机性的参数；越低越稳定，越高越发散。' },
      { term: '上下文', def: '模型一次能记住的对话和设定总量，超出后需要总结或截断。' },
      { term: '采样', def: '控制模型输出的参数集合，例如温度、top-p 和重复惩罚。' },
      { term: '云酒馆', def: '部署在云端、打开网页就能用的酒馆服务，省掉本地安装和配置。' },
    ],
    faqTitle: '常见问题',
    faq: [
      { q: '酒馆AI 需要安装吗？', a: '不需要。直接开聊走浏览器；想自己搭再按教程安装 SillyTavern。' },
      { q: '聊天记录会被上传吗？', a: '直接开聊的聊天记录默认存在你的浏览器；使用自带 API Key 时，消息直接发往你配置的模型服务商。' },
      { q: '没有 API Key 能玩吗？', a: '可以先浏览角色和教程；真正开聊需要在设置里填入你自己的 API Key。' },
      { q: '云酒馆和本地部署怎么选？', a: '想省事选云酒馆；想掌控数据、模型和插件选本地部署。' },
      { q: '角色卡从哪里下载？', a: '看角色卡网站清单；下载前确认站点条款和作者许可。' },
    ],
    aboutTitle: '我们怎么验证和收录',
    aboutDesc:
      '这个站点的定位是中文酒馆AI 入口，不是把同一篇内容翻译成 25 种语言。我们只保留能被搜索到、且对读者有用的页面；榜单和教程都会写最后验证日期。',
    aboutPoints: [
      '每篇教程至少在一台真实设备上走完流程。',
      '云酒馆榜单按价格、隐私、中文、内容边界四项复核。',
      '推荐链接如有利益关系，会在页面内披露。',
    ],
    aboutCta: '了解我们的验证标准',
    updated: '最后更新：2026-11-08',
  },
  en: {
    seo: {
      title: 'RoleChat AI — AI Roleplay in Your Browser, SillyTavern-Compatible',
      description:
        'Chat with AI characters in your browser. Compare cloud taverns and character card sites, or follow our SillyTavern setup guides. Updated weekly.',
      ogTitle: 'RoleChat AI — AI Roleplay in Your Browser, SillyTavern-Compatible',
      ogDescription:
        'Chat with AI characters in your browser. Compare cloud taverns and character card sites, or follow our SillyTavern setup guides.',
    },
    badge: 'RoleChat AI · Tested weekly',
    h1: 'AI Roleplay in Your Browser — No Install, SillyTavern-Compatible',
    subtitle:
      'Pick a character and start chatting, or learn to self-host with Windows / macOS / Android setup, API configuration, character cards and world books.',
    intro:
      'RoleChat AI is a browser-first AI roleplay hub. Start chatting with original characters in seconds, or learn SillyTavern from zero — installation, API keys, character cards and world books. Pick the path that matches the time you have.',
    ctaPrimary: 'Start chatting',
    ctaSecondary: 'Read local setup guide',
    trust: 'No install · No login · Bring your own API key · Updated weekly',
    chooseTitle: 'How do you want to play?',
    chooseDesc: 'Three paths, depending on how much setup you want.',
    choose: [
      { title: 'Start chatting', desc: 'No install, no environment setup. Pick a character and go.', to: '/ai-chat/', cta: 'Open chat' },
      { title: 'Find a cloud tavern', desc: 'Compare free tiers, privacy and Chinese support before choosing.', to: '/cloud-taverns/', cta: 'See the list' },
      { title: 'Self-host', desc: 'Control the model, cards and world books. Data stays on your machine.', to: '/wiki/local-deploy/', cta: 'Read setup' },
    ],
    chatTitle: 'Start chatting: no install, pick a character',
    chatDesc:
      'Six original characters, ready to chat. Conversations stay in your browser by default; with your own API key, messages go straight from your device to your model provider.',
    chatNote: 'No login · Bring your own API key · Local chat history',
    chatPlaceholder: 'Describe a scenario, or pick a character…',
    chatCta: 'Start chatting',
    cloudTitle: 'Cloud taverns tested: free, no login, Chinese-friendly',
    cloudDesc:
      'The point of a cloud tavern is skipping installation and configuration. We test price, privacy, Chinese support and content policy, and publish the last-verified date with every listing.',
    cloudCriteria: [
      { title: 'Price', desc: 'Free tier, subscription price, hidden limits.' },
      { title: 'Privacy', desc: 'Chat retention, training use, export options.' },
      { title: 'Chinese', desc: 'UI, character cards and world books in Chinese.' },
      { title: 'Content policy', desc: 'Clear toggle, boundaries and age limits.' },
    ],
    cloudNote: 'Six services are being re-checked. The full list with last-verified dates is in progress.',
    cloudCta: 'See the full list',
    cardsTitle: 'Character card sites: 8 working sources, last verified',
    cardsDesc:
      'Start with six popular sources. The full list, licences and last-verified dates live on the card-sites page. Check each site’s terms and the card author’s licence before downloading.',
    cards: [
      { name: 'Chatbots Webring', desc: 'Cards gathered from multiple platforms.', note: 'Collection' },
      { name: 'AICharacterCards.com', desc: 'A large SillyTavern card library with beginner guides and a random-card roulette.', note: 'Cards + guides' },
      { name: 'Character Tavern', desc: 'A card collection from the SillyTavern community.', note: 'Community' },
      { name: 'realm.risuai.net', desc: 'Character cards from RisuAI.', note: 'RisuAI' },
      { name: 'Janny AI', desc: 'Character cards from Janitor AI.', note: 'Janitor AI' },
      { name: 'BotBooru', desc: 'Cards gathered from multiple sites, with lorebooks.', note: 'Cards + lorebooks' },
    ],
    cardsCta: 'See the full card-site list',
    guidesTitle: 'SillyTavern guides: setup, API, world books',
    guidesDesc: 'Six guides in reading order, from first launch to long-term use. Each one lists supported platforms and its last update.',
    guidesCta: 'Read all guides',
    toolsTitle: 'Tavern tools: card editor, world-book checker, preset diff',
    toolsDesc: 'Everything runs locally in your browser. Check cards, world books and presets before you export them.',
    toolsCta: 'Open the tools',
    glossaryTitle: 'Tavern glossary: character card, world book, preset, token',
    glossaryDesc: 'Eight terms to know before you start.',
    glossary: [
      { term: 'Character card', def: 'A file defining a character’s persona, greeting and example dialogue — usually JSON or PNG.' },
      { term: 'World book', def: 'Keyword-triggered background entries that fill in setting, places and relationships.' },
      { term: 'Preset', def: 'Sampling parameters and prompt templates that shape style, length and stability.' },
      { term: 'Token', def: 'The smallest unit a model processes and bills; longer context costs more.' },
      { term: 'Temperature', def: 'Randomness control: lower is steadier, higher is wilder.' },
      { term: 'Context', def: 'How much dialogue and setting the model can remember at once; beyond it you summarize or truncate.' },
      { term: 'Sampling', def: 'Parameters that shape output, such as temperature, top-p and repetition penalty.' },
      { term: 'Cloud tavern', def: 'A hosted tavern you open in the browser, with no local installation.' },
    ],
    faqTitle: 'FAQ',
    faq: [
      { q: 'Do I need to install anything?', a: 'No. Chat in your browser; if you want to self-host, follow the SillyTavern guide.' },
      { q: 'Are my chats uploaded?', a: 'Chats stay in your browser by default. With your own API key, messages go directly to your model provider.' },
      { q: 'Can I chat without an API key?', a: 'You can browse characters and guides first; chatting requires your own API key in Settings.' },
      { q: 'Cloud tavern or self-hosting?', a: 'Choose cloud for convenience; self-host if you want control over data, models and extensions.' },
      { q: 'Where do I get character cards?', a: 'See the card-site list, and check each site’s terms and the author’s licence before downloading.' },
    ],
    aboutTitle: 'How we test and what we keep',
    aboutDesc:
      'This site is a focused English/Chinese AI roleplay hub, not the same article translated into 25 languages. We keep pages that can be found in search and are useful to readers; guides and lists publish a last-verified date.',
    aboutPoints: [
      'Every guide is walked through on a real device.',
      'Cloud taverns are re-checked on price, privacy, Chinese support and content policy.',
      'Affiliate relationships, if any, are disclosed on the page.',
    ],
    aboutCta: 'Read our verification standard',
    updated: 'Last updated: 2026-11-08',
  },
};
