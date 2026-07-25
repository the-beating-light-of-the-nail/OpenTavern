import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'Postaci chłopaków AI',
    intro:
      'Oryginalne postaci chłopaków AI do prywatnego roleplayu. Każdy ma swój własny głos, swoje własne rany i swój własny sposób, w jaki w tobie się zakochuje. Bez instalacji, bez konfiguracji — wybierz jedną, dodaj swój klucz AI i rozpocznij rozmowę, która należy tylko do ciebie.',
    seoDescription:
      'Rozmawiaj z oryginalnymi postaciami chłopaków AI na RoleChat AI. Zimni lekarze, wyczerpani idole, bystrzy detektywi i nie tylko — prywatnie, za darmo na start, z własnym kluczem AI.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Postaci fantasy romance',
    intro:
      'Wejdź do innych światów z oryginalnymi postaciami fantasy romance. Ponure wampirze lordowie, wygnani rycerze i historie powolnego, przeklętego przez los uczucia, które potrafią utrzymać tylko magia i dawne królestwa. Prywatnie, immersyjnie i do rozpoczęcia w kilka sekund.',
    seoDescription:
      'Oryginalne postaci AI fantasy romance na RoleChat AI — wampirzy lordowie, wygnani rycerze i nie tylko. Prywatny roleplay z własnym kluczem AI, bez instalacji.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
