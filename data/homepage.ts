/**
 * 首页六板块内容橱窗数据源（zh-CN / en 双语）。
 *
 * 消费方：pages/index.vue（唯一）。
 * 链接纪律：所有 `to` 必须指向 route-guard 白名单内的 200 页面
 * （/opentavern、/tools/{card-studio,worldbook-forge,preset-lab,card-converter,pure-tavern}、
 * /guides/**、/characters/<白名单slug>、/where-to-find-character-cards），
 * 不得指向线上 410 的旧路由（如 /tools/ai-toolkit、/app、/wiki/**）。
 * 官网外链（href）仅限 API 提供商官方网站，角色卡站不做外链（与站内方针一致）。
 */

export interface HomeSeo {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

export interface HomeToolCard {
  title: string;
  name: string;
  desc: string;
  icon: 'users' | 'book' | 'tools' | 'server';
  color: 'blue' | 'green' | 'orange' | 'red';
  to: string;
}

export interface HomeResourceCard {
  tag: string;
  title: string;
  desc: string;
  cta: string;
  to: string;
}

export interface HomeCloudOption {
  title: string;
  desc: string;
  cta: string;
  to: string;
  highlight?: boolean;
}

export interface HomeApiProvider {
  name: string;
  desc: string;
  pricing: string;
  bestFor: string;
  to: string;
  href: string;
}

export interface HomeCardSite {
  name: string;
  desc: string;
  note: string;
}

export interface HomeContent {
  seo: HomeSeo;
  badge: string;
  h1: string;
  subtitle: string;
  intro: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trust: string;
  toolsTitle: string;
  toolsDesc: string;
  tools: HomeToolCard[];
  charactersTitle: string;
  charactersDesc: string;
  charactersCta: string;
  cardSitesTitle: string;
  cardSitesDesc: string;
  cardSites: HomeCardSite[];
  cardSitesCta: string;
  resourcesTitle: string;
  resourcesDesc: string;
  resources: HomeResourceCard[];
  cloudTitle: string;
  cloudDesc: string;
  cloud: HomeCloudOption[];
  cloudCriteria: { title: string; desc: string }[];
  cloudNote: string;
  apiTitle: string;
  apiDesc: string;
  apiProviders: HomeApiProvider[];
  apiCta: string;
  guidesTitle: string;
  guidesDesc: string;
  guidesCta: string;
  tips: string[];
  updated: string;
}

export const HOME_CONTENT: Record<'zh-CN' | 'en', HomeContent> = {
  'zh-CN': {
    seo: {
      title: 'RoleChat AI - 在线网页版AI酒馆(OpenTavern) | SillyTavern角色卡工具、云酒馆与API导航',
      description:
        '免安装浏览器本地运行 OpenTavern 在线酒馆，免登录畅玩 AI 角色扮演；内置 SillyTavern V2/V3 角色卡编辑、世界书编写、预设对比与格式转换工具，附云酒馆、AI API 导航与中文教程。',
      ogTitle: 'RoleChat AI - 在线网页版AI酒馆与 SillyTavern 工具箱',
      ogDescription:
        '免安装在线 AI 角色扮演酒馆（OpenTavern），内置角色卡编辑、世界书、预设对比工具，附云酒馆与 AI API 导航。',
    },
    badge: '在线 AI 酒馆 · 免登录',
    h1: '免安装在线 AI 角色扮演酒馆与 SillyTavern 工具箱',
    subtitle:
      '数据 100% 存储在浏览器本地，无需配置 Python 或本地环境，接入 API 即可在网页端畅玩类酒馆 AI 角色扮演。',
    intro:
      'RoleChat AI（OpenTavern）是一个免登录的在线 AI 酒馆：打开网页就能和角色开聊，也可以用下面的角色卡编辑、世界书编写、预设对比等工具打理你的酒馆资源。',
    ctaPrimary: '进入 OpenTavern 在线网页酒馆',
    ctaSecondary: '看角色扮演教程',
    trust: '免安装 · 免登录 · 数据存浏览器 · 可自带 API Key',
    toolsTitle: 'SillyTavern 核心在线工具箱',
    toolsDesc: '四个工具全部在浏览器本地运行，文件不上传；支持 SillyTavern V2/V3 规范的 PNG 与 JSON。',
    tools: [
      {
        title: '角色卡编辑器',
        name: 'Card Studio',
        desc: '在线读取、编辑与生成 SillyTavern V2/V3 规范的 PNG 与 JSON 角色卡，支持人设 Prompt、开场白与隐藏元数据修改。',
        icon: 'users',
        color: 'blue',
        to: '/tools/card-studio',
      },
      {
        title: '世界书工坊',
        name: 'Worldbook Forge',
        desc: '可视化编写与管理酒馆世界书（Lorebook / World Info），支持触发关键词、常驻条目与递归扫描配置。',
        icon: 'book',
        color: 'green',
        to: '/tools/worldbook-forge',
      },
      {
        title: '预设实验室',
        name: 'Preset Lab',
        desc: '一键对比不同酒馆破限预设（Presets）的提示词结构、温度参数与正则差异，快速调试最佳文风。',
        icon: 'tools',
        color: 'orange',
        to: '/tools/preset-lab',
      },
      {
        title: '角色卡格式转换',
        name: 'Card Converter',
        desc: '支持 PNG 角色卡、JSON 文本、TavernAI 与 Chub 格式之间的无损互转与元数据提取。',
        icon: 'server',
        color: 'red',
        to: '/tools/card-converter',
      },
    ],
    charactersTitle: '热门 AI 角色卡',
    charactersDesc:
      '站内精选原创 AI 角色卡，覆盖现代、奇幻与科幻题材；每张卡支持 SillyTavern V2/V3 导入，点开即可查看人设与开场白。',
    charactersCta: '看全部角色卡',
    cardSitesTitle: '角色卡网站导航',
    cardSitesDesc:
      '精选 8 个可用角色卡资源站（跨平台合集、RisuAI / JanitorAI 生态等）；下载前请确认站点条款与作者许可。',
    cardSites: [
      { name: 'Chatbots Webring', desc: '从多个平台汇聚的角色卡合集。', note: '合集' },
      { name: 'AICharacterCards.com', desc: '大量 SillyTavern 角色卡，附带新手指南与随机抽卡。', note: '角色卡 + 指南' },
      { name: 'Character Tavern', desc: '来自 SillyTavern 社区的角色卡合集。', note: '社区合集' },
      { name: 'realm.risuai.net', desc: '来自 RisuAI 的角色卡合集。', note: 'RisuAI' },
      { name: 'Janny AI', desc: '来自 Janitor AI 的角色卡合集。', note: 'Janitor AI' },
      { name: 'BotBooru', desc: '多站汇聚的角色卡，附带世界书（lorebooks）。', note: '角色卡 + 世界书' },
      { name: 'DataCat', desc: '角色卡与设定集整理站。', note: '归档' },
      { name: 'Wyvern.chat', desc: '单作者精品角色卡站点。', note: '独立站' },
    ],
    cardSitesCta: '看角色卡站完整清单',
    resourcesTitle: '酒馆插件、破限预设与正则资源',
    resourcesDesc: '预设、世界书、客户端与角色卡四类核心资源怎么选怎么用；站内工具可以直接上手。',
    resources: [
      {
        tag: '预设',
        title: '破限预设（Presets）',
        desc: '决定模型文风与尺度的参数合集。用预设实验室在线对比不同破限预设的提示词结构、温度与正则差异，再决定导入哪一个。',
        cta: '对比预设',
        to: '/tools/preset-lab',
      },
      {
        tag: '世界书',
        title: '世界书 / Lorebook 资源',
        desc: '按关键词触发的背景设定集合，是长篇角色扮演的记忆外挂。用世界书工坊可视化编写、导入与校验条目。',
        cta: '编写世界书',
        to: '/tools/worldbook-forge',
      },
      {
        tag: '插件',
        title: '酒馆客户端与插件生态',
        desc: 'SillyTavern 本体与 PureTavern 等开源客户端支持扩展、主题与正则脚本；先看本地酒馆详情页再决定装哪个。',
        cta: '看本地酒馆',
        to: '/tools/pure-tavern',
      },
      {
        tag: '角色卡',
        title: '角色卡资源与格式',
        desc: '从角色卡站下载的 PNG / JSON 卡可在格式转换器里无损互转、提取元数据，再导入任意酒馆客户端。',
        cta: '转换角色卡',
        to: '/tools/card-converter',
      },
    ],
    cloudTitle: '云酒馆托管与在线开聊',
    cloudDesc: '云酒馆的价值是省掉安装和配置。我们按价格、隐私、中文支持、内容边界四项逐家复核，并把最后验证日期写进榜单。',
    cloud: [
      {
        title: 'RoleChat AI 在线网页酒馆（本站）',
        desc: '零安装、零配置、免登录：打开网页接入 API 即可开聊，聊天记录只存在你的浏览器里——这就是最省事的「云酒馆」。',
        cta: '进入在线酒馆',
        to: '/opentavern',
        highlight: true,
      },
      {
        title: '云主机自部署 SillyTavern',
        desc: '在 VPS 上架一套自己的酒馆，任何设备浏览器访问；插件、预设、角色卡完全自主掌控，数据不经过第三方。',
        cta: '看部署对比教程',
        to: '/guides/sillytavern-vs-web-tavern',
      },
    ],
    cloudCriteria: [
      { title: '价格', desc: '免费额度、订阅价格、是否有隐藏限制。' },
      { title: '隐私', desc: '是否留存对话、是否用于训练、能否导出。' },
      { title: '中文', desc: '界面、角色卡、世界书是否完整支持中文。' },
      { title: '内容边界', desc: '是否有明确开关、边界说明和年龄限制。' },
    ],
    cloudNote: '第三方云酒馆逐家实测榜单整理中，上线时会标注最后验证日期。',
    apiTitle: 'AI 角色扮演 API 推荐导航',
    apiDesc: '开聊只需要一个 OpenAI 兼容的 API Key。下面是四条主流路线的客观对比：聚合平台、低价官方、大免费额度与角色扮演强模型。',
    apiProviders: [
      {
        name: 'OpenRouter',
        desc: '聚合 400+ 模型的统一入口，一个 Key 切换所有模型，角色扮演社区的主流选择。',
        pricing: '按量计费，部分模型有免费额度',
        bestFor: '想一个 Key 试遍所有模型',
        to: '/guides/how-to-use-openrouter-for-roleplay',
        href: 'https://openrouter.ai/',
      },
      {
        name: 'DeepSeek 官方 API',
        desc: '价格低、中文创作能力强，OpenAI 兼容接口，直接填进本站设置即可用。',
        pricing: '按量计费，价格低',
        bestFor: '预算有限的中文玩家',
        to: '/guides/how-to-get-an-api-key',
        href: 'https://platform.deepseek.com/',
      },
      {
        name: 'Google Gemini',
        desc: '官方 API 有免费额度，多模态能力强，适合轻度角色扮演体验。',
        pricing: '有免费额度，超出按量计费',
        bestFor: '零成本先试玩',
        to: '/guides/how-to-get-an-api-key',
        href: 'https://aistudio.google.com/',
      },
      {
        name: 'Anthropic Claude',
        desc: '长上下文与角色扮演表现出色的官方 API，适合追求文风与沉浸感的玩家。',
        pricing: '按量计费',
        bestFor: '追求最佳文风',
        to: '/guides/how-to-get-an-api-key',
        href: 'https://www.anthropic.com/claude',
      },
    ],
    apiCta: '看 API Key 配置教程',
    guidesTitle: '酒馆角色扮演新手教程与常见问题',
    guidesDesc: '从零开始玩转 AI 酒馆：怎么选 API、怎么拿 Key、怎么写角色卡、怎么调预设——7 篇教程按顺序看。',
    guidesCta: '看全部教程',
    tips: [
      '聊天记录默认存在浏览器，不上传；可以用自己的 API Key。',
      '角色卡支持 SillyTavern V2/V3 的 JSON 和 PNG。',
      '教程和榜单都会写最后验证日期。',
    ],
    updated: '最后更新：2026-11-09',
  },
  en: {
    seo: {
      title: 'RoleChat AI - Online AI Tavern (OpenTavern) | SillyTavern Card Tools, Cloud Taverns & API Guide',
      description:
        'Run OpenTavern, an online AI tavern, right in your browser — no install, no login. Built-in SillyTavern V2/V3 character card editor, world book forge, preset diff and format converter, plus cloud tavern and AI API guides.',
      ogTitle: 'RoleChat AI - Online AI Tavern & SillyTavern Toolbox',
      ogDescription:
        'An online AI roleplay tavern (OpenTavern) with card editor, world book and preset tools, plus cloud tavern and AI API guides.',
    },
    badge: 'Online AI tavern · No login',
    h1: 'Online AI Roleplay Tavern & SillyTavern Toolbox — No Install',
    subtitle:
      'Data stays 100% in your browser — no Python, no local setup. Plug in an API key and start tavern-style AI roleplay on the web.',
    intro:
      'RoleChat AI (OpenTavern) is a no-login online AI tavern: chat with characters right away, or manage cards, world books and presets with the built-in SillyTavern tools below.',
    ctaPrimary: 'Open the OpenTavern Web Tavern',
    ctaSecondary: 'Read the roleplay guides',
    trust: 'No install · No login · Local-first data · Bring your own API key',
    toolsTitle: 'Core SillyTavern Online Toolbox',
    toolsDesc: 'All four tools run locally in your browser — files never leave your device. SillyTavern V2/V3 PNG & JSON supported.',
    tools: [
      {
        title: 'Card Studio',
        name: 'Character card editor',
        desc: 'Read, edit and generate SillyTavern V2/V3 PNG & JSON character cards in your browser — personas, first messages and embedded metadata included.',
        icon: 'users',
        color: 'blue',
        to: '/tools/card-studio',
      },
      {
        title: 'Worldbook Forge',
        name: 'World book editor',
        desc: 'Visually build and manage tavern world books (Lorebook / World Info) with trigger keywords, constant entries and recursive scan settings.',
        icon: 'book',
        color: 'green',
        to: '/tools/worldbook-forge',
      },
      {
        title: 'Preset Lab',
        name: 'Preset diff',
        desc: 'Diff jailbreak presets side by side — prompt structure, temperature and regex differences at a glance, to tune your favorite writing style.',
        icon: 'tools',
        color: 'orange',
        to: '/tools/preset-lab',
      },
      {
        title: 'Card Converter',
        name: 'Card format converter',
        desc: 'Losslessly convert character cards between PNG, JSON, TavernAI and Chub formats, and extract embedded metadata.',
        icon: 'server',
        color: 'red',
        to: '/tools/card-converter',
      },
    ],
    charactersTitle: 'Popular AI Character Cards',
    charactersDesc:
      'Hand-picked original AI character cards across modern, fantasy and sci-fi settings. Every card imports as SillyTavern V2/V3 — open one to see the persona and first message.',
    charactersCta: 'Browse all characters',
    cardSitesTitle: 'Character Card Site Directory',
    cardSitesDesc:
      'Eight working card sources — cross-platform collections plus the RisuAI / JanitorAI ecosystems. Check each site’s terms and the author’s licence before downloading.',
    cardSites: [
      { name: 'Chatbots Webring', desc: 'Cards gathered from multiple platforms.', note: 'Collection' },
      { name: 'AICharacterCards.com', desc: 'A large SillyTavern card library with beginner guides and a random-card roulette.', note: 'Cards + guides' },
      { name: 'Character Tavern', desc: 'A card collection from the SillyTavern community.', note: 'Community' },
      { name: 'realm.risuai.net', desc: 'Character cards from RisuAI.', note: 'RisuAI' },
      { name: 'Janny AI', desc: 'Character cards from Janitor AI.', note: 'Janitor AI' },
      { name: 'BotBooru', desc: 'Cards gathered from multiple sites, with lorebooks.', note: 'Cards + lorebooks' },
      { name: 'DataCat', desc: 'An archive of character cards and lorebooks.', note: 'Archive' },
      { name: 'Wyvern.chat', desc: 'A single-author site with curated cards.', note: 'Indie' },
    ],
    cardSitesCta: 'See the full card-site list',
    resourcesTitle: 'Tavern Plugins, Jailbreak Presets & Regex Resources',
    resourcesDesc: 'The four core resource types every tavern player juggles — presets, world books, clients and cards — and the in-site tools to handle them.',
    resources: [
      {
        tag: 'Presets',
        title: 'Jailbreak presets (Presets)',
        desc: 'The parameter set that defines style and freedom. Use Preset Lab to diff prompt structure, temperature and regex between presets before importing one.',
        cta: 'Diff presets',
        to: '/tools/preset-lab',
      },
      {
        tag: 'World books',
        title: 'World book / Lorebook resources',
        desc: 'Keyword-triggered background entries — the memory extension for long roleplays. Build, import and validate entries visually in Worldbook Forge.',
        cta: 'Build a world book',
        to: '/tools/worldbook-forge',
      },
      {
        tag: 'Plugins',
        title: 'Tavern clients & plugin ecosystem',
        desc: 'SillyTavern itself and open clients like PureTavern support extensions, themes and regex scripts. Compare them before installing.',
        cta: 'Compare local taverns',
        to: '/tools/pure-tavern',
      },
      {
        tag: 'Cards',
        title: 'Card resources & formats',
        desc: 'PNG / JSON cards downloaded from card sites can be losslessly converted and inspected in Card Converter, then imported into any tavern client.',
        cta: 'Convert a card',
        to: '/tools/card-converter',
      },
    ],
    cloudTitle: 'Cloud Taverns & Instant Chat',
    cloudDesc: 'The point of a cloud tavern is skipping installation. We re-check price, privacy, Chinese support and content policy, and publish the last-verified date.',
    cloud: [
      {
        title: 'RoleChat AI Web Tavern (this site)',
        desc: 'Zero install, zero config, no login: open the page, plug in an API key and chat — history stays in your browser. The easiest “cloud tavern” there is.',
        cta: 'Open the online tavern',
        to: '/opentavern',
        highlight: true,
      },
      {
        title: 'Self-host SillyTavern on a VPS',
        desc: 'Run your own tavern on a cloud machine and reach it from any browser. Plugins, presets and cards stay fully under your control.',
        cta: 'Read the setup comparison',
        to: '/guides/sillytavern-vs-web-tavern',
      },
    ],
    cloudCriteria: [
      { title: 'Price', desc: 'Free tier, subscription price, hidden limits.' },
      { title: 'Privacy', desc: 'Chat retention, training use, export options.' },
      { title: 'Chinese', desc: 'UI, character cards and world books in Chinese.' },
      { title: 'Content policy', desc: 'Clear toggle, boundaries and age limits.' },
    ],
    cloudNote: 'A per-service tested cloud tavern list is in progress and will publish last-verified dates.',
    apiTitle: 'AI Roleplay API Guide',
    apiDesc: 'Chatting needs just one OpenAI-compatible API key. Four mainstream routes compared objectively: aggregators, budget official APIs, big free tiers and strong roleplay models.',
    apiProviders: [
      {
        name: 'OpenRouter',
        desc: 'One aggregator for 400+ models — a single key switches between them all. The mainstream choice in the roleplay community.',
        pricing: 'Pay-as-you-go; some models free',
        bestFor: 'Trying every model on one key',
        to: '/guides/how-to-use-openrouter-for-roleplay',
        href: 'https://openrouter.ai/',
      },
      {
        name: 'DeepSeek official API',
        desc: 'Low prices and strong creative writing; OpenAI-compatible, so it drops straight into this site’s settings.',
        pricing: 'Pay-as-you-go, budget-friendly',
        bestFor: 'Budget-conscious players',
        to: '/guides/how-to-get-an-api-key',
        href: 'https://platform.deepseek.com/',
      },
      {
        name: 'Google Gemini',
        desc: 'A generous free tier on the official API and strong multimodal skills — good for casual roleplay.',
        pricing: 'Free tier, then pay-as-you-go',
        bestFor: 'Starting at zero cost',
        to: '/guides/how-to-get-an-api-key',
        href: 'https://aistudio.google.com/',
      },
      {
        name: 'Anthropic Claude',
        desc: 'Long context and standout roleplay quality on the official API — for players chasing prose and immersion.',
        pricing: 'Pay-as-you-go',
        bestFor: 'Best writing quality',
        to: '/guides/how-to-get-an-api-key',
        href: 'https://www.anthropic.com/claude',
      },
    ],
    apiCta: 'Read the API key setup guide',
    guidesTitle: 'AI Roleplay Beginner Guides & FAQ',
    guidesDesc: 'Everything from zero to a tuned tavern: choosing an API, getting a key, writing cards and dialing in presets — seven guides in reading order.',
    guidesCta: 'Read all guides',
    tips: [
      'Chats stay in your browser. Bring your own API key.',
      'Character cards support SillyTavern V2/V3 JSON and PNG.',
      'Guides and lists publish a last-verified date.',
    ],
    updated: 'Last updated: 2026-11-09',
  },
};
