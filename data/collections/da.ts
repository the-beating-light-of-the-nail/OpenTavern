import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'AI-kærestkarakterer',
    intro:
      'Originale AI-kærestkarakterer til privat rollespil. Hver enkelt har sin egen stemme, sine egne sår og sin egen måde at falde for dig på. Ingen installation, intet opsat – vælg blot en, tilføj din AI-nøgle, og start en samtale, der kun er din.',
    seoDescription:
      'Chat med originale AI-kærestkarakterer på RoleChat AI. Kolde læger, udmattede idoler, skarpe detektiver og mange flere – privat, gratis at gå i gang med, og med din egen AI-nøgle.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Fantasy-romantikkarakterer',
    intro:
      'Træd ind i andre verdener med originale fantasy-romantikkarakterer. Tungsindige vampyrherrer, landsforviste riddere og de langsomt ulmende, skæbnebestemte kærlighedshistorier, som kun magt og gamle kongeriger kan bære. Privat, fordybende og klar for dig på få sekunder.',
    seoDescription:
      'Originale fantasy-romantik-AI-karakterer på RoleChat AI – vampyrherrer, landsforviste riddere og mange flere. Privat rollespil med din egen AI-nøgle, uden installation.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
