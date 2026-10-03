/**
 * 工具站静态注册表（语言无关的结构化数据）。
 *
 * 约定（对齐 where-to-find-character-cards.vue 的 wfc_res_<id>_desc 模式）：
 * - name 为专有名词，保持原文不译；展示文案（tag/描述/CTA）走 i18n key
 * - SITE_TOOLS：站内工具，首页宫格与 /tools「站内工具」区共用（copy 字段持有卡片文案的 i18n key）
 * - LOCAL_TAVERNS：第三方本地酒馆目录（/tools「本地酒馆目录」区，外链官方项目）
 *   i18n key 规则：tools_dir_<slug>_<tag|desc>
 * - 新增工具 = 加一条注册 + 对应 i18n key（en/zh-CN/zh-TW/ja/ko 手写，
 *   其余语言由 i18n/i18n.config.ts 的 fallbackLocale:'en' 兜底）
 */

export interface SiteTool {
  /** 稳定 id */
  slug: 'rolechat' | 'pure-tavern' | 'sillytavern-mod' | 'card-studio';
  /** 专有名词不译 */
  name: string;
  /** 卡片主 CTA 的站内路由 */
  to: string;
  /** 次级链接（GitHub 仓库等），可空 */
  href?: string;
  /** 开源协议短码（页面渲染为标签，不译） */
  license?: 'AGPL-3.0';
  /** 卡片文案 i18n key（首页宫格与 /tools 站内工具区共用） */
  copy: { tag: string; desc: string; cta: string };
}

export interface LocalTavern {
  /** 稳定 id：拼 i18n key（tools_dir_<slug>_<tag|desc>） */
  slug: string;
  /** 专有名词不译 */
  name: string;
  /** 官方项目页（目录卡片外链） */
  href: string;
  /** 开源协议；不确定的项目留空，避免错误声明 */
  license?: 'AGPL-3.0';
}

/** 站内工具：首页宫格与 /tools 站内工具区共用 */
export const SITE_TOOLS: SiteTool[] = [
  {
    slug: 'rolechat',
    name: 'RoleChat AI',
    to: '/app',
    copy: { tag: 'home_tools_rc_tag', desc: 'home_tools_rc_desc', cta: 'home_tools_rc_cta' },
  },
  {
    slug: 'pure-tavern',
    name: 'PureTavern',
    to: '/tools/pure-tavern',
    href: 'https://github.com/Lianues/PureTavern',
    license: 'AGPL-3.0',
    copy: { tag: 'home_tools_pt_tag', desc: 'home_tools_pt_desc', cta: 'home_tools_pt_cta' },
  },
  {
    slug: 'card-studio',
    name: 'Card Studio',
    to: '/tools/card-studio',
    copy: { tag: 'home_tools_cs_tag', desc: 'home_tools_cs_desc', cta: 'home_tools_cs_cta' },
  },
  {
    slug: 'sillytavern-mod',
    name: 'SillyTavernMOD',
    to: '/tools/sillytavern-mod',
    href: 'https://github.com/zhaiiker/SillyTavernMOD',
    license: 'AGPL-3.0',
    copy: { tag: 'home_tools_stm_tag', desc: 'home_tools_stm_desc', cta: 'home_tools_stm_cta' },
  },
];

/** 第三方本地酒馆目录（/tools 目录区） */
export const LOCAL_TAVERNS: LocalTavern[] = [
  { slug: 'sillytavern', name: 'SillyTavern', href: 'https://sillytavern.dev', license: 'AGPL-3.0' },
  { slug: 'risuai', name: 'RisuAI', href: 'https://risuai.net' },
  { slug: 'agnai', name: 'AgnAI', href: 'https://agnai.chat' },
];

/** PureTavern 官方链接（详情页 hero 与下载矩阵共用） */
export const PURE_TAVERN_LINKS = {
  repo: 'https://github.com/Lianues/PureTavern',
  releases: 'https://github.com/Lianues/PureTavern/releases',
} as const;

/** SillyTavernMOD 官方链接（详情页 hero 与部署区共用；演示站属第三方运营内容，不收录） */
export const SILLY_TAVERN_MOD_LINKS = {
  repo: 'https://github.com/zhaiiker/SillyTavernMOD',
  docker: 'https://hub.docker.com/r/zhaiker/sillytavernmod',
} as const;

/* ================= 首页工具中枢（布局参照 tools.laopobao.online） ================= */

/** 中枢分类（侧栏筛选维度） */
export type HubCategory = 'play' | 'craft' | 'local' | 'resource';

export interface HubTool {
  slug: string;
  /** 专有名词不译 */
  name: string;
  category: HubCategory;
  /** live=可点入；soon=开发中（虚线禁用卡，展示路线图） */
  status: 'live' | 'soon';
  /** 站内路由（live 二选一） */
  to?: string;
  /** 外链（live 二选一） */
  href?: string;
  license?: 'AGPL-3.0';
  /** 描述 i18n key（站内工具复用 home_tools_* / tools_dir_* 既有 key） */
  descKey: string;
}

/** 分类清单（labelKey 为 i18n key；计数运行时算） */
export const HUB_CATEGORIES: { id: HubCategory | 'all'; labelKey: string }[] = [
  { id: 'all', labelKey: 'home_hub_cat_all' },
  { id: 'play', labelKey: 'home_hub_cat_play' },
  { id: 'craft', labelKey: 'home_hub_cat_craft' },
  { id: 'local', labelKey: 'home_hub_cat_local' },
  { id: 'resource', labelKey: 'home_hub_cat_resource' },
];

/** 首页工具中枢：站内工具 + 规划中工具（soon）+ 本地酒馆目录 + 资源页，统一进分类网格 */
export const HOME_HUB: HubTool[] = [
  // 在线扮演
  { slug: 'rolechat', name: 'RoleChat AI', category: 'play', status: 'live', to: '/app', descKey: 'home_tools_rc_desc' },
  { slug: 'characters', name: 'Characters', category: 'play', status: 'live', to: '/characters', descKey: 'home_hub_ch_desc' },
  // 制作工具
  { slug: 'card-studio', name: 'Card Studio', category: 'craft', status: 'live', to: '/tools/card-studio', descKey: 'home_tools_cs_desc' },
  { slug: 'card-converter', name: 'Card Converter', category: 'craft', status: 'soon', descKey: 'home_hub_cc_desc' },
  { slug: 'worldbook-forge', name: 'Worldbook Forge', category: 'craft', status: 'soon', descKey: 'home_hub_wb_desc' },
  { slug: 'preset-lab', name: 'Preset Lab', category: 'craft', status: 'soon', descKey: 'home_hub_pl_desc' },
  { slug: 'ai-toolkit', name: 'AI Toolkit', category: 'craft', status: 'soon', descKey: 'home_hub_at_desc' },
  { slug: 'story-to-worldbook', name: 'Story to Worldbook', category: 'craft', status: 'soon', descKey: 'home_hub_sw_desc' },
  // 本地酒馆
  { slug: 'pure-tavern', name: 'PureTavern', category: 'local', status: 'live', to: '/tools/pure-tavern', license: 'AGPL-3.0', descKey: 'home_tools_pt_desc' },
  { slug: 'sillytavern-mod', name: 'SillyTavernMOD', category: 'local', status: 'live', to: '/tools/sillytavern-mod', license: 'AGPL-3.0', descKey: 'home_tools_stm_desc' },
  { slug: 'sillytavern', name: 'SillyTavern', category: 'local', status: 'live', href: 'https://sillytavern.dev', license: 'AGPL-3.0', descKey: 'tools_dir_sillytavern_desc' },
  { slug: 'risuai', name: 'RisuAI', category: 'local', status: 'live', href: 'https://risuai.net', descKey: 'tools_dir_risuai_desc' },
  { slug: 'agnai', name: 'AgnAI', category: 'local', status: 'live', href: 'https://agnai.chat', descKey: 'tools_dir_agnai_desc' },
  // 资源指南
  { slug: 'guides', name: 'Guides', category: 'resource', status: 'live', to: '/guides', descKey: 'home_hub_gd_desc' },
  { slug: 'card-sources', name: 'Card Sources', category: 'resource', status: 'live', to: '/where-to-find-character-cards', descKey: 'home_hub_wf_desc' },
];
