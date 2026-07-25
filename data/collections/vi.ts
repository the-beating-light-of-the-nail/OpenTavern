import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'Nhân vật bạn trai AI',
    intro:
      'Những nhân vật bạn trai AI do chính chúng tôi sáng tạo, dành cho roleplay riêng tư. Mỗi chàng trai đều có giọng nói riêng, những vết thương riêng và cách rung động vì bạn rất riêng của anh ấy. Không cần cài đặt, không cần thiết lập — chỉ cần chọn một người, thêm AI key của bạn và bắt đầu một cuộc trò chuyện chỉ thuộc về riêng mình bạn.',
    seoDescription:
      'Trò chuyện với những nhân vật bạn trai AI gốc trên RoleChat AI — bác sĩ lạnh lùng, thần tượng kiệt sức, thám tử sắc sảo và hơn thế nữa. Riêng tư, bắt đầu miễn phí, dùng AI key của chính bạn.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'Nhân vật lãng mạn kỳ ảo',
    intro:
      'Bước vào những thế giới khác cùng các nhân vật lãng mạn kỳ ảo do chính chúng tôi sáng tạo. Những lãnh chúa ma cà rồng u buồn, những hiệp sĩ lưu vong, và những mối tình nảy chậm, định mệnh nghịch cảnh mà chỉ phép thuật và những vương quốc cổ mới ôm trọn được. Riêng tư, cuốn hút và chỉ mất vài giây để bắt đầu.',
    seoDescription:
      'Những nhân vật AI lãng mạn kỳ ảo gốc trên RoleChat AI — lãnh chúa ma cà rồng, hiệp sĩ lưu vong và hơn thế nữa. Roleplay riêng tư với AI key của bạn, không cần cài đặt.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
