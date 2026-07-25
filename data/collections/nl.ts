import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'AI-vriendpersonages',
    intro:
      'Originele AI-vriendpersonages voor privé-rollenspellen. Elk met een eigen stem, eigen littekens en een eigen manier om verliefd op je te worden. Geen installatie, geen gedoe — kies er een, voeg je AI-sleutel toe en begin een gesprek dat alleen van jou is.',
    seoDescription:
      'Chat met originele AI-vriendpersonages op RoleChat AI. Kille artsen, uitgeputte idolen, scherpe rechercheurs en meer — privé, gratis te starten, met je eigen AI-sleutel.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Fantasy-romancepersonages',
    intro:
      'Betreed andere werelden met originele fantasy-romancepersonages. Norse vampierheren, verbannen ridders en de trage, noodlottige liefdesverhalen die alleen magie en oude koninkrijken kunnen herbergen. Privé, meeslepend en binnen enkele seconden te beginnen.',
    seoDescription:
      'Originele fantasy-romance AI-personages op RoleChat AI — vampierheren, verbannen ridders en meer. Privé-rollenspel met je eigen AI-sleutel, geen installatie vereist.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
