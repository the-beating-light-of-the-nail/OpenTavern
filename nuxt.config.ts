// Nuxt configuration — RoleChat AI (Vercel, hybrid SSR/SPA)
export default defineNuxtConfig({
  // 混合渲染：新首页、保留的收录页与 /opentavern 预渲染；其余旧路由由 server/middleware/route-guard 返回 410
  ssr: true,

  // 路由级渲染控制：只预渲染白名单页面，禁止 crawlLinks 把已下线页面重新带回构建产物
  // @ts-expect-error 双 @nuxt/schema（hoisted 4.x / nested 3.17.7）导致的 routeRules 幻影类型错误；运行时有效
  routeRules: {
    '/': { prerender: true },
    '/zh-CN': { prerender: true },
    '/opentavern': { prerender: true },
    '/guides': { prerender: true },
    '/tools': { prerender: true },
    '/characters': { prerender: true },
    '/about': { prerender: true },
    '/contact': { prerender: true },
    '/privacy': { prerender: true },
    '/terms': { prerender: true },
    '/where-to-find-character-cards': { prerender: true },
    // 新版列表页（承接侧栏导航与内链；旧 /guides /tools /where-to-find-character-cards 保留 200 给搜索流量）
    '/tutorials': { prerender: true },
    '/toolkit': { prerender: true },
    '/card-sites': { prerender: true },
    '/web-tavern': { prerender: true },
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

  modules: ['@nuxtjs/i18n', '@pinia/nuxt'],

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
    // 首页工作台布局（顶栏 + 分类栏 + 工具卡网格）；仅 pages/index.vue 使用
    '~/assets/css/workbench.css',
    // /opentavern 应用主题（opentavern.app 浅暖色）
    '~/assets/css/opentavern.css',
    // 首页工作台主题（cardplus 风格浅色 Element Plus）
    '~/assets/css/dashboard.css',
  ],

  postcss: {
    plugins: {
      tailwindcss: { config: './tailwind.config.ts' },
      autoprefixer: {},
    },
  },

  // Vercel 部署目标（白名单路由预渲染为静态 HTML）
  // crawlLinks: false —— 保留页里可能仍有指向旧路由的链接，禁止构建期自动把下线页重新预渲染。
  nitro: {
    preset: 'vercel',
    prerender: {
      crawlLinks: false,
      // 动态 [slug] 页只预渲染白名单；未列出的旧页不进入产物，由 route-guard 返回 410。
      failOnError: false,
      routes: [
        '/',
        '/zh-CN',
        '/opentavern',
        '/guides',
        '/guides/how-to-start-ai-roleplay',
        '/guides/how-to-get-an-api-key',
        '/guides/tips-for-better-roleplay',
        '/guides/how-to-use-openrouter-for-roleplay',
        '/guides/what-is-a-character-card',
        '/guides/sillytavern-vs-web-tavern',
        '/guides/best-ai-roleplay-prompts',
        '/zh-CN/guides',
        '/zh-CN/guides/how-to-start-ai-roleplay',
        '/zh-CN/guides/how-to-get-an-api-key',
        '/zh-CN/guides/tips-for-better-roleplay',
        '/zh-CN/guides/how-to-use-openrouter-for-roleplay',
        '/zh-CN/guides/what-is-a-character-card',
        '/zh-CN/guides/sillytavern-vs-web-tavern',
        '/zh-CN/guides/best-ai-roleplay-prompts',
        '/contact',
        '/zh-CN/contact',
        '/about',
        '/zh-CN/about',
        '/privacy',
        '/zh-CN/privacy',
        '/terms',
        '/zh-CN/terms',
        '/where-to-find-character-cards',
        '/zh-CN/where-to-find-character-cards',
        // 新版列表页（与 route-guard ALLOW_EXACT、public/sitemap.xml 四处同步）
        '/tutorials',
        '/zh-CN/tutorials',
        '/toolkit',
        '/zh-CN/toolkit',
        '/card-sites',
        '/zh-CN/card-sites',
        '/web-tavern',
        '/zh-CN/web-tavern',
        '/characters',
        '/characters/the-dragon-prince',
        // 新收录 3 张热门卡（首页 M3 橱窗链接 en + zh-CN 版本，与 route-guard/sitemap 同步）
        '/characters/cold-doctor-boyfriend',
        '/characters/the-brooding-vampire-lord',
        '/characters/the-mafia-boss',
        '/zh-CN/characters',
        '/zh-CN/characters/cold-doctor-boyfriend',
        '/zh-CN/characters/the-brooding-vampire-lord',
        '/zh-CN/characters/the-mafia-boss',
        '/ja/characters/the-sharp-tongued-detective',
        '/da/characters/the-time-traveler',
        '/no/characters/the-witchs-familiar',
        '/ar/characters/the-protective-bodyguard',
        '/tools',
        '/zh-CN/tools',
        '/tools/card-studio',
        '/tools/worldbook-forge',
        '/tools/preset-lab',
        '/tools/card-converter',
        '/tools/pure-tavern',
        '/zh-CN/tools/card-studio',
        '/zh-CN/tools/worldbook-forge',
        '/zh-CN/tools/preset-lab',
        '/zh-CN/tools/card-converter',
        '/da/tools/pure-tavern',
        '/pt/tools/card-studio',
      ],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'RoleChat AI — Private AI Character Roleplay',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
        // PWA：coffee 主题色（manifest + iOS 图标 + SW 注册见 app.vue / public/sw.js）
        { name: 'theme-color', content: '#121212' },
        {
          name: 'description',
          content:
            'RoleChat AI (also known as Open Tavern) is an easy private AI roleplay platform. Chat with original romance and fantasy characters in seconds. No installation. No complicated setup. Bring your own AI key.',
        },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
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
        // 4) Microsoft Clarity 用户行为分析 —— 官方异步安装代码，写入 <head>
        {
          innerHTML:
            "(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src=\"https://www.clarity.ms/tag/\"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, \"clarity\", \"script\", \"y2vcc4nzof\");",
        },
      ],
    },
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    langDir: 'locales',
    lazy: true,
    // 关闭浏览器语言自动跳转：Googlebot 抓取 / 时必须稳定拿到英文首页，
    // 中文首页固定由 /zh-CN/ 承载（canonical + hreflang 由首页自行声明）。
    detectBrowserLanguage: false,
    bundle: { optimizeTranslationDirective: false },
    compilation: { strictMessage: false, escapeHtml: false },
    // 只保留有收录页的语言 + 应用 UI 需要的 zh-TW（简/繁/EN 三语切换）
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'zh-CN', language: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'zh-TW', language: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'ar', language: 'ar-SA', name: 'العربية', file: 'ar.json' },
      { code: 'pt', language: 'pt-PT', name: 'Português', file: 'pt.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'ja', language: 'ja-JP', name: '日本語', file: 'ja.json' },
      { code: 'no', language: 'nb-NO', name: 'Norsk', file: 'no.json' },
      { code: 'da', language: 'da-DK', name: 'Dansk', file: 'da.json' },
    ],
    customRoutes: 'config',
    pages: {},
  },

  // 站点 URL — 绝对 URL / canonical / schema 的单一来源
  site: {
    url: 'https://www.rolechatai.com',
  },

  // sitemap 改为 public/sitemap.xml 静态白名单：只提交新首页 + 保留的收录页，
  // 不再让模块从预渲染路由自动生成，避免把已下线页面重新带回 sitemap。

  compatibilityDate: '2024-11-01',
});
