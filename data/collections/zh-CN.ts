import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）—— 简体中文。
 * characterSlugs / slug 等 ID 字段必须与 en.ts 完全一致（跨 locale 不可变）。
 * 仅翻译展示文本：title / intro / seoDescription。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'AI 男友角色',
    intro:
      '为私密角色扮演打造的原创 AI 男友角色。每个人都有自己的声音、自己的伤口、自己爱上你的方式。无需安装、无需配置——选一个,加上你的 AI Key,开启一段只属于你的对话。',
    seoDescription:
      '在 RoleChat AI 上与原创 AI 男友角色对话。冷面医生、疲惫偶像、毒舌侦探等——私密、免费开始、自带 AI Key。',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: '奇幻恋爱角色',
    intro:
      '与原创奇幻恋爱角色一起踏入异世界。阴郁的吸血鬼领主、流放的骑士,以及只有魔法与古老王国才能承载的、慢热的、宿命般的爱情故事。私密、沉浸,几秒即可开始。',
    seoDescription:
      'RoleChat AI 上的原创奇幻恋爱 AI 角色——吸血鬼领主、流放骑士等。私密角色扮演,自带 AI Key,无需安装。',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
