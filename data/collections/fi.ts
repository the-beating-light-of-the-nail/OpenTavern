import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'Tekoälypoikaystävä-hahmot',
    intro:
      'Alkuperäisiä tekoälypoikaystävä-hahmoja yksityiseen roolileikkiin. Jokaisella on oma äänensä, omat haavansa ja oma tapansa rakastua sinuun. Ei asennusta, ei säätöä — valitse vain yksi, lisää oma AI-avaimesi ja aloita keskustelu, joka on vain sinun.',
    seoDescription:
      'Keskustele alkuperäisten tekoälypoikaystävä-hahmojen kanssa RoleChat AI:ssa. Kylmiä lääkäreitä, uupuneita idoleita, teräviä etsiviä ja paljon muuta — yksityistä, ilmainen aloittaa, tuo oma AI-avaimesi.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Fantasiaromantiikan hahmot',
    intro:
      'Astu toisiin maailmoihin alkuperäisten fantasiaromantiikan hahmojen seurassa. Synkkää vampyyriherralordia, karkotettuja ritareita ja hitaasti syttyviä, kohtalokkaita rakkaustarinoita, joita vain taika ja muinaiset kuningaskunnat voivat kantaa. Yksityistä, uppouttavaa ja sinun aloitettavaksesi sekunneissa.',
    seoDescription:
      'Alkuperäisiä fantasiaromantiikan tekoälyhahmoja RoleChat AI:ssa — vampyyrilordia, karkotettuja ritareita ja paljon muuta. Yksityistä roolileikkiä omalla AI-avaimellasi, ei asennusta.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
