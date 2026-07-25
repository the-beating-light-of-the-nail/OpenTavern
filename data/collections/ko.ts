import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'AI 남자친구 캐릭터',
    intro:
      '프라이빗 롤플레이를 위한 오리지널 AI 남자친구 캐릭터. 저마다의 말투, 저마다의 상처, 그리고 당신에게 빠져드는 저마다의 방식을 가졌어요. 설치도 설정도 필요 없어요 — 하나 골라 AI 키만 연결하면, 오직 당신만의 대화가 시작됩니다.',
    seoDescription:
      'RoleChat AI에서 오리지널 AI 남자친구 캐릭터와 대화해 보세요. 차가운 의사, 지친 아이돌, 날카로운 형사까지 — 프라이빗, 무료로 시작, 본인 AI 키 사용.',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: '판타지 로맨스 캐릭터',
    intro:
      '오리지널 판타지 로맨스 캐릭터와 함께 다른 세계로 들어가 보세요. 음침한 뱀파이어 영주, 추방된 기사, 그리고 오직 마법과 고대 왕국만이 품을 수 있는, 서서히 타오르고 엇갈리는 사랑 이야기. 프라이빗하고 몰입감 있으며, 몇 초면 시작할 수 있어요.',
    seoDescription:
      'RoleChat AI의 오리지널 판타지 로맨스 AI 캐릭터 — 뱀파이어 영주, 추방된 기사 등. 본인 AI 키로 즐기는 프라이빗 롤플레이, 설치 불필요.',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
