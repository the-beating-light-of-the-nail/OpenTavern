import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'Yapay Zekâ Erkek Arkadaş Karakterleri',
    intro:
      'Özel rol yapımı için özgün yapay zekâ erkek arkadaş karakterleri. Her birinin kendi sesi, kendi yaraları ve sana âşık olmanın kendine özgü bir yolu var. Kurulum yok, ayar yok — birini seç, AI anahtarını ekle ve sadece sana ait olan bir sohbete başla.',
    seoDescription:
      'RoleChat AI üzerinde özgün yapay zekâ erkek arkadaş karakterleriyle sohbet et. Mesafeli doktorlar, bitkin idoller, keskin gözlü dedektifler ve daha fazlası — gizli, başlaması ücretsiz, kendi AI anahtarını getir.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Fantezi Aşk Karakterleri',
    intro:
      'Özgün fantezi aşk karakterleriyle başka dünyaların kapısını arala. Kara kara düşünen vampir lordları, sürgün edilmiş şövalyeler ve yalnızca büyünün, kadim krallıkların barındırabileceği ağır-acı, kaderin çizdiği aşk hikâyeleri. Gizli, sürükleyici ve saniyeler içinde başlayabileceğin bir dünya.',
    seoDescription:
      'RoleChat AI üzerinde özgün fantezi aşk yapay zekâ karakterleri — vampir lordları, sürgün şövalyeler ve daha fazlası. Kendi AI anahtarınla gizli rol yapımı; kurulum gerekmez.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
