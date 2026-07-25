import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'Karakter AI Pacar',
    intro:
      'Karakter AI pacar orisinal untuk roleplay pribadi. Masing-masing punya caranya sendiri bicara, luka batinnya sendiri, dan cara jatuh cintanya sendiri kepadamu. Tanpa instalasi, tanpa pengaturan — pilih satu, masukkan AI key-mu, dan mulailah percakapan yang hanya milikmu berdua.',
    seoDescription:
      'Ngobrol dengan karakter AI pacar orisinal di RoleChat AI. Dokter yang dingin, idola yang kelelahan, detektif yang tajam, dan masih banyak lagi — privat, gratis untuk mulai, bawa AI key-mu sendiri.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Karakter Fantasi Romantis',
    intro:
      'Melangkahlah ke dunia lain bersama karakter fantasi romantis orisinal. Tuan-tuan vampir yang murung, para kesatria terbuang, dan kisah cinta yang perlahan menyala namun lintas bintang — cerita yang hanya bisa ditampung oleh sihir dan kerajaan-kerajaan kuno. Privat, mendalam, dan bisa kamu mulai dalam hitungan detik.',
    seoDescription:
      'Karakter AI fantasi romantis orisinal di RoleChat AI — tuan vampir, kesatria terbuang, dan lainnya. Roleplay privat dengan AI key-mu sendiri, tanpa perlu instalasi.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
