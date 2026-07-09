// Nuxt configuration — OpenTavern (Vercel, SPA)
export default defineNuxtConfig({
  // 本应用为纯客户端 SPA（重度依赖 OPFS / WebGPU / localStorage），关闭 SSR 避免 hydration 与浏览器 API 报错
  ssr: false,

  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@pinia/nuxt'],

  // Tailwind v3 经 postcss 插件接入（弃用 @nuxtjs/tailwindcss 模块：与 Nuxt3.17/Vite6 不兼容）
  // 注：必须写在 nuxt.config 的 postcss 键里；根目录 postcss.config.cjs 会被 Nuxt 内联配置忽略
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: { config: './tailwind.config.ts' },
      autoprefixer: {},
    },
  },

  // Vercel 部署目标（SPA 模式下自动处理路由 fallback）
  nitro: {
    preset: 'vercel',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN', class: 'dark' },
      title: 'OpenTavern — AI Character Chat',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
      ],
    },
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'zh-CN',
    langDir: 'locales',
    lazy: true,
    detectBrowserLanguage: false,
    bundle: { optimizeTranslationDirective: false },
    compilation: { strictMessage: false, escapeHtml: false },
    locales: [
      { code: 'zh-CN', language: 'zh-CN', name: '简', file: 'zh-CN.json' },
      { code: 'zh-TW', language: 'zh-TW', name: '繁', file: 'zh-TW.json' },
      { code: 'en', language: 'en-US', name: 'EN', file: 'en.json' },
    ],
  },

  compatibilityDate: '2024-11-01',
});
