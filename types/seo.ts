/** SEO 页面静态数据类型 —— 面向搜索引擎的原创角色 / 合集 / 教程 */

/** 角色大类（用于列表筛选与 SEO 分组） */
export type CharacterCategory = 'Modern' | 'Fantasy' | 'Sci-Fi';

/** 内容安全等级 —— MVP 全部 SFW romance */
export type SafetyLevel = 'SFW' | 'Suggestive';

export interface CharacterFaq {
  q: string;
  a: string;
}

export interface CharacterSeo {
  /** URL slug：/characters/<slug> */
  slug: string;
  name: string;
  /** 头像首字母（图片缺失时回退） */
  initial: string;
  /** 一句话卖点（列表卡 + SEO） */
  tagline: string;
  /** 大类 */
  category: CharacterCategory;
  /** 角色性别 */
  gender: 'Male' | 'Female';
  /** 目标受众 */
  audience: string;
  /** archetype 副标题（如 The Cold Doctor Boyfriend） */
  archetype: string;
  description: string;
  /** 长文性格描述（详情页） */
  personality: string;
  /** 短标签（列表筛选 + 卡片展示，如 Slow burn） */
  tags: string[];
  /** 细分性格标签（详情页展示，如 Reserved, Devoted） */
  personalityTags: string[];
  relationshipSetup: string;
  openingMessage: string;
  /** 世界观/场景设定（详情页板块） */
  scenario: string;
  relatedSlugs: string[];
  faq: CharacterFaq[];
  /** 占位图片路径 /images/characters/<slug>.webp，缺失回退字母头像 */
  avatar: string;
  /** 占位封面路径 /images/characters/<slug>-cover.webp，缺失回退渐变背景 */
  coverImage: string;
  /** 预设模型提示（留给后续 /app 导入用，SEO 页不展示） */
  modelPreset: string;
  /** 内容安全等级，页面展示 SFW 徽章 */
  safetyLevel: SafetyLevel;
  /** 独立 SEO 标题（不再页面内拼接） */
  seoTitle: string;
  /** 独立 SEO 描述 */
  seoDescription: string;
}

export interface CollectionSeo {
  slug: string;
  title: string;
  intro: string;
  seoDescription: string;
  characterSlugs: string[];
}

export interface GuideSection {
  heading: string;
  /** 段落数组，每段为纯文本（渲染为 <p>） */
  paragraphs: string[];
}

export interface GuideInternalLink {
  label: string;
  to: string;
}

export interface GuideSeo {
  slug: string;
  title: string;
  description: string;
  /** ISO 发布日期（YYYY-MM-DD），用于 Article schema */
  datePublished: string;
  sections: GuideSection[];
  internalLinks: GuideInternalLink[];
}
