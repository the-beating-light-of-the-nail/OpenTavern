import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'AI-pojkvännskaraktärer',
    intro:
      'Originella AI-pojkvännskaraktärer för privata rollspel. Var och en har sin egen röst, sina egna sår och sitt eget sätt att bli kär i dig. Ingen installation, ingen konfiguration – välj en, lägg till din AI-nyckel och börja ett samtal som är bara ditt.',
    seoDescription:
      'Chatta med originella AI-pojkvännskaraktärer på RoleChat AI. Kalla läkare, utmattade idoler, skarpa detektiver och fler – privat, gratis att komma igång med, ta med din egen AI-nyckel.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Fantasyromantiska karaktärer',
    intro:
      'Kliv in i andra världar med originella fantasyromantiska karaktärer. Dystrande vampyrlorder, förvisade riddare och de långsamt glödande, ödesdigra kärlekshistorier som bara magi och uråldriga kungariken kan rymma. Privat, suggestivt och redo att börjas på några sekunder.',
    seoDescription:
      'Originella fantasyromantiska AI-karaktärer på RoleChat AI – vampyrlorder, förvisade riddare och fler. Privata rollspel med din egen AI-nyckel, ingen installation krävs.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
