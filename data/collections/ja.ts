import type { CollectionSeo } from '~/types/seo';

/**
 * 原创角色合集（SEO 静态数据）。
 * characterSlugs 引用 data/characters.ts 中的 slug。
 */
export const collections: CollectionSeo[] = [
  {
    slug: 'ai-boyfriend',
    title: 'AIボーイフレンド キャラクター',
    intro:
      '二人きりのロールプレイを楽しむための、オリジナルAIボーイフレンドキャラクター集。彼それぞれの声、それぞれの心の傷、そしてあなただけに心を開いていく独自の恋の形。インストールも面倒な設定も一切不要。お気に入りを選んでAIキーを追加するだけで、あなただけの会話がすぐに始まります。',
    seoDescription:
      'RoleChat AIでオリジナルAIボーイフレンドキャラクターと会話しよう。クールな医師、疲れを抱えたアイドル、鋭い探偵など多彩な彼があなたを待つ。完全プライベート、無料で始められて、AIキーは自分のものを持込みOK。',
    characterSlugs: ['cold-doctor-boyfriend', 'the-smiling-idol', 'the-sharp-tongued-detective', 'the-gentle-librarian'],
  },
  {
    slug: 'fantasy-romance',
    title: 'ファンタジーロマンス キャラクター',
    intro:
      '異世界へ足を踏み入れよう。オリジナルのファンタジーロマンスキャラクターたちがあなたを待っています。闇を抱えた吸血鬼の領主、追放された騎士、そして魔法と古き王国にしか宿せない、ゆっくりと育ち、星の下で結ばれる恋の物語。完全プライベート、没入感たっぷり、数秒で始められるあなただけの物語。',
    seoDescription:
      'RoleChat AIでオリジナルのファンタジーロマンスAIキャラクターに出会おう。吸血鬼の領主、追放された騎士などが勢揃い。自分のAIキーで楽しむプライベートロールプレイ、インストール不要。',
    characterSlugs: ['the-brooding-vampire-lord', 'the-exiled-knight', 'the-gentle-librarian'],
  },
];
