// ── Adsterra 广告测试开关 ──────────────────────────────────────────
// 脚本型广告（ACTIVE_AD）与 Smartlink 入口（SMARTLINK_ENABLED）分两套开关，可并存。
// 切换流程：改下面的值 → git commit → push（Vercel 自动重建部署）。
// 全部撤下：ACTIVE_AD 设 'none' 且 SMARTLINK_ENABLED 设 false，即彻底移除全部广告。
//
// 各类型说明：
//  - 'popunder' / 'social-bar'：全站型，脚本注入即生效，不需要放置位置。
//  - 'native-banner'：需要容器 <div>，由 <SiteAd/> 组件渲染（放在内容页顶部）。
//  - 'smartlink'：是一个跳转链接，由 <SiteAd/> 渲染成可点击入口。

export type AdFormat = 'none' | 'popunder' | 'smartlink' | 'native-banner' | 'social-bar';

// 当前启用的全站脚本型广告（测试时在这里切换；social-bar 由 app.vue 注入脚本）
export const ACTIVE_AD: AdFormat = 'social-bar';

// Smartlink 顶栏入口开关（独立于 ACTIVE_AD，可与脚本型广告同时启用；由 <SiteAd/> 渲染）
export const SMARTLINK_ENABLED = true;

// Adsterra 各广告位代码（来自后台）
export const ADS = {
  // Popunder
  popunder: 'https://pl30543824.effectivecpmnetwork.com/0d/39/73/0d3973984642a2711dd446bc6274f99b.js',
  // Smartlink（跳转链接）
  smartlink: 'https://www.effectivecpmnetwork.com/e6y38sqr?key=85ee6852261e741bbd39cb1366cc9466',
  // Native Banner（invoke.js + 容器 id）
  nativeBanner: {
    invoke: 'https://pl30543826.effectivecpmnetwork.com/8807d0bbfa07b068d18d940340198e0b/invoke.js',
    containerId: 'container-8807d0bbfa07b068d18d940340198e0b',
  },
  // Social Bar
  socialBar: 'https://pl30543827.effectivecpmnetwork.com/c1/a5/41/c1a5413ba48b3178d0b162735d4deb78.js',
} as const;
