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

// 新增语种内容（由原生重写生成，2026-07；AST 外科式注入自 en.ts）
import { characters as jaCharacters } from './characters/ja';
import { guides as jaGuides } from './guides/ja';
import { collections as jaCollections } from './collections/ja';
import { characters as koCharacters } from './characters/ko';
import { guides as koGuides } from './guides/ko';
import { collections as koCollections } from './collections/ko';
import { characters as itCharacters } from './characters/it';
import { guides as itGuides } from './guides/it';
import { collections as itCollections } from './collections/it';
import { characters as nlCharacters } from './characters/nl';
import { guides as nlGuides } from './guides/nl';
import { collections as nlCollections } from './collections/nl';
import { characters as svCharacters } from './characters/sv';
import { guides as svGuides } from './guides/sv';
import { collections as svCollections } from './collections/sv';
import { characters as noCharacters } from './characters/no';
import { guides as noGuides } from './guides/no';
import { collections as noCollections } from './collections/no';
import { characters as daCharacters } from './characters/da';
import { guides as daGuides } from './guides/da';
import { collections as daCollections } from './collections/da';
import { characters as fiCharacters } from './characters/fi';
import { guides as fiGuides } from './guides/fi';
import { collections as fiCollections } from './collections/fi';
import { characters as plCharacters } from './characters/pl';
import { guides as plGuides } from './guides/pl';
import { collections as plCollections } from './collections/pl';
import { characters as trCharacters } from './characters/tr';
import { guides as trGuides } from './guides/tr';
import { collections as trCollections } from './collections/tr';
import { characters as hiCharacters } from './characters/hi';
import { guides as hiGuides } from './guides/hi';
import { collections as hiCollections } from './collections/hi';
import { characters as idCharacters } from './characters/id';
import { guides as idGuides } from './guides/id';
import { collections as idCollections } from './collections/id';
import { characters as viCharacters } from './characters/vi';
import { guides as viGuides } from './guides/vi';
import { collections as viCollections } from './collections/vi';
import { characters as thCharacters } from './characters/th';
import { guides as thGuides } from './guides/th';
import { collections as thCollections } from './collections/th';
import { characters as msCharacters } from './characters/ms';
import { guides as msGuides } from './guides/ms';
import { collections as msCollections } from './collections/ms';
import { characters as tlCharacters } from './characters/tl';
import { guides as tlGuides } from './guides/tl';
import { collections as tlCollections } from './collections/tl';

const CHARACTER_MAP: Record<string, CharacterSeo[]> = {
  en: enCharacters,
  'zh-CN': zhCNCharacters,
  'zh-TW': zhTWCharacters,
  ja: jaCharacters,
  ko: koCharacters,
  it: itCharacters,
  nl: nlCharacters,
  sv: svCharacters,
  no: noCharacters,
  da: daCharacters,
  fi: fiCharacters,
  pl: plCharacters,
  tr: trCharacters,
  hi: hiCharacters,
  id: idCharacters,
  vi: viCharacters,
  th: thCharacters,
  ms: msCharacters,
  tl: tlCharacters,
};

const GUIDE_MAP: Record<string, GuideSeo[]> = {
  en: enGuides,
  'zh-CN': zhCNGuides,
  'zh-TW': zhTWGuides,
  ja: jaGuides,
  ko: koGuides,
  it: itGuides,
  nl: nlGuides,
  sv: svGuides,
  no: noGuides,
  da: daGuides,
  fi: fiGuides,
  pl: plGuides,
  tr: trGuides,
  hi: hiGuides,
  id: idGuides,
  vi: viGuides,
  th: thGuides,
  ms: msGuides,
  tl: tlGuides,
};

const COLLECTION_MAP: Record<string, CollectionSeo[]> = {
  en: enCollections,
  'zh-CN': zhCNCollections,
  'zh-TW': zhTWCollections,
  ja: jaCollections,
  ko: koCollections,
  it: itCollections,
  nl: nlCollections,
  sv: svCollections,
  no: noCollections,
  da: daCollections,
  fi: fiCollections,
  pl: plCollections,
  tr: trCollections,
  hi: hiCollections,
  id: idCollections,
  vi: viCollections,
  th: thCollections,
  ms: msCollections,
  tl: tlCollections,
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
