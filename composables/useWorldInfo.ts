import { useAppStore } from '~/stores/app';
import { WI_POS } from '~/utils/prompts';
import { replacePlaceholders } from '~/utils/chat-helpers';

export interface WIEntry {
  uid?: string | number;
  key?: string[];
  keysecondary?: string[];
  content?: string;
  comment?: string;
  order?: number;
  disable?: boolean;
  constant?: boolean;
  selectiveLogic?: number;
  position?: number;
  depth?: number;
  role?: number | string;
  probability?: number;
  useProbability?: boolean;
  group?: string;
  groupWeight?: number;
  useGroupScoring?: boolean;
  prioritize?: boolean;
  scanDepth?: number;
  caseSensitive?: boolean;
  matchWholeWords?: boolean;
  excludeRecursion?: boolean;
  preventRecursion?: boolean;
  sticky?: number;
  cooldown?: number;
  delay?: number;
  _sourceWorldBookId?: string;
  [k: string]: any;
}

export interface WIActivationResult {
  entries: WIEntry[];
  byPosition: Record<number, WIEntry[]>;
  outlets: Record<string, WIEntry[]>;
}

/**
 * World Info 系统：条目激活 + 位置注入 + 预算控制。
 * 移植自原版 getActivatedWorldInfo + injectWorldInfoIntoSystem 的核心逻辑。
 */
export function useWorldInfo() {
  const store = useAppStore();

  /** 从会话关联的世界书收集全部条目 */
  function collectEntries(conv: any): WIEntry[] {
    const entries: WIEntry[] = [];
    if (!conv) return entries;
    // 全局世界书
    if (Array.isArray(conv.worldBookIds)) {
      for (const wbId of conv.worldBookIds) {
        const wb = store.worldBooks[wbId];
        if (wb?.entries) {
          for (const uid of Object.keys(wb.entries)) {
            entries.push({ ...wb.entries[uid], uid });
          }
        }
      }
    }
    // legacy 内嵌
    if (conv.worldInfo?.entries) {
      for (const uid of Object.keys(conv.worldInfo.entries)) {
        entries.push({ ...conv.worldInfo.entries[uid], uid });
      }
    }
    return entries;
  }

  /** 构建扫描文本（最近 scanDepth 条消息 + 可选的额外匹配源） */
  function buildScanText(conv: any, scanDepth: number): string {
    const msgs = (conv?.messages || []).filter((m: any) => m.role !== 'system');
    const recent = msgs.slice(-Math.max(1, scanDepth));
    let text = recent.map((m: any) => String(m.content || '')).join('\n');
    // 额外匹配源
    const char = conv?.character;
    if (char) {
      if (char.description) text += '\n' + char.description;
      if (char.personality) text += '\n' + char.personality;
      if (char.scenario) text += '\n' + char.scenario;
    }
    return text.toLowerCase();
  }

  /** 关键词匹配（支持正则 / 全词 / 大小写敏感） */
  function matchesKeys(keys: string[], scanText: string, caseSensitive: boolean, wholeWords: boolean): boolean {
    if (!keys || keys.length === 0) return false;
    return keys.some((k) => {
      if (!k) return false;
      // 正则：/pattern/flags
      if (k.startsWith('/') && k.lastIndexOf('/') > 0) {
        const lastSlash = k.lastIndexOf('/');
        const pattern = k.slice(1, lastSlash);
        const flags = k.slice(lastSlash + 1) || (caseSensitive ? '' : 'i');
        try { return new RegExp(pattern, flags).test(scanText); } catch { return false; }
      }
      const key = caseSensitive ? k : k.toLowerCase();
      if (wholeWords) {
        return new RegExp('\\b' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', caseSensitive ? '' : 'i').test(scanText);
      }
      return scanText.includes(key);
    });
  }

  /** 概率检查 */
  function passesProbability(e: WIEntry): boolean {
    if (!e.useProbability) return true;
    const prob = typeof e.probability === 'number' ? e.probability : 100;
    return Math.random() * 100 < prob;
  }

  /** 角色过滤 */
  function passesCharFilter(e: any, charName: string, charTags: string[]): boolean {
    const names = e.charNames ? String(e.charNames).split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    const tags = e.charTags ? String(e.charTags).split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    if (names.length === 0 && tags.length === 0) return true;
    const isExclude = !!e.charExclude;
    const nameHit = names.length === 0 || names.some((n: string) => charName.toLowerCase().includes(n.toLowerCase()));
    const tagHit = tags.length === 0 || tags.some((t: string) => charTags.includes(t));
    const hit = nameHit && tagHit;
    return isExclude ? !hit : hit;
  }

  /** 激活 World Info（核心入口） */
  function activate(conv: any): WIActivationResult {
    const allEntries = collectEntries(conv).filter((e) => e && !e.disable);
    if (allEntries.length === 0) return { entries: [], byPosition: {}, outlets: {} };

    const charName = conv?.character?.name || '';
    const charTags = conv?.character?.tags || [];
    const scanText = buildScanText(conv, 4);
    let activated: WIEntry[] = [];

    for (const e of allEntries) {
      const cs = e.caseSensitive === true;
      const ww = e.matchWholeWords === true;
      const perEntryScan = (e.scanDepth != null ? e.scanDepth : 4) !== 4
        ? buildScanText(conv, e.scanDepth ?? 4)
        : scanText;
      const keyHit = matchesKeys(e.key || [], perEntryScan, cs, ww);
      const secHit = matchesKeys(e.keysecondary || [], perEntryScan, cs, ww);
      let should = false;
      if (e.constant) should = true;
      else if (keyHit && (e.keysecondary?.length ? secHit : true)) {
        const logic = e.selectiveLogic || 0;
        if (logic === 0 || logic === 1) should = true; // AND ANY / AND ALL
        else if (logic === 2 || logic === 3) should = !secHit; // NOT ANY / NOT ALL
      }
      if (should && passesCharFilter(e, charName, charTags) && passesProbability(e)) {
        activated.push(e);
      }
    }

    // 递归激活（一层）
    const rec: WIEntry[] = [];
    for (const act of activated) {
      if (act.preventRecursion) continue;
      for (const cand of allEntries) {
        if (activated.includes(cand) || rec.includes(cand) || cand.excludeRecursion) continue;
        const keysJoined = (cand.key || []).join(' ').toLowerCase();
        if (act.content?.toLowerCase().includes(keysJoined) && keysJoined) {
          if (passesCharFilter(cand, charName, charTags) && passesProbability(cand)) {
            (cand as any).isRecursive = true;
            rec.push(cand);
          }
        }
      }
    }
    activated = [...activated, ...rec];

    // 去重
    const seen = new Set<string>();
    activated = activated.filter((e) => {
      const id = String(e.uid);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    // 分组竞争
    const groups: Record<string, WIEntry[]> = {};
    activated.forEach((e) => { if (e.group) (groups[e.group] = groups[e.group] || []).push(e); });
    for (const g of Object.keys(groups)) {
      const gents = groups[g];
      if (gents.length < 2) continue;
      activated = activated.filter((e) => e.group !== g);
      const winner = gents.some((e) => e.useGroupScoring)
        ? gents.sort((a, b) => ((b.key?.length || 0) + (b.keysecondary?.length || 0)) - ((a.key?.length || 0) + (a.keysecondary?.length || 0)))[0]
        : gents.sort((a, b) => (b.order || 0) - (a.order || 0))[0];
      activated.push(winner);
    }

    // 按 order 排序
    activated.sort((a, b) => (a.order || 100) - (b.order || 100));

    // Token 预算控制
    if (store.settings.worldInfoBudgetEnabled) {
      const maxBudget = store.settings.worldInfoBudget || 2048;
      let usedTokens = 0;
      activated = activated.filter((e) => {
        const tokens = Math.ceil(String(e.content || '').length / 4); // 粗估
        if (usedTokens + tokens > maxBudget && !e._ignoreBudget) return false;
        usedTokens += tokens;
        return true;
      });
    }

    // 按 position 分桶
    const byPosition: Record<number, WIEntry[]> = {};
    const outlets: Record<string, WIEntry[]> = {};
    for (const e of activated) {
      const pos = typeof e.position === 'number' ? e.position : 1;
      if (pos === WI_POS.OUTLET) {
        const name = e.outletName || 'default';
        (outlets[name] = outlets[name] || []).push(e);
      } else {
        (byPosition[pos] = byPosition[pos] || []).push(e);
      }
    }

    return { entries: activated, byPosition, outlets };
  }

  /** 将 WI 按位置注入 systemParts（原版 injectWorldInfoIntoSystem） */
  function injectIntoSystem(systemParts: string[], byPosition: Record<number, WIEntry[]>, charName: string, userName: string): string[] {
    if (!byPosition) return systemParts;
    const joinEntries = (list?: WIEntry[]) =>
      (list || []).map((e) => replacePlaceholders(e.content || '', charName, userName)).join('\n\n');

    const before = joinEntries(byPosition[WI_POS.BEFORE_CHAR]);
    const after = joinEntries(byPosition[WI_POS.AFTER_CHAR]);
    const beforeEx = joinEntries(byPosition[WI_POS.BEFORE_EX]);
    const afterEx = joinEntries(byPosition[WI_POS.AFTER_EX]);
    const topAN = joinEntries(byPosition[WI_POS.TOP_AN]);
    const botAN = joinEntries(byPosition[WI_POS.BOTTOM_AN]);

    if (before) systemParts.unshift(before);
    if (after) systemParts.push(after);
    if (beforeEx) systemParts.push('Example context (lore):\n' + beforeEx);
    if (afterEx) systemParts.push('Example context (lore):\n' + afterEx);
    if (topAN || botAN) {
      const an: string[] = [];
      if (topAN) an.push(topAN);
      if (botAN) an.push(botAN);
      systemParts.push("[Author's Note / World Lore]\n" + an.join('\n'));
    }
    return systemParts;
  }

  return { activate, injectIntoSystem, collectEntries };
}
