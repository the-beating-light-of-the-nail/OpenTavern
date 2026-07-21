// Nuxt configuration — RoleChat AI (Vercel, hybrid SSR/SPA)
export default defineNuxtConfig({
  // 混合渲染：营销首页 (/) 与 /characters 预渲染为静态 HTML（SEO）；聊天工具 (/app) 保持 SPA
  ssr: true,

  // 路由级渲染控制：营销页与 SEO 页预渲染为静态 HTML（含动态 [slug] 页），聊天 App 锁回纯客户端 SPA
  routeRules: {
    '/': { prerender: true },
    '/characters': { prerender: true },
    '/characters/**': { prerender: true },
    '/collections/**': { prerender: true },
    '/guides': { prerender: true },
    '/guides/**': { prerender: true },
    '/app': { ssr: false },
  },

  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@pinia/nuxt', '@nuxtjs/sitemap'],

  // 组件按文件名注册（禁用路径前缀）：components/modals/SettingsModal.vue → <SettingsModal />
  // 否则 Nuxt 默认加目录前缀注册为 ModalsSettingsModal，与 <SettingsModal /> 用法不匹配，
  // 生产构建会静默渲染为空自定义元素（dev 才有 resolve 警告，极易漏掉）
  components: [{ path: '~/components', pathPrefix: false }],

  // Tailwind v3 经 postcss 插件接入（弃用 @nuxtjs/tailwindcss 模块：与 Nuxt3.17/Vite6 不兼容）
  // 注：必须写在 nuxt.config 的 postcss 键里；根目录 postcss.config.cjs 会被 Nuxt 内联配置忽略
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/main.css',
    '~/assets/css/components.css',
    '~/assets/css/marketing.css',
  ],

  postcss: {
    plugins: {
      tailwindcss: { config: './tailwind.config.ts' },
      autoprefixer: {},
    },
  },

  // Vercel 部署目标（预渲染路由生成静态 HTML，/app SPA 由路由 fallback 处理）
  // crawlLinks: 从已预渲染页面爬取 <NuxtLink> 自动发现动态 [slug] 路由并一并预渲染
  // routes 显式列入 /sitemap.xml：@nuxtjs/sitemap 注册的是运行时路由，crawlLinks 不会自动预渲染它
  nitro: {
    preset: 'vercel',
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml'],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en', class: 'theme-new-light' },
      title: 'Open Tavern · RoleChat AI — Private AI Character Roleplay',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
        {
          name: 'description',
          content:
            'Open Tavern (also known as RoleChat AI) is an easy private AI roleplay platform. Chat with original romance and fantasy characters in seconds. No installation. No complicated setup. Bring your own AI key.',
        },
      ],
      link: [
        // 乙女向展示衬线字体（display=swap + 系统宋体兜底，加载失败不影响渲染）
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Noto+Serif+SC:wght@600;700&display=swap',
        },
      ],
    },
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    langDir: 'locales',
    lazy: true,
    detectBrowserLanguage: false,
    bundle: { optimizeTranslationDirective: false },
    compilation: { strictMessage: false, escapeHtml: false },
    locales: [
      { code: 'en', language: 'en-US', name: 'EN', file: 'en.json' },
      { code: 'zh-CN', language: 'zh-CN', name: '简', file: 'zh-CN.json' },
      { code: 'zh-TW', language: 'zh-TW', name: '繁', file: 'zh-TW.json' },
    ],
  },

  // 站点 URL — sitemap.xml 生成 <loc> 绝对路径所需
  site: {
    url: 'https://open-tavern.vercel.app',
  },

  sitemap: {
    // /app 是纯客户端 SPA，不索引；其余预渲染路由由模块从 nitro prerender 自动发现
    exclude: ['/app/**', '/app'],
    // 与 i18n no_prefix 策略对齐：sitemap 内不区分 locale
    autoLastmod: true,
  },

  compatibilityDate: '2024-11-01',
});
