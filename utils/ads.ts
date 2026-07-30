// ── Adsterra 广告系统 ──────────────────────────────────────────────
// 数据驱动：AD_REGISTRY 描述每个广告位的渲染方式与默认开关；
// 运行时显隐由 useAdPanel（composables/useAdPanel.ts）的状态控制，存 localStorage。
// 主页 ?adpanel=1 可调出切换面板（仅自己可见）。
//
// iframe/native 类广告：invoke.js 在 iframe 内运行，避免 document.write 清主页面。
// script 类（social-bar/popunder）：由 app.vue 注入；运行时关闭后可能需刷新才彻底消失。

// 各广告位 URL / 尺寸（来自 Adsterra 后台）
export const ADS = {
  // 全站脚本型
  socialBar: 'https://pl30543827.effectivecpmnetwork.com/c1/a5/41/c1a5413ba48b3178d0b162735d4deb78.js',
  popunder: 'https://pl30543824.effectivecpmnetwork.com/0d/39/73/0d3973984642a2711dd446bc6274f99b.js',
  // Smartlink 跳转链接
  smartlink: 'https://www.effectivecpmnetwork.com/e6y38sqr?key=85ee6852261e741bbd39cb1366cc9466',
  // iframe banner（HTML 放 public/）
  banner468: { html: '/ad-banner-468x60.html', width: 468, height: 60 },
  banner300: { html: '/ad-banner-300x250.html', width: 300, height: 250 },
  banner160x300: { html: '/ad-banner-160x300.html', width: 160, height: 300 },
  banner160x600: { html: '/ad-banner-160x600.html', width: 160, height: 600 },
  banner728x90: { html: '/ad-banner-728x90.html', width: 728, height: 90 },
  banner320x50: { html: '/ad-banner-320x50.html', width: 320, height: 50 },
  // Native Banner（iframe 加载含 container 的静态页）
  native: { html: '/ad-native.html', width: 330, height: 280 },
} as const;

// 广告位置：script=全站脚本注入；topbar=公开页顶栏（SiteAd）；content=首页试验区（index）；sidebar=侧边贴边（AdSidebar 左/右）；card=角色卡片网格（AdCard）；footer=页面底部（AdFooter）
export type AdPlacement = 'script' | 'topbar' | 'content' | 'sidebar' | 'card' | 'footer';

export interface AdDef {
  id: string;
  label: string; // 面板显示名
  placement: AdPlacement;
  src?: string; // script 型脚本 URL
  href?: string; // smartlink 跳转 URL
  html?: string; // iframe/native 静态页
  width?: number;
  height?: number;
  defaultOn: boolean;
}

// 广告注册表（驱动渲染 + 面板）
export const AD_REGISTRY: AdDef[] = [
  { id: 'socialBar', label: 'Social Bar（全站·脚本·已停用）', placement: 'script', src: ADS.socialBar, defaultOn: false },
  { id: 'smartlink', label: 'Smartlink（顶栏入口）', placement: 'topbar', href: ADS.smartlink, defaultOn: true },
  { id: 'banner468', label: 'Banner 468×60（顶栏）', placement: 'topbar', html: ADS.banner468.html, width: ADS.banner468.width, height: ADS.banner468.height, defaultOn: true },
  { id: 'banner300', label: 'Banner 300×250（底部）', placement: 'footer', html: ADS.banner300.html, width: ADS.banner300.width, height: ADS.banner300.height, defaultOn: true },
  { id: 'banner160x300', label: 'Banner 160×300（左侧）', placement: 'sidebar', html: ADS.banner160x300.html, width: ADS.banner160x300.width, height: ADS.banner160x300.height, defaultOn: true },
  { id: 'banner728x90', label: 'Banner 728×90', placement: 'content', html: ADS.banner728x90.html, width: ADS.banner728x90.width, height: ADS.banner728x90.height, defaultOn: false },
  { id: 'banner320x50', label: 'Banner 320×50', placement: 'content', html: ADS.banner320x50.html, width: ADS.banner320x50.width, height: ADS.banner320x50.height, defaultOn: false },
  { id: 'banner160x600', label: 'Banner 160×600（右侧贴边）', placement: 'sidebar', html: ADS.banner160x600.html, width: ADS.banner160x600.width, height: ADS.banner160x600.height, defaultOn: true },
  { id: 'nativeBanner', label: 'Native Banner（卡片位）', placement: 'card', html: ADS.native.html, width: ADS.native.width, height: ADS.native.height, defaultOn: true },
];

// 便捷查找
export const adById = (id: string) => AD_REGISTRY.find((a) => a.id === id);

// 把广告卡按固定间隔插入条目列表（每 every 项后插一张），用于卡片网格原生广告。
// featured(6) → 末尾 1 张广告卡；filtered(N) → 每 6 张插 1 张（首屏前 6 张不出现）。
export type GridCell<T> =
  | { kind: 'item'; item: T; key: string }
  | { kind: 'ad'; key: string };

export function withAdCards<T>(items: T[], keyOf: (item: T) => string, every = 6): GridCell<T>[] {
  const out: GridCell<T>[] = [];
  let adIdx = 0;
  items.forEach((item, i) => {
    out.push({ kind: 'item', item, key: keyOf(item) });
    if ((i + 1) % every === 0) out.push({ kind: 'ad', key: `native-ad-${adIdx++}` });
  });
  return out;
}
