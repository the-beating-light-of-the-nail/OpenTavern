import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'Personaggi fidanzato AI',
    intro:
      'Personaggi fidanzato AI originali per roleplay privato. Ognuno ha la sua voce, le sue ferite e il suo modo di innamorarsi di te. Niente installazione, niente configurazione: scegline uno, aggiungi la tua chiave AI e inizia una conversazione solo vostra.',
    seoDescription:
      'Chatta con personaggi fidanzato AI originali su RoleChat AI. Medici freddi, idoli esausti, detective taglienti e altro ancora — privato, gratuito per iniziare, con la tua chiave AI.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Personaggi romance fantasy',
    intro:
      'Varca la soglia di altri mondi con personaggi romance fantasy originali. Signori dei vampiri tormentati, cavalieri in esilio e storie d\'amore lente, destinate a scontrarsi con le stelle, che solo la magia e gli antichi regni possono custodire. Privato, immersivo e pronto per te in pochi secondi.',
    seoDescription:
      'Personaggi AI romance fantasy originali su RoleChat AI — signori dei vampiri, cavalieri in esilio e altro ancora. Roleplay privato con la tua chiave AI, senza alcuna installazione.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
