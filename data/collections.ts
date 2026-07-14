import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'AI Boyfriend Characters',
    intro:
      'Original AI boyfriend characters for private roleplay. Each one has his own voice, his own wounds, and his own way of falling for you. No installation, no setup — just pick one, add your AI key, and start a conversation that\'s yours alone.',
    seoDescription:
      'Chat with original AI boyfriend characters on RoleChat AI. Cold doctors, exhausted idols, sharp detectives and more — private, free to start, bring your own AI key.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Fantasy Romance Characters',
    intro:
      'Step into other worlds with original fantasy romance characters. Brooding vampire lords, exiled knights, and the slow-burn, star-crossed love stories that only magic and old kingdoms can hold. Private, immersive, and yours to begin in seconds.',
    seoDescription:
      'Original fantasy romance AI characters on RoleChat AI — vampire lords, exiled knights and more. Private roleplay with your own AI key, no installation needed.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];

export function getCollectionBySlug(slug: string): CollectionSeo | undefined {
  return collections.find((c) => c.slug === slug);
}
