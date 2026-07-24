/**
 * 数据层国际化统一入口。
 *
 * 按 $i18n.locale 动态返回对应语言的 characters / guides / collections 数据。
 * - 完整翻译 locale:en / zh-CN / zh-TW(各 locale 一份独立数据文件)
 * - 其余 locale(es/ar/pt/ru/fr/de):未建文件,由 pick() 显式 fallback 到 en,
 *   避免出现"空白 / 报错",保持 UI 可用(方案四收口)。
 *
 * SSG 兼容:所有 locale 文件均为静态 import,Vite 构建时全量打包,
 * 预渲染 /zh-CN/characters 时 computed 正确解析到中文数据,无需改 prerender 配置。
 * 响应式:useXxx() 返回 computed,客户端切换语言即时重新渲染。
 *
 * 消费方约定:
 * - 组件 setup 内取列表 → useCharacters() / useGuides() / useCollections()
 * - 组件 setup 内按 slug 取单个 → getXxxBySlug(slug, locale.value)
 * - 非组件上下文(插件等)→ 传显式 locale 参数
 */
import type { CharacterSeo, GuideSeo, CollectionSeo } from '~/types/seo';
import { characters as enCharacters } from './characters/en';
import { guides as enGuides } from './guides/en';
import { collections as enCollections } from './collections/en';

// 已翻译 locale 的数据文件。新增翻译后在此注册 + 加入下方 MAP。
import { characters as zhCNCharacters } from './characters/zh-CN';
import { guides as zhCNGuides } from './guides/zh-CN';
import { collections as zhCNCollections } from './collections/zh-CN';
import { guides as zhTWGuides } from './guides/zh-TW';
import { collections as zhTWCollections } from './collections/zh-TW';
import { characters as zhTWCharacters } from './characters/zh-TW';

const CHARACTER_MAP: Record<string, CharacterSeo[]> = {
  en: enCharacters,
  'zh-CN': zhCNCharacters,
  'zh-TW': zhTWCharacters,
};

const GUIDE_MAP: Record<string, GuideSeo[]> = {
  en: enGuides,
  'zh-CN': zhCNGuides,
  'zh-TW': zhTWGuides,
};

const COLLECTION_MAP: Record<string, CollectionSeo[]> = {
  en: enCollections,
  'zh-CN': zhCNCollections,
  'zh-TW': zhTWCollections,
};

/** 取 map 中对应 locale 的数据;locale 未命中时显式 fallback 到 en */
function pick<T>(map: Record<string, T>, locale: string): T {
  return map[locale] ?? map.en;
}

/** 当前 locale 的角色列表(响应式,在 setup 中使用) */
export function useCharacters() {
  const { $i18n } = useNuxtApp();
  return computed(() => pick(CHARACTER_MAP, $i18n.locale.value));
}

/** 当前 locale 的指南列表(响应式) */
export function useGuides() {
  const { $i18n } = useNuxtApp();
  return computed(() => pick(GUIDE_MAP, $i18n.locale.value));
}

/** 当前 locale 的合集列表(响应式) */
export function useCollections() {
  const { $i18n } = useNuxtApp();
  return computed(() => pick(COLLECTION_MAP, $i18n.locale.value));
}

/** 按 slug + locale 查单个角色(locale 未命中回退 en) */
export function getCharacterBySlug(slug: string, locale = 'en'): CharacterSeo | undefined {
  return pick(CHARACTER_MAP, locale).find((c) => c.slug === slug);
}

/** 按 slug + locale 查单个指南 */
export function getGuideBySlug(slug: string, locale = 'en'): GuideSeo | undefined {
  return pick(GUIDE_MAP, locale).find((g) => g.slug === slug);
}

/** 按 slug + locale 查单个合集 */
export function getCollectionBySlug(slug: string, locale = 'en'): CollectionSeo | undefined {
  return pick(COLLECTION_MAP, locale).find((c) => c.slug === slug);
}
