// ── Adsterra 广告测试开关 ──────────────────────────────────────────
// 一次只启用一种广告，逐个体验后决定最终保留哪种。
// 切换流程：改下面 ACTIVE_AD 的值 → git commit → push（Vercel 自动重建部署）。
// 测试全部结束、换 AdSense 前：把 ACTIVE_AD 设为 'none'，即可彻底移除全部广告代码。
//
// 各类型说明：
//  - 'popunder' / 'social-bar'：全站型，脚本注入即生效，不需要放置位置。
//  - 'native-banner'：需要容器 <div>，由 <SiteAd/> 组件渲染（放在内容页顶部）。
//  - 'smartlink'：是一个跳转链接，由 <SiteAd/> 渲染成可点击入口。

export type AdFormat = 'none' | 'popunder' | 'smartlink' | 'native-banner' | 'social-bar';

// 当前启用的广告（测试时在这里切换）
// 'smartlink' 由 <SiteAd/> 渲染成全站可点击入口（见 components/SiteAd.vue）。
export const ACTIVE_AD: AdFormat = 'smartlink';

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
