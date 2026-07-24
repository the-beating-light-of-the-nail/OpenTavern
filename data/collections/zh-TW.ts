import type { CollectionSeo } from '~/types/seo';

/**
 * 原創角色合集(SEO 靜態資料)—— 繁體中文。
 * characterSlugs / slug 等 ID 欄位必須與 en.ts 完全一致(跨 locale 不可變)。
 * 僅翻譯展示文字:title / intro / seoDescription。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'AI 男友角色',
    intro:
      '為私密角色扮演打造的原創 AI 男友角色。每個人都有自己的聲音、自己的傷口、自己愛上你的方式。無需安裝、無需設定——選一個,加上你的 AI Key,開啟一段只屬於你的對話。',
    seoDescription:
      '在 RoleChat AI 上與原創 AI 男友角色對話。冷面醫生、疲憊偶像、毒舌偵探等——私密、免費開始、自備 AI Key。',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: '奇幻戀愛角色',
    intro:
      '與原創奇幻戀愛角色一起踏入異世界。陰鬱的吸血鬼領主、流放的騎士,以及只有魔法與古老王國才能承載的、慢熱的、宿命般的愛情故事。私密、沉浸,幾秒即可開始。',
    seoDescription:
      'RoleChat AI 上的原創奇幻戀愛 AI 角色——吸血鬼領主、流放騎士等。私密角色扮演,自備 AI Key,無需安裝。',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
