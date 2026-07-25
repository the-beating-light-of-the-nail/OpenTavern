import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'AI-kjæreste-karakterer',
    intro:
      'Originale AI-kjæreste-karakterer for privat rollespill. Hver og en har sin egen stemme, sine egne sår og sin egen måte å falle for deg på. Ingen installasjon, ingen oppsett – bare velg en, legg til din AI-nøkkel, og start en samtale som utelukkende er din egen.',
    seoDescription:
      'Chat med originale AI-kjæreste-karakterer på RoleChat AI. Kalde leger, utslitte idoler, skarpe etterforskere og mer – privat, gratis å starte, bruk din egen AI-nøkkel.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Fantasy-romantikk-karakterer',
    intro:
      'Trekk inn i andre verdener med originale fantasy-romantikk-karakterer. Tungsindige vampyrherrer, landsforviste riddere og de langsomt ulmende, skjebnebestemte kjærlighetshistoriene som bare magi og gamle kongeriker kan romme. Privat, oppslukende, og ditt å begynne på i løpet av få sekunder.',
    seoDescription:
      'Originale fantasy-romantikk AI-karakterer på RoleChat AI – vampyrherrer, landsforviste riddere og mer. Privat rollespill med din egen AI-nøkkel, ingen installasjon nødvendig.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
