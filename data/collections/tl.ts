import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'Mga Character ng AI Boyfriend',
    intro:
      'Orihinal na mga AI boyfriend character para sa pribadong roleplay. Magkakaiba ang boses ng bawat isa, may kanya-kanyang pinagdadaanan, at may sariling paraan ng pagkahulog sa iyo. Walang kailangang i-install, walang setup — pumili ka lang, ilagay ang iyong AI key, at simulan ang usapan na sa iyo lang nagtatapos.',
    seoDescription:
      'Makipag-chat sa mga orihinal na AI boyfriend character sa RoleChat AI. Mga lamig na doktor, pagod na idol, matalas na detective, at marami pang iba — pribado, libre simulan, gamit ang sariling AI key.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Mga Character ng Fantasy Romance',
    intro:
      'Tumapak sa ibang mundo kasama ang mga orihinal na fantasy romance character. Mga malungkot na vampire lord, mga palabang knight, at ang mga mabagal-ngunit-tunay na pag-ibig na tadhana ang tanging mahika at mga sinaunang kaharian lang ang kayang dalhin. Pribado, nakaka-engganyo, at kayang simulan sa ilang segundo.',
    seoDescription:
      'Orihinal na fantasy romance AI character sa RoleChat AI — mga vampire lord, palabang knight, at marami pang iba. Pribadong roleplay gamit ang sarili mong AI key, walang kailangang i-install.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
