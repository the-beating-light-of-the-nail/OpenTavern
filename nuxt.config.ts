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
    '/about': { prerender: true },
    '/contact': { prerender: true },
    '/privacy': { prerender: true },
    '/terms': { prerender: true },
    '/app': { ssr: false, headers: { 'X-Robots-Tag': 'noindex' } },
    // 全站安全响应头（审计 Phase 2）；CSP 留待渲染回归测试后再加，避免误伤内联 hydration 脚本
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    },
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
      routes: ['/sitemap.xml', '/zh-CN/sitemap.xml', '/zh-TW/sitemap.xml', '/es/sitemap.xml', '/ar/sitemap.xml', '/pt/sitemap.xml', '/ru/sitemap.xml', '/fr/sitemap.xml', '/de/sitemap.xml', '/ja/sitemap.xml', '/ko/sitemap.xml', '/it/sitemap.xml', '/nl/sitemap.xml', '/sv/sitemap.xml', '/no/sitemap.xml', '/da/sitemap.xml', '/fi/sitemap.xml', '/pl/sitemap.xml', '/tr/sitemap.xml', '/hi/sitemap.xml', '/id/sitemap.xml', '/vi/sitemap.xml', '/th/sitemap.xml', '/ms/sitemap.xml', '/tl/sitemap.xml'],
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
      // Google Analytics 4 (gtag.js) —— 直接写入 <head>，随 SSR/预渲染进入静态 HTML，
      // 爬虫 / Tag Assistant / view-source 均可见（旧版 plugins/gtag.client.ts 运行时注入
      // 不会进静态页，导致 GA 校验/首屏抓取检测不到）。
      script: [
        // 1) Consent Mode v2 默认拒绝（同步 inline，在 gtag.js 执行前设好）—— EEA 合规。
        //    gtag.js（步骤2）为 async，必定晚于此段执行，因此总能读到 denied 默认。
        {
          innerHTML:
            "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});",
        },
        // 2) 异步加载 gtag.js（GA4 测量 ID G-9P6PL73E94）。
        { src: 'https://www.googletagmanager.com/gtag/js?id=G-9P6PL73E94', async: true },
        // 3) page_view 配置；仅入队 dataLayer，待 gtag.js 到达后处理。用户在 CookieConsent
        //    接受后由 gtag('consent','update',...) 放开 storage。
        {
          innerHTML:
            "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-9P6PL73E94');",
        },
      ],
    },
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    langDir: 'locales',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'rolechat_locale',
      alwaysRedirect: true,
      fallbackLocale: 'en',
    },
    bundle: { optimizeTranslationDirective: false },
    compilation: { strictMessage: false, escapeHtml: false },
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'zh-CN', language: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'zh-TW', language: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'ar', language: 'ar-SA', name: 'العربية', file: 'ar.json' },
      { code: 'pt', language: 'pt-PT', name: 'Português', file: 'pt.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
      { code: 'ja', language: 'ja-JP', name: '日本語', file: 'ja.json' },
      { code: 'ko', language: 'ko-KR', name: '한국어', file: 'ko.json' },
      { code: 'it', language: 'it-IT', name: 'Italiano', file: 'it.json' },
      { code: 'nl', language: 'nl-NL', name: 'Nederlands', file: 'nl.json' },
      { code: 'sv', language: 'sv-SE', name: 'Svenska', file: 'sv.json' },
      { code: 'no', language: 'nb-NO', name: 'Norsk', file: 'no.json' },
      { code: 'da', language: 'da-DK', name: 'Dansk', file: 'da.json' },
      { code: 'fi', language: 'fi-FI', name: 'Suomi', file: 'fi.json' },
      { code: 'pl', language: 'pl-PL', name: 'Polski', file: 'pl.json' },
      { code: 'tr', language: 'tr-TR', name: 'Türkçe', file: 'tr.json' },
      { code: 'hi', language: 'hi-IN', name: 'हिन्दी', file: 'hi.json' },
      { code: 'id', language: 'id-ID', name: 'Bahasa Indonesia', file: 'id.json' },
      { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt', file: 'vi.json' },
      { code: 'th', language: 'th-TH', name: 'ไทย', file: 'th.json' },
      { code: 'ms', language: 'ms-MY', name: 'Bahasa Melayu', file: 'ms.json' },
      { code: 'tl', language: 'tl-PH', name: 'Filipino', file: 'tl.json' },
    ],
    customRoutes: 'config',
    pages: {},
  },

  // 站点 URL — sitemap.xml 生成 <loc> 绝对路径所需
  site: {
    url: 'https://open-tavern.vercel.app',
  },

  sitemap: {
    // /app 是纯客户端 SPA，不索引；其余预渲染路由由模块从 nitro prerender 自动发现
    exclude: ['/app/**', '/app', '/zh-CN/app', '/zh-TW/app', '/es/app', '/ar/app', '/pt/app', '/ru/app', '/fr/app', '/de/app', '/ja/app', '/ko/app', '/it/app', '/nl/app', '/sv/app', '/no/app', '/da/app', '/fi/app', '/pl/app', '/tr/app', '/hi/app', '/id/app', '/vi/app', '/th/app', '/ms/app', '/tl/app'],
    // 与 i18n 集成：自动生成 <xhtml:link rel="alternate" hreflang="..."> 备选语言链接
    autoLastmod: true,
    i18n: true,
  },

  compatibilityDate: '2024-11-01',
});
