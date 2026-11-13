<script setup lang="ts">
import { breadcrumbSchema } from '~/composables/useSeo';

/**
 * 酒馆插件合辑页（承接「酒馆插件 / 酒馆助手插件 / 酒馆提示词模板 / 酒馆美化」等中文搜索词）。
 * 关键词部署：Title/H1 吃主词与年份，四个 H2 分别承接 助手(604)/提示词模板(1703)/美化(134)/sillytavern教程(480)。
 * 插件条目聚合自公开社区清单（仓库地址与功能为事实信息），描述文案本站重写；
 * 外链仓库与本站无关联，核对日期见页尾。站内互链：preset-lab / worldbook-forge /
 * card-converter / tutorials / card-sites / guides，转化出口 /opentavern。
 */
definePageMeta({ layout: 'dashboard' });

const { locale } = useI18n();
const localePath = useLocalePath();
const isZh = computed(() => locale.value === 'zh-CN');

/** 插件仓库地址（语言中立，zh/en 共用，改地址只改这里） */
const R = {
  jsrGitlab: 'https://gitlab.com/novi028/JS-Slash-Runner',
  jsrGithub: 'https://github.com/N0VI028/JS-Slash-Runner',
  jsrDoc: 'https://n0vi028.github.io/JS-Slash-Runner-Doc/',
  memGitee: 'https://gitee.com/muyoou/st-memory-enhancement',
  memGithub: 'https://github.com/muyoou/st-memory-enhancement',
  memDoc: 'https://muyoo.com.cn/wiki/memory/',
  amilyDoc: 'https://docs.google.com/document/d/11E7HIFg59up0afv-lV0cAF5G3jzJXCkZK8cBCOMZ9zo/edit',
  backup: 'https://github.com/uhhhh15/chat-history-backup',
  hide: 'https://github.com/uhhhh15/hide',
  star: 'https://github.com/uhhhh15/star',
  reminder: 'https://github.com/Mooooooon/silly-tavern-reminder',
  silence: 'https://github.com/SillyTavern/Extension-Silence',
  quickPersona: 'https://github.com/SillyTavern/Extension-QuickPersona',
  messageLimit: 'https://github.com/SillyTavern/Extension-MessageLimit',
  companionStats: 'https://github.com/Junejulyz/chat-companion-stats',
  qr: 'https://github.com/uhhhh15/QR',
  noass: 'https://gitee.com/mirrorange/noass',
  zerxz: 'https://github.com/ZerxZ/SillyTavern-Extension-ZerxzLib',
  ptGithub: 'https://github.com/zonde306/ST-Prompt-Template',
  ptCodeberg: 'https://codeberg.org/zonde306/ST-Prompt-Template',
  ptProxy: 'https://gh-proxy.org/https://github.com/zonde306/ST-Prompt-Template',
  regexBinder: 'https://wwio.lanzoub.com/iDWHP3743u0d',
  autoSum: 'https://github.com/EphemeralAlien/AutoSummarizer',
  colorizer: 'https://github.com/XanadusWorks/SillyTavern-Dialogue-Colorizer',
  removeBr: 'https://github.com/MAX-TAB/remove-br-tags-extension',
  fontMgr: 'https://wwio.lanzoub.com/i9Zk3373tbcb',
  zeoseven: 'https://fonts.zeoseven.com/',
  topBar: 'https://github.com/SillyTavern/Extension-TopInfoBar',
  inputHelper: 'https://github.com/Mooooooon/st-input-helper',
} as const;

interface PluginEntry {
  name: string;
  tag: string;
  desc: string;
  links: { label: string; href: string }[];
}

interface PluginGroup {
  h3: string;
  desc?: string;
  plugins: PluginEntry[];
}

const C = {
  'zh-CN': {
    badge: 'SillyTavern 插件合辑 · 2026',
    h1: '2026 SillyTavern 酒馆插件推荐与安装指南（酒馆助手 / 提示词模板 / 美化合辑）',
    subtitle:
      '按「必装底座 → 提示词模板 → 界面美化」整理的酒馆插件清单：每个插件都附 GitHub 仓库地址与 GitLab / Gitee 国内直连，装不上有替代路线，最后附 3 步安装教程与常见问题。',
    hint: '全部仓库地址于 2026-11 逐条人工核对；打不开 GitHub 就换「国内直连」地址。',
    ctaPrimary: '打开在线网页酒馆',
    ctaSecondary: '看新手教程',
    trust: '20+ 插件条目 · 附国内直连地址 · 3 步安装教程',

    helperTitle: '核心必装：酒馆助手插件（Tavern-Helper）与功能扩展',
    helperDesc: '先装「酒馆助手」打底，再按需补记忆、总结、备份类扩展——这一组决定了酒馆能玩出多少花样。',
    helperGroups: [
      {
        h3: '酒馆助手插件（JS-Slash-Runner）安装地址与脚本生态',
        desc: '中文社区大量角色卡的交互界面都依赖它，属于「别人做的卡、你没它就用不了」的底座级扩展。',
        plugins: [
          {
            name: '酒馆助手（JS-Slash-Runner / Tavern-Helper）',
            tag: '扩展 · 必装底座',
            desc: '在对话楼层里渲染按钮、表格乃至小游戏级别的交互界面；能用 jQuery 直接操作酒馆界面（改样式、绑事件）；也是酒馆与外部应用联动的中间层。',
            links: [
              { label: 'GitLab 国内直连', href: R.jsrGitlab },
              { label: 'GitHub', href: R.jsrGithub },
              { label: '官方文档', href: R.jsrDoc },
            ],
          },
        ],
      },
      {
        h3: '长期记忆与总结插件：记忆表格（st-memory-enhancement）与 Amily2 号助手',
        desc: '长篇聊卡「失忆」是硬伤：记忆表格把设定固化成表格，总结类工具把前情压缩成回顾。',
        plugins: [
          {
            name: '记忆表格（st-memory-enhancement）',
            tag: '扩展 · 长期记忆',
            desc: '把角色设定、关键事件、物品与关系写进可自动注入上下文的表格，AI 推演剧情不再前后矛盾；表格结构可自定义，社区已有 LSR、Tt 等成套预设可直接套用。',
            links: [
              { label: 'Gitee 国内直连', href: R.memGitee },
              { label: 'GitHub', href: R.memGithub },
              { label: '使用文档', href: R.memDoc },
            ],
          },
          {
            name: 'Amily2 号助手（总结工具）',
            tag: '扩展 · 前情总结',
            desc: '自动总结聊天记录生成回顾，配合记忆表格食用效果更好；作者「诗与酒」，安装与配置见官方文档。',
            links: [{ label: '安装文档', href: R.amilyDoc }],
          },
        ],
      },
      {
        h3: '聊天记录自动备份、楼层隐藏与消息提醒插件',
        desc: '安全网三件套：防丢档、防刷屏、防干等。',
        plugins: [
          {
            name: '聊天记录自动备份（chat-history-backup）',
            tag: '扩展 · 数据安全',
            desc: '定时把聊天记录备份成文件并支持快速恢复——清缓存、换设备前的最后一道保险。',
            links: [{ label: 'GitHub', href: R.backup }],
          },
          {
            name: '自动隐藏楼层（hide）',
            tag: '扩展 · 界面整理',
            desc: '自动收起旧楼层与被屏蔽的内容，长对话不再被刷屏淹没。',
            links: [{ label: 'GitHub', href: R.hide }],
          },
          {
            name: '酒馆消息提醒（silly-tavern-reminder）',
            tag: '扩展 · 消息提醒',
            desc: 'AI 回复完成时弹桌面通知或播放提示音，挂着等回复时可以去干别的。',
            links: [{ label: 'GitHub', href: R.reminder }],
          },
          {
            name: '酒馆后台保活（Extension-Silence）',
            tag: '扩展 · 稳定性',
            desc: '防止浏览器杀掉后台的酒馆页面导致断连，挂机党必备。',
            links: [{ label: 'GitHub', href: R.silence }],
          },
        ],
      },
    ] as PluginGroup[],
    scriptsTitle: '酒馆助手脚本库：装完助手后值得开的高人气脚本',
    scriptsIntro: '以下脚本都在「酒馆助手 → 脚本库」里一键导入，不用再装扩展：',
    scripts: [
      { title: '实时修改 CSS', desc: '不进设置页，边聊边调界面样式，改完即生效。' },
      { title: '随时间切换主题', desc: '按现实时间自动换白天 / 夜间配色，沉浸感直接拉满。' },
      { title: '自动安装插件', desc: '角色卡自带脚本依赖时，按提示自动补装对应扩展。' },
      { title: '标签化', desc: '按预设开关正则、按模型自动切换破限，多预设玩家刚需。' },
      { title: '跳转楼层 / 正则脚本分组 / 快速回复随卡迁移', desc: '导航与整理类小工具，聊得越久越有用。' },
    ],
    memoryNote: '不想再装扩展的，也可以用酒馆助手脚本版「全自动总结」（原项目 AutoSummarizer）达到类似效果。',
    moreTitle: '更多实用扩展速查',
    more: [
      { name: '聊天收藏器（star）', note: '收藏高光楼层随时回看', href: R.star },
      { name: 'user 快速切换（QuickPersona）', note: '多人格一键切换', href: R.quickPersona },
      { name: '上下文屏蔽（MessageLimit）', note: '控制注入楼层范围，省 token', href: R.messageLimit },
      { name: '羁绊助手（chat-companion-stats）', note: '好感度 / 羁绊数值养成', href: R.companionStats },
      { name: 'QR 助手（QR）', note: '生成二维码快速分享', href: R.qr },
      { name: 'NoAss', note: 'Gitee 国内直连可用', href: R.noass },
      { name: '哈基米轮询（ZerxzLib）', note: '多渠道 API 轮询', href: R.zerxz },
    ],

    promptTitle: '进阶必备：酒馆提示词模板插件与预设正则绑定',
    promptDesc: '这一组管「发给模型的内容」：模板语法负责结构化变量，正则绑定器负责切换预设时的规则联动。',
    promptGroups: [
      {
        h3: '酒馆提示词模板语法与常用模板插件推荐',
        desc: '把「手填正则 + 复制粘贴」升级成结构化模板，进阶预设玩法的地基。',
        plugins: [
          {
            name: '提示词模板（ST-Prompt-Template）',
            tag: '扩展 · 模板语法',
            desc: '在预设与角色卡里用模板语法读写变量、拼接提示词。注意：新版酒馆有连接白名单，Codeberg 备用地址若装不上，换 GitHub 地址或代理直连即可。',
            links: [
              { label: 'GitHub', href: R.ptGithub },
              { label: 'Codeberg 备用', href: R.ptCodeberg },
              { label: 'gh-proxy 代理直连', href: R.ptProxy },
            ],
          },
        ],
      },
      {
        h3: '预设正则绑定器与变量框架配合技巧',
        desc: '「破限预设 A 配正则组 A」不再靠手动记忆。',
        plugins: [
          {
            name: '预设正则绑定器（酒馆助手脚本）',
            tag: '脚本 · 预设联动',
            desc: '给每个预设绑定专属正则组，切换预设时自动同步切换。脚本包下载后经「酒馆助手 → 脚本库」导入。',
            links: [{ label: '脚本包下载', href: R.regexBinder }],
          },
        ],
      },
    ] as PluginGroup[],
    promptToolsTitle: '配合本站工具食用',
    promptToolsDesc: '动手改预设前，先用浏览器工具把结构看明白：',
    promptTools: [
      {
        title: '预设实验室（Preset Lab）',
        desc: '在线并排对比不同破限预设的提示词结构、采样参数与正则差异，再决定把哪套模板搬进酒馆。',
        cta: '对比预设',
        to: '/tools/preset-lab',
      },
      {
        title: '世界书工坊（Worldbook Forge）',
        desc: '可视化编写、导入与校验世界书条目——模板变量最终注入的世界观底稿在这里写。',
        cta: '编写世界书',
        to: '/tools/worldbook-forge',
      },
    ],

    themeTitle: '界面焕新：SillyTavern 酒馆美化插件与脚本推荐',
    themeDesc: '字体、配色、引用染色、工具栏——一组插件把默认界面换成你自己的酒馆。',
    themeGroups: [
      {
        h3: '多彩对话引用文字（Dialogue-Colorizer）与多余换行清理',
        plugins: [
          {
            name: '多彩对话引用文字（Dialogue-Colorizer）',
            tag: '扩展 · 美化',
            desc: '给「」引用文字上色，一眼分清角色台词与旁白，长对话可读性直线上升。',
            links: [{ label: 'GitHub', href: R.colorizer }],
          },
          {
            name: '删除多余换行（remove-br-tags-extension）',
            tag: '扩展 · 排版清理',
            desc: '自动清掉模型输出里的连续空行，楼层排版不再稀碎。',
            links: [{ label: 'GitHub', href: R.removeBr }],
          },
        ],
      },
      {
        h3: '字体管理器、实时 CSS 修改与时间主题切换脚本',
        plugins: [
          {
            name: '字体管理器（酒馆助手脚本）',
            tag: '脚本 · 美化',
            desc: '三步全局换字体：字体站选字体 → 复制它的 CSS → 酒馆助手「脚本库」导入本脚本并粘贴 CSS。',
            links: [
              { label: '脚本包下载', href: R.fontMgr },
              { label: '字体 CSS 站', href: R.zeoseven },
            ],
          },
        ],
      },
      {
        h3: '顶部工具栏（TopInfoBar）与输入助手（st-input-helper）',
        plugins: [
          {
            name: '顶部信息栏（Extension-TopInfoBar）',
            tag: '扩展 · 界面增强',
            desc: '把模型、预设、上下文用量等关键信息固定在聊天页顶部，不用再翻设置页确认。',
            links: [{ label: 'GitHub', href: R.topBar }],
          },
          {
            name: '输入助手（st-input-helper）',
            tag: '扩展 · 输入增强',
            desc: '输入框联想补全、常用短语快速插入，写长指令省一半敲键时间。',
            links: [{ label: 'GitHub', href: R.inputHelper }],
          },
        ],
      },
    ] as PluginGroup[],
    themeNote:
      '实时修改 CSS 与「随时间切换主题」都是酒馆助手脚本库的常驻款：前者边聊边调样式，后者按现实时间自动切换白天 / 夜间配色，配合字体管理器就是一套完整的美化方案。',

    installTitle: 'SillyTavern 教程：酒馆插件怎么安装与国内直连避坑',
    installDesc: '带 GitHub / GitLab / Gitee 链接的扩展都能在线安装，全程不用命令行：',
    installStepsTitle: '3 步在线安装插件（GitHub 链接复制与「仅为自己安装」说明）',
    installSteps: [
      {
        title: '复制仓库地址',
        desc: '从上方任一插件卡片复制 GitHub / GitLab / Gitee 地址；GitHub 打不开就换标了「国内直连」的地址。',
      },
      {
        title: '扩展面板粘贴安装',
        desc: '点击酒馆顶栏「扩展」图标 → 扩展管理（Install extension），粘贴仓库地址，点安装。',
      },
      {
        title: '选「仅为自己安装」',
        desc: '弹窗询问安装范围时选 Install for me only（仅为自己安装），刷新页面后侧栏出现新图标即装好。',
      },
    ],
    installNote:
      '国内直连避坑：GitHub 连接不稳定时优先 GitLab / Gitee 地址；ST-Prompt-Template 这类仓库还可用 gh-proxy 代理前缀。蓝奏云的脚本包不是扩展，走「酒馆助手 → 脚本库 → 导入」。',

    diffTitle: '酒馆扩展插件、助手脚本、酒馆角色卡与世界书有什么区别？',
    diff: [
      {
        title: '扩展插件（Extension）',
        desc: '装在酒馆本体上，改功能或界面，跟着你的酒馆走，与具体角色无关。',
      },
      {
        title: '助手脚本（Script）',
        desc: '依赖酒馆助手运行的轻量增强，导入即用，常随角色卡一起分发。',
      },
      {
        title: '角色卡（Character Card）',
        desc: 'PNG / JSON 格式的「人设定档」，携带人设、开场白甚至内置脚本；格式不通用时用格式转换器互转。',
      },
      {
        title: '世界书（Worldbook / Lorebook）',
        desc: '按关键词触发的设定条目库，命中才注入上下文；另有一类「全局世界书」氛围资源（小回的剧场、情绪稳定器等）常被误当成插件。',
      },
    ],
    diffToolsTitle: '分不清时，用站内工具直接上手最快：',
    diffTools: [
      {
        title: '角色卡格式转换器',
        desc: 'PNG / JSON 互转、提取元数据，跨客户端搬卡不换格式就靠它。',
        cta: '转换角色卡',
        to: '/tools/card-converter',
      },
      {
        title: '什么是角色卡（教程）',
        desc: '一张卡里到底装了什么、V2 / V3 规范差在哪，一篇讲清。',
        cta: '看教程',
        to: '/guides/what-is-a-character-card',
      },
      {
        title: '角色卡网站导航',
        desc: '8 个精选卡站分组导航，下载回来配合上面的转换器使用。',
        cta: '找角色卡',
        to: '/card-sites',
      },
    ],

    ctaTitle: '懒得折腾本地插件？体验免安装 RoleChat AI 在线网页酒馆',
    ctaDesc:
      '插件生态固然强，但「装环境、配插件、防丢档」三件事劝退了大多数人。RoleChat AI 在线网页酒馆打开即聊，聊天记录只存你自己的浏览器。',
    ctaPoints: [
      { title: '零安装零登录', desc: '打开网页填上 API Key 就能开聊，插件干的活本站内置了大半。' },
      { title: '记录只在本地', desc: '聊天记录只存浏览器，可随时导出 JSON 备份迁移。' },
      { title: '角色卡通用', desc: 'SillyTavern V2 / V3 的 PNG / JSON 卡直接导入，世界书同样通用。' },
    ],
    ctaPrimary2: '打开在线网页酒馆',
    ctaSecondary2: '看部署对比教程',

    faqTitle: '酒馆插件常见问题解答（FAQ）',
    faq: [
      {
        q: '酒馆插件怎么安装？',
        a: '复制插件仓库地址（GitHub / GitLab / Gitee），在酒馆顶栏「扩展 → 扩展管理」粘贴地址安装，弹窗里选「仅为自己安装」，刷新后即生效；详见上文 3 步教程。',
      },
      {
        q: '装插件必须能访问 GitHub 吗？',
        a: '不必。酒馆助手、记忆表格等主流插件都有 GitLab / Gitee 国内直连地址；个别仓库（如 ST-Prompt-Template）还有 Codeberg 备用与 gh-proxy 代理直连，本页卡片均已标注。',
      },
      {
        q: '酒馆助手插件和提示词模板插件冲突吗？',
        a: '不冲突，分工不同：酒馆助手管界面渲染与脚本运行，提示词模板管预设里的变量语法。建议两个都装最新版，进阶玩法基本都建立在这两件套之上。',
      },
      {
        q: '插件装多了会卡吗？',
        a: '会占一些内存与加载时间，按需安装即可。Chrome 系浏览器在重度脚本下偶发崩溃，可换 Chrome Beta 或 Edge 试试；重要聊天记得用自动备份插件兜底。',
      },
      {
        q: '不想装任何插件，有平替方案吗？',
        a: '可以直接用本站在线网页酒馆：免安装免登录，角色卡与世界书通用导入；做卡、写世界书、对比预设也都有浏览器工具，不需要本地环境。',
      },
    ],

    note: '插件信息人工复核于 2026-11；所列第三方仓库与本站无关联，链接失效或版本大改欢迎通过联系页反馈。',
    updated: '最后更新：2026-11-13',
    seo: {
      title: '2026 SillyTavern 酒馆插件推荐：酒馆助手、提示词模板与美化插件安装教程 - RoleChat AI',
      description:
        '精选 2026 年 SillyTavern（酒馆 AI）必装插件合辑：涵盖酒馆助手插件、酒馆提示词模板插件、记忆表格与酒馆美化扩展。提供 GitHub/GitLab 国内直连地址与图文安装教程，不想折腾本地部署也可直接体验 RoleChat AI 免安装网页酒馆。',
      ogTitle: '2026 SillyTavern 酒馆插件推荐合辑 | RoleChat AI',
      ogDescription: '酒馆助手、提示词模板、记忆表格与美化插件，附国内直连地址与 3 步安装教程。',
    },
  },

  en: {
    badge: 'SillyTavern plugins · 2026',
    h1: '2026 SillyTavern Plugin Guide & Install Tutorial (Tavern Helper / Prompt Templates / Themes)',
    subtitle:
      'A curated SillyTavern plugin list ordered by “core base → prompt templates → UI themes”. Every entry carries its GitHub repo plus China-friendly GitLab / Gitee mirrors, ending with a 3-step install guide and an FAQ.',
    hint: 'All repo links hand-checked in Nov 2026; if GitHub won’t open, use a mirror link.',
    ctaPrimary: 'Open the web tavern',
    ctaSecondary: 'Read the beginner guides',
    trust: '20+ plugin entries · China-friendly mirrors · 3-step install',

    helperTitle: 'Core installs: Tavern Helper and essential extensions',
    helperDesc: 'Install Tavern Helper first, then add memory, summarization and backup extensions as needed — this group decides how far your tavern can go.',
    helperGroups: [
      {
        h3: 'Tavern Helper (JS-Slash-Runner): install links and script ecosystem',
        desc: 'A huge share of community character cards depend on it — the base extension other people’s cards won’t work without.',
        plugins: [
          {
            name: 'Tavern Helper (JS-Slash-Runner)',
            tag: 'Extension · Core base',
            desc: 'Renders buttons, tables and even mini-game UIs inside chat messages; drives the SillyTavern DOM with jQuery (styling, event binding); also bridges the tavern with external apps.',
            links: [
              { label: 'GitLab (no VPN)', href: R.jsrGitlab },
              { label: 'GitHub', href: R.jsrGithub },
              { label: 'Docs', href: R.jsrDoc },
            ],
          },
        ],
      },
      {
        h3: 'Long-term memory: st-memory-enhancement and the Amily2 assistant',
        desc: '“Amnesia” kills long chats: the memory table freezes settings into tables, summarizers compress what came before.',
        plugins: [
          {
            name: 'Memory Table (st-memory-enhancement)',
            tag: 'Extension · Long-term memory',
            desc: 'Writes character settings, key events, items and relationships into tables that auto-inject into context, keeping the story consistent; table layouts are customizable and ready-made presets (LSR, Tt) exist.',
            links: [
              { label: 'Gitee mirror', href: R.memGitee },
              { label: 'GitHub', href: R.memGithub },
              { label: 'Docs', href: R.memDoc },
            ],
          },
          {
            name: 'Amily2 Assistant (summarizer)',
            tag: 'Extension · Recap',
            desc: 'Automatically summarizes chat history into recaps; pairs well with the memory table. Install and setup in the official doc.',
            links: [{ label: 'Install guide', href: R.amilyDoc }],
          },
        ],
      },
      {
        h3: 'Auto backup, floor hiding and message reminders',
        desc: 'The safety net: no lost chats, no flooding, no idle waiting.',
        plugins: [
          {
            name: 'Chat History Backup (chat-history-backup)',
            tag: 'Extension · Data safety',
            desc: 'Backs up chat logs to files on a schedule with quick restore — the last line of defense before clearing cache or switching devices.',
            links: [{ label: 'GitHub', href: R.backup }],
          },
          {
            name: 'Auto Hide Floors (hide)',
            tag: 'Extension · UI tidy-up',
            desc: 'Automatically collapses old and regex-hidden floors so long conversations stop flooding the screen.',
            links: [{ label: 'GitHub', href: R.hide }],
          },
          {
            name: 'Message Reminder (silly-tavern-reminder)',
            tag: 'Extension · Notifications',
            desc: 'Desktop notification or sound when the AI finishes replying — go do something else while waiting.',
            links: [{ label: 'GitHub', href: R.reminder }],
          },
          {
            name: 'Keep-Alive (Extension-Silence)',
            tag: 'Extension · Stability',
            desc: 'Stops the browser from killing the background tavern tab and dropping your session.',
            links: [{ label: 'GitHub', href: R.silence }],
          },
        ],
      },
    ] as PluginGroup[],
    scriptsTitle: 'Tavern Helper script library: high-popularity scripts worth enabling',
    scriptsIntro: 'All importable from “Tavern Helper → Script Library” — no extra extensions needed:',
    scripts: [
      { title: 'Live CSS editing', desc: 'Tweak the interface while you chat; changes apply instantly.' },
      { title: 'Time-based themes', desc: 'Auto-switches day / night palettes by the real clock.' },
      { title: 'Auto plugin installer', desc: 'Installs an extension a card’s scripts depend on, on prompt.' },
      { title: 'Tagging', desc: 'Toggle regex per preset and switch jailbreaks per model — a must for multi-preset players.' },
      { title: 'Floor jump / regex grouping / quick-reply migration', desc: 'Navigation and tidy-up utilities that matter more the longer you chat.' },
    ],
    memoryNote:
      'Prefer not to install another extension? A Tavern Helper script port of “AutoSummarizer” (original project) reaches a similar result.',
    moreTitle: 'More handy extensions at a glance',
    more: [
      { name: 'Chat Star (star)', note: 'Bookmark highlight floors', href: R.star },
      { name: 'Quick Persona (QuickPersona)', note: 'One-click persona switching', href: R.quickPersona },
      { name: 'MessageLimit', note: 'Cap which floors enter context — saves tokens', href: R.messageLimit },
      { name: 'Companion Stats (chat-companion-stats)', note: 'Affection / bond progression', href: R.companionStats },
      { name: 'QR Helper (QR)', note: 'Share via QR code', href: R.qr },
      { name: 'NoAss', note: 'Available on Gitee', href: R.noass },
      { name: 'Hajimi polling (ZerxzLib)', note: 'Multi-channel API polling', href: R.zerxz },
    ],

    promptTitle: 'Next level: prompt-template plugins and preset regex binding',
    promptDesc: 'This group manages what gets sent to the model: template syntax structures variables; the binder keeps regex in sync with presets.',
    promptGroups: [
      {
        h3: 'Prompt template syntax and the go-to template plugin',
        desc: 'Upgrade from hand-filled regex and copy-paste to structured templates — the foundation of advanced presets.',
        plugins: [
          {
            name: 'ST-Prompt-Template',
            tag: 'Extension · Template syntax',
            desc: 'Reads and writes variables with template syntax inside presets and cards to compose prompts. Note: newer SillyTavern builds keep a connection whitelist — if the Codeberg mirror fails, use GitHub or the proxy link.',
            links: [
              { label: 'GitHub', href: R.ptGithub },
              { label: 'Codeberg mirror', href: R.ptCodeberg },
              { label: 'gh-proxy mirror', href: R.ptProxy },
            ],
          },
        ],
      },
      {
        h3: 'Preset regex binder and variable-framework tips',
        desc: '“Preset A ships with regex group A” — no longer something to remember by hand.',
        plugins: [
          {
            name: 'Preset Regex Binder (Tavern Helper script)',
            tag: 'Script · Preset sync',
            desc: 'Binds a regex group to each preset and switches them together. Import the download via “Tavern Helper → Script Library”.',
            links: [{ label: 'Script download', href: R.regexBinder }],
          },
        ],
      },
    ] as PluginGroup[],
    promptToolsTitle: 'Pair with the in-site tools',
    promptToolsDesc: 'Understand the structure in your browser before touching your presets:',
    promptTools: [
      {
        title: 'Preset Lab',
        desc: 'Compare prompt structure, sampling params and regex of jailbreak presets side by side before moving one into your tavern.',
        cta: 'Compare presets',
        to: '/tools/preset-lab',
      },
      {
        title: 'Worldbook Forge',
        desc: 'Write, import and validate worldbook entries visually — the lore your template variables inject lives here.',
        cta: 'Build a worldbook',
        to: '/tools/worldbook-forge',
      },
    ],

    themeTitle: 'Refresh the look: SillyTavern theme plugins and scripts',
    themeDesc: 'Fonts, palettes, quote coloring, toolbars — turn the default UI into your own tavern.',
    themeGroups: [
      {
        h3: 'Dialogue Colorizer and blank-line cleanup',
        plugins: [
          {
            name: 'Dialogue Colorizer',
            tag: 'Extension · Beauty',
            desc: 'Colors quoted “dialogue” so speech and narration are told apart at a glance — readability soars in long chats.',
            links: [{ label: 'GitHub', href: R.colorizer }],
          },
          {
            name: 'Remove BR Tags (remove-br-tags-extension)',
            tag: 'Extension · Typography',
            desc: 'Strips consecutive blank lines from model output so floors stop looking broken.',
            links: [{ label: 'GitHub', href: R.removeBr }],
          },
        ],
      },
      {
        h3: 'Font manager, live CSS and time-based themes',
        plugins: [
          {
            name: 'Font Manager (Tavern Helper script)',
            tag: 'Script · Beauty',
            desc: 'Three steps to a global font: pick one on the font site → copy its CSS → import this script and paste the CSS.',
            links: [
              { label: 'Script download', href: R.fontMgr },
              { label: 'Font CSS site', href: R.zeoseven },
            ],
          },
        ],
      },
      {
        h3: 'TopInfoBar and st-input-helper',
        plugins: [
          {
            name: 'TopInfoBar (Extension-TopInfoBar)',
            tag: 'Extension · UI',
            desc: 'Pins model, preset and context usage to the top of the chat page — no more digging through settings.',
            links: [{ label: 'GitHub', href: R.topBar }],
          },
          {
            name: 'Input Helper (st-input-helper)',
            tag: 'Extension · Input',
            desc: 'Autocomplete and quick phrases in the input box — half the keystrokes for long instructions.',
            links: [{ label: 'GitHub', href: R.inputHelper }],
          },
        ],
      },
    ] as PluginGroup[],
    themeNote:
      'Live CSS editing and time-based themes are staples of the Tavern Helper script library: tweak styles mid-chat and let the palette follow the real clock — together with the font manager they form a complete theming kit.',

    installTitle: 'SillyTavern tutorial: how to install plugins (and China mirror tips)',
    installDesc: 'Any extension with a GitHub / GitLab / Gitee link installs online — no command line involved:',
    installStepsTitle: 'Install a plugin in 3 steps (repo link & “Install for me only”)',
    installSteps: [
      {
        title: 'Copy the repo URL',
        desc: 'Copy a GitHub / GitLab / Gitee URL from any card above; if GitHub won’t open, use a “mirror” link.',
      },
      {
        title: 'Paste it in the extensions panel',
        desc: 'Click the “Extensions” icon in the top bar → Manage Extensions (Install extension), paste the URL and install.',
      },
      {
        title: 'Choose “Install for me only”',
        desc: 'When asked for scope, pick Install for me only, then refresh — a new icon in the sidebar means success.',
      },
    ],
    installNote:
      'Mirror tips: prefer GitLab / Gitee links when GitHub is flaky; repos like ST-Prompt-Template also work through the gh-proxy prefix. Lanzou script packages are not extensions — import them via “Tavern Helper → Script Library”.',

    diffTitle: 'Extension vs. helper script vs. character card vs. worldbook — what’s the difference?',
    diff: [
      {
        title: 'Extension',
        desc: 'Installed onto SillyTavern itself; changes features or UI and travels with your tavern, not a character.',
      },
      {
        title: 'Helper script',
        desc: 'A lightweight enhancement running inside Tavern Helper — import and go, often shipped with cards.',
      },
      {
        title: 'Character card',
        desc: 'A PNG / JSON “persona profile” carrying personality, first messages, even embedded scripts; convert formats with the converter.',
      },
      {
        title: 'Worldbook / Lorebook',
        desc: 'Keyword-triggered lore entries injected only on match; “global worldbook” mood resources (mini-theaters, mood stabilizers) are often mistaken for plugins.',
      },
    ],
    diffToolsTitle: 'Can’t tell them apart? Try the in-site tools directly:',
    diffTools: [
      {
        title: 'Card Converter',
        desc: 'Convert PNG / JSON both ways and extract metadata for moving cards across clients.',
        cta: 'Convert a card',
        to: '/tools/card-converter',
      },
      {
        title: 'What is a character card (guide)',
        desc: 'What’s inside a card and how V2 / V3 specs differ — one guide, all clear.',
        cta: 'Read the guide',
        to: '/guides/what-is-a-character-card',
      },
      {
        title: 'Card site directory',
        desc: '8 curated card sites grouped by type — download and pair with the converter.',
        cta: 'Find cards',
        to: '/card-sites',
      },
    ],

    ctaTitle: 'Don’t want to tinker with local plugins? Try the no-install web tavern',
    ctaDesc:
      'The plugin ecosystem is powerful, but setup, configuration and backup scare most people away. The RoleChat AI web tavern opens and chats — logs stay in your own browser.',
    ctaPoints: [
      { title: 'Zero install, zero login', desc: 'Open the page, add an API key, chat. Much of what plugins do is built in.' },
      { title: 'Logs stay local', desc: 'Chat logs live only in your browser; export to JSON anytime.' },
      { title: 'Cards just work', desc: 'SillyTavern V2 / V3 PNG / JSON cards import directly, worldbooks too.' },
    ],
    ctaPrimary2: 'Open the web tavern',
    ctaSecondary2: 'Read the deployment comparison',

    faqTitle: 'SillyTavern plugin FAQ',
    faq: [
      {
        q: 'How do I install SillyTavern plugins?',
        a: 'Copy the plugin repo URL (GitHub / GitLab / Gitee), open “Extensions → Manage Extensions” in the top bar, paste the URL to install, choose “Install for me only”, then refresh. See the 3-step guide above.',
      },
      {
        q: 'Do I need GitHub access to install plugins?',
        a: 'No. Tavern Helper, Memory Table and other popular plugins have GitLab / Gitee mirrors; some repos (e.g. ST-Prompt-Template) also offer a Codeberg mirror and a gh-proxy link — all labeled on this page.',
      },
      {
        q: 'Do Tavern Helper and ST-Prompt-Template conflict?',
        a: 'No — different jobs: Tavern Helper renders UI and runs scripts; the prompt template handles variable syntax in presets. Install both at their latest versions; advanced play builds on this pair.',
      },
      {
        q: 'Will too many plugins slow things down?',
        a: 'They cost some memory and load time — install on demand. Chromium browsers occasionally crash under heavy scripts; try Chrome Beta or Edge, and keep the auto-backup extension as a safety net.',
      },
      {
        q: 'Is there a no-plugin alternative?',
        a: 'Use this site’s web tavern: no install, no login, direct card and worldbook import — plus browser tools for building cards, writing worldbooks and comparing presets without any local setup.',
      },
    ],

    note: 'Plugin entries hand-checked in Nov 2026; the listed third-party repos are unaffiliated with this site — report dead links via the contact page.',
    updated: 'Last updated: 2026-11-13',
    seo: {
      title: '2026 SillyTavern Plugin Guide: Tavern Helper, Prompt Templates & Themes | RoleChat AI',
      description:
        'A curated 2026 SillyTavern plugin collection: Tavern Helper (JS-Slash-Runner), ST-Prompt-Template, st-memory-enhancement and UI beautify extensions, with GitHub/GitLab/Gitee install links, a 3-step install guide, and a no-install web tavern alternative.',
      ogTitle: '2026 SillyTavern Plugin Collection | RoleChat AI',
      ogDescription: 'Tavern Helper, prompt templates, memory and theme plugins — with mirrors and a 3-step install guide.',
    },
  },
} as const;

const content = computed(() => (isZh.value ? C['zh-CN'] : C.en));

// 右侧「本页板块」目录：四个内容板块 + FAQ（转化板块不进目录）
const tocItems = computed(() => [
  { id: 'helper', label: isZh.value ? '核心必装' : 'Core installs' },
  { id: 'prompt', label: isZh.value ? '提示词模板' : 'Prompt templates' },
  { id: 'theme', label: isZh.value ? '界面美化' : 'Themes' },
  { id: 'install', label: isZh.value ? '安装教程' : 'Install guide' },
  { id: 'faq', label: content.value.faqTitle },
]);

const canonicalUrl = computed(() =>
  isZh.value ? 'https://www.rolechatai.com/zh-CN/sillytavern-plugins' : 'https://www.rolechatai.com/sillytavern-plugins',
);

// FAQ 结构化数据：5 条问答直出富摘要候选
const faqJsonLd = computed(() => ({
  type: 'application/ld+json',
  innerHTML: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.value.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }),
}));

useSeoMeta({
  title: () => content.value.seo.title,
  description: () => content.value.seo.description,
  ogTitle: () => content.value.seo.ogTitle,
  ogDescription: () => content.value.seo.ogDescription,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
});

useHead({
  htmlAttrs: { lang: computed(() => (isZh.value ? 'zh-CN' : 'en')) },
  link: computed(() => [
    { rel: 'canonical', key: 'canonical', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'en', href: 'https://www.rolechatai.com/sillytavern-plugins' },
    { rel: 'alternate', hreflang: 'zh-CN', href: 'https://www.rolechatai.com/zh-CN/sillytavern-plugins' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://www.rolechatai.com/sillytavern-plugins' },
  ]),
  script: [
    faqJsonLd,
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: isZh.value ? '首页' : 'Home', path: '/' },
          {
            name: isZh.value ? '酒馆插件推荐' : 'SillyTavern plugins',
            path: isZh.value ? '/zh-CN/sillytavern-plugins' : '/sillytavern-plugins',
          },
        ]),
      ),
    },
  ],
});

/** 内链工具卡（预设实验室 / 世界书工坊 / 转换器等）统一走 localePath，/opentavern 保持全局路由 */
function toolTo(to: string) {
  return to === '/opentavern' ? to : localePath(to);
}
</script>

<template>
  <div class="cp-page">
    <PageToolbar :badge="content.badge" :cta-label="content.ctaPrimary" />

    <main class="cp-workspace">
      <section class="cp-panel">
        <div class="cp-hero">
          <h1>{{ content.h1 }}</h1>
          <p class="cp-subtitle">{{ content.subtitle }}</p>
          <p class="cp-hint">{{ content.hint }}</p>
          <div class="cp-hero-actions">
            <NuxtLink to="/opentavern" class="cp-btn cp-btn-primary">{{ content.ctaPrimary }}</NuxtLink>
            <NuxtLink :to="localePath('/tutorials')" class="cp-btn">{{ content.ctaSecondary }}</NuxtLink>
          </div>
          <p class="cp-trust">{{ content.trust }}</p>
        </div>

        <!-- H2-1 核心必装：酒馆助手与功能扩展 -->
        <section id="helper" class="cp-section">
          <h2>{{ content.helperTitle }}</h2>
          <p class="cp-section-desc">{{ content.helperDesc }}</p>

          <div v-for="group in content.helperGroups" :key="group.h3" class="plug-group">
            <h3 class="plug-h3">{{ group.h3 }}</h3>
            <p v-if="group.desc" class="cp-section-desc">{{ group.desc }}</p>
            <div class="cp-res-grid">
              <div v-for="p in group.plugins" :key="p.name" class="cp-res-card">
                <span class="cp-res-tag">{{ p.tag }}</span>
                <strong>{{ p.name }}</strong>
                <small>{{ p.desc }}</small>
                <div class="plug-links">
                  <a
                    v-for="l in p.links"
                    :key="l.href"
                    :href="l.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="cp-res-cta"
                  >{{ l.label }} ↗</a>
                </div>
              </div>
            </div>
            <!-- 第二组尾部：脚本版全自动总结提示 -->
            <p v-if="group.h3 === content.helperGroups[1].h3" class="plug-note">
              {{ content.memoryNote }}<a :href="R.autoSum" target="_blank" rel="noopener noreferrer">AutoSummarizer ↗</a>
            </p>
          </div>

          <h3 class="plug-h3">{{ content.scriptsTitle }}</h3>
          <p class="cp-section-desc">{{ content.scriptsIntro }}</p>
          <ul class="cp-criteria">
            <li v-for="s in content.scripts" :key="s.title">
              <strong>{{ s.title }}</strong>
              <span>{{ s.desc }}</span>
            </li>
          </ul>

          <h3 class="plug-h3">{{ content.moreTitle }}</h3>
          <ul class="plug-more">
            <li v-for="m in content.more" :key="m.name">
              <a :href="m.href" target="_blank" rel="noopener noreferrer">{{ m.name }}</a> — {{ m.note }}
            </li>
          </ul>
        </section>

        <!-- H2-2 进阶必备：提示词模板与预设正则绑定 -->
        <section id="prompt" class="cp-section">
          <h2>{{ content.promptTitle }}</h2>
          <p class="cp-section-desc">{{ content.promptDesc }}</p>

          <div v-for="group in content.promptGroups" :key="group.h3" class="plug-group">
            <h3 class="plug-h3">{{ group.h3 }}</h3>
            <p v-if="group.desc" class="cp-section-desc">{{ group.desc }}</p>
            <div class="cp-res-grid">
              <div v-for="p in group.plugins" :key="p.name" class="cp-res-card">
                <span class="cp-res-tag">{{ p.tag }}</span>
                <strong>{{ p.name }}</strong>
                <small>{{ p.desc }}</small>
                <div class="plug-links">
                  <a
                    v-for="l in p.links"
                    :key="l.href"
                    :href="l.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="cp-res-cta"
                  >{{ l.label }} ↗</a>
                </div>
              </div>
            </div>
          </div>

          <h3 class="plug-h3">{{ content.promptToolsTitle }}</h3>
          <p class="cp-section-desc">{{ content.promptToolsDesc }}</p>
          <div class="cp-res-grid">
            <div v-for="tool in content.promptTools" :key="tool.to" class="cp-res-card">
              <strong>{{ tool.title }}</strong>
              <small>{{ tool.desc }}</small>
              <NuxtLink :to="toolTo(tool.to)" class="cp-res-cta">{{ tool.cta }} →</NuxtLink>
            </div>
          </div>
        </section>

        <!-- H2-3 界面焕新：美化插件与脚本 -->
        <section id="theme" class="cp-section">
          <h2>{{ content.themeTitle }}</h2>
          <p class="cp-section-desc">{{ content.themeDesc }}</p>

          <div v-for="group in content.themeGroups" :key="group.h3" class="plug-group">
            <h3 class="plug-h3">{{ group.h3 }}</h3>
            <p v-if="group.desc" class="cp-section-desc">{{ group.desc }}</p>
            <div class="cp-res-grid">
              <div v-for="p in group.plugins" :key="p.name" class="cp-res-card">
                <span class="cp-res-tag">{{ p.tag }}</span>
                <strong>{{ p.name }}</strong>
                <small>{{ p.desc }}</small>
                <div class="plug-links">
                  <a
                    v-for="l in p.links"
                    :key="l.href"
                    :href="l.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="cp-res-cta"
                  >{{ l.label }} ↗</a>
                </div>
              </div>
            </div>
          </div>

          <p class="plug-note">{{ content.themeNote }}</p>
        </section>

        <!-- H2-4 安装教程与国内直连避坑 -->
        <section id="install" class="cp-section">
          <h2>{{ content.installTitle }}</h2>
          <p class="cp-section-desc">{{ content.installDesc }}</p>

          <h3 class="plug-h3">{{ content.installStepsTitle }}</h3>
          <div class="cp-res-grid">
            <div v-for="(step, i) in content.installSteps" :key="step.title" class="cp-res-card">
              <span class="cp-res-tag">{{ i + 1 }}</span>
              <strong>{{ step.title }}</strong>
              <small>{{ step.desc }}</small>
            </div>
          </div>
          <p class="plug-note">{{ content.installNote }}</p>

          <h3 class="plug-h3">{{ content.diffTitle }}</h3>
          <ul class="cp-criteria">
            <li v-for="d in content.diff" :key="d.title">
              <strong>{{ d.title }}</strong>
              <span>{{ d.desc }}</span>
            </li>
          </ul>
          <p class="cp-section-desc">{{ content.diffToolsTitle }}</p>
          <div class="cp-res-grid">
            <div v-for="tool in content.diffTools" :key="tool.to" class="cp-res-card">
              <strong>{{ tool.title }}</strong>
              <small>{{ tool.desc }}</small>
              <NuxtLink :to="toolTo(tool.to)" class="cp-res-cta">{{ tool.cta }} →</NuxtLink>
            </div>
          </div>
        </section>

        <!-- H2-5 转化：免安装在线网页酒馆 -->
        <section id="cta" class="cp-section">
          <h2>{{ content.ctaTitle }}</h2>
          <p class="cp-section-desc">{{ content.ctaDesc }}</p>
          <ul class="cp-criteria">
            <li v-for="point in content.ctaPoints" :key="point.title">
              <strong>{{ point.title }}</strong>
              <span>{{ point.desc }}</span>
            </li>
          </ul>
          <div class="cp-hero-actions" style="justify-content: flex-start">
            <NuxtLink to="/opentavern" class="cp-btn cp-btn-primary">{{ content.ctaPrimary2 }}</NuxtLink>
            <NuxtLink :to="localePath('/guides/sillytavern-vs-web-tavern')" class="cp-btn">
              {{ content.ctaSecondary2 }}
            </NuxtLink>
          </div>
        </section>

        <!-- H2-6 FAQ -->
        <section id="faq" class="cp-section">
          <h2>{{ content.faqTitle }}</h2>
          <div class="cp-res-grid">
            <div v-for="item in content.faq" :key="item.q" class="cp-res-card">
              <strong>{{ item.q }}</strong>
              <small>{{ item.a }}</small>
            </div>
          </div>
        </section>

        <p class="cp-section-note">{{ content.note }}</p>
        <p class="cp-updated">{{ content.updated }}</p>
      </section>

      <!-- 右：本页板块目录（≥1200px 显示） -->
      <PageToc :items="tocItems" />
    </main>
  </div>
</template>

<style scoped>
/* 插件分组 H3（现有 cp 面板无 h3 样式，补最小排版） */
.plug-h3 {
  margin: 24px 0 6px;
  font-size: 1.02rem;
  line-height: 1.5;
}

.plug-group:first-child .plug-h3 {
  margin-top: 8px;
}

/* 卡片底部外链行：复用 cp-res-cta 样式，多链接横排换行 */
.plug-links {
  margin-top: auto;
  padding-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 2px 16px;
}

/* 组尾补充说明（脚本版总结 / 美化备注 / 避坑提示） */
.plug-note {
  margin: 10px 0 0;
  color: var(--cp-text-secondary);
  font-size: 0.82rem;
  line-height: 1.6;
}

.plug-note a {
  color: var(--cp-primary);
  font-weight: 600;
  text-decoration: none;
}

.plug-note a:hover {
  color: #337ecc;
}

/* 更多扩展速查：双列紧凑清单 */
.plug-more {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 18px;
}

.plug-more li {
  color: var(--cp-text-secondary);
  font-size: 0.84rem;
  line-height: 1.6;
}

.plug-more a {
  color: var(--cp-primary);
  font-weight: 600;
  text-decoration: none;
}

.plug-more a:hover {
  color: #337ecc;
}

@media (max-width: 720px) {
  .plug-more {
    grid-template-columns: 1fr;
  }
}
</style>
