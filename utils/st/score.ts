/**
 * 角色卡完整度评分（规则式，zoiewu STEP3 思路）：
 * 0-100 分 + 按权重排序的补强建议（建议文案走 i18n key cs_score_sug_*）。
 */

import type { CharacterCard } from './types';

export interface ScoreSuggestion {
  /** i18n key */
  key: string;
  /** 缺失项权重（建议排序依据） */
  weight: number;
}

export interface ScoreResult {
  score: number;
  suggestions: ScoreSuggestion[];
}

interface Check {
  key: string;
  weight: number;
  /** 满分条件 */
  full: (card: CharacterCard) => boolean;
  /** 部分分条件（可空） */
  partial?: (card: CharacterCard) => boolean;
}

const CHECKS: Check[] = [
  { key: 'name', weight: 8, full: (c) => !!c.data.name.trim() },
  {
    key: 'description', weight: 22,
    full: (c) => c.data.description.trim().length >= 200,
    partial: (c) => c.data.description.trim().length >= 50,
  },
  { key: 'personality', weight: 10, full: (c) => c.data.personality.trim().length >= 20 },
  { key: 'scenario', weight: 8, full: (c) => c.data.scenario.trim().length >= 20 },
  {
    key: 'first_mes', weight: 22,
    full: (c) => c.data.first_mes.trim().length >= 100,
    partial: (c) => c.data.first_mes.trim().length >= 30,
  },
  { key: 'mes_example', weight: 10, full: (c) => c.data.mes_example.trim().length >= 60 },
  { key: 'alternate_greetings', weight: 6, full: (c) => (c.data.alternate_greetings || []).some((g) => g.trim()) },
  { key: 'tags', weight: 4, full: (c) => (c.data.tags || []).length > 0 },
  { key: 'book', weight: 6, full: (c) => (c.data.character_book?.entries || []).length > 0 },
  { key: 'creator_notes', weight: 4, full: (c) => !!c.data.creator_notes?.trim() },
];

export function scoreCard(card: CharacterCard): ScoreResult {
  let score = 0;
  const suggestions: ScoreSuggestion[] = [];
  for (const check of CHECKS) {
    if (check.full(card)) {
      score += check.weight;
    } else {
      if (check.partial && check.partial(card)) score += Math.round(check.weight / 2);
      suggestions.push({ key: `cs_score_sug_${check.key}`, weight: check.weight });
    }
  }
  suggestions.sort((a, b) => b.weight - a.weight);
  return { score: Math.min(100, score), suggestions };
}
