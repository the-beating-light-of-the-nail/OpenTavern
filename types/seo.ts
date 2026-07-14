/** SEO 页面静态数据类型 —— 面向搜索引擎的原创角色 / 合集 / 教程 */

export interface CharacterFaq {
  q: string;
  a: string;
}

export interface CharacterSeo {
  slug: string;
  name: string;
  initial: string;
  tagline: string;
  archetype: string;
  description: string;
  personality: string;
  tags: string[];
  relationshipSetup: string;
  openingMessage: string;
  relatedSlugs: string[];
  faq: CharacterFaq[];
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
  sections: GuideSection[];
  internalLinks: GuideInternalLink[];
}
