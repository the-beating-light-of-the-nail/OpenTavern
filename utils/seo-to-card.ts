import type { CharacterSeo } from '~/types/seo';

/**
 * SEO 角色 → 聊天 App 可消费的角色卡条目。
 * 供 /app?character=<slug> query 入口与 LibraryView 的 Start Chat 按钮共用。
 *
 * 聊天 store 的 createConversation 读取 entry.data（平坦角色卡：name/first_mes/...），
 * entry.id 存在时写入 conv.characterId，便于「复用已有会话」。
 */
export function seoCharacterToCardEntry(c: CharacterSeo): { id: string; data: Record<string, any> } {
  return {
    id: `seo-${c.slug}`,
    data: {
      name: c.name,
      description: c.description,
      personality: c.personality,
      scenario: c.scenario || c.relationshipSetup,
      first_mes: c.openingMessage,
      mes_example: '',
      system_prompt: '',
      post_history_instructions: '',
      tags: c.tags,
      creator_notes: `Original character on RoleChat AI. ${c.tagline}`,
      alternate_greetings: [],
    },
  };
}

/**
 * 查找该 SEO 角色是否已有会话（按 characterId === 'seo-<slug>'）。
 * 有则返回会话 id，无则返回 null —— 用于 Start Chat 复用而非重复新建。
 */
export function findExistingConvForCharacter(store: any, slug: string): string | null {
  const seoId = `seo-${slug}`;
  const order: string[] = store.conversationOrder || [];
  for (const id of order) {
    const conv = store.conversations?.[id];
    if (conv && conv.characterId === seoId) return id;
  }
  return null;
}
