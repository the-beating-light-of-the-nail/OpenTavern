/**
 * vue-i18n 运行时配置（@nuxtjs/i18n v9 默认从 i18n/i18n.config.ts 加载）。
 *
 * fallbackLocale: 'en' —— 工具站新增 key（nav_tools / tools_* / puretavern_* 等）
 * 目前只翻译了主力语言（en/zh-CN/zh-TW/ja/ko），其余 20 个语言缺失时回退英文，
 * 避免渲染出裸 key。先例：data/ 内容数据层 es/ar/pt/ru/fr/de 本就显式回退 en。
 * 后续补译各语言后无需改此文件。
 */
export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
}));
