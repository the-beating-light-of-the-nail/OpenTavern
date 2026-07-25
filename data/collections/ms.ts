import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'Watak Teman Lelaki AI',
    intro:
      'Watak teman lelaki AI asli untuk roleplay peribadi. Setiap satu ada suaranya sendiri, lukanya sendiri, dan caranya tersendiri untuk jatuh cinta pada anda. Tak perlu pasang apa-apa, tak perlu setup — pilih satu, masukkan kunci AI anda, dan mulakan perbualan yang hanya milik anda berdua.',
    seoDescription:
      'Sembang dengan watak teman lelaki AI asli di RoleChat AI. Doktor dingin, idola yang letih, detektif tajam dan banyak lagi — peribadi, percuma untuk bermula, bawa kunci AI sendiri.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Watak Percintaan Fantasi',
    intro:
      'Melangkah ke dunia lain bersama watak percintaan fantasi asli. Raja vampire murung, kesateria yang dibuang negeri, dan kisah cinta perlahan-lahan bakar yang penuh takdir — hanya sihir dan kerajaan lama yang mampu menampungnya. Peribadi, mendalam, dan sedia bermula dalam beberapa saat.',
    seoDescription:
      'Watak AI percintaan fantasi asli di RoleChat AI — raja vampire, kesateria buangan dan banyak lagi. Roleplay peribadi dengan kunci AI sendiri, tak perlu pasang apa-apa.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
