// scripts/gen-legal-i18n.mjs
// 一次性注入 /privacy 与 /terms 两页的 i18n key 到全部 25 个 locale 文件。
// - 正文：en / zh-CN / zh-TW 母语；其余 22 个 locale 回退为英文（法律页以英文为准，见 terms_lang_note）。
// - nav 标签（nav_privacy / nav_terms）：25 个 locale 全部母语，保持导航一致。
// 幂等：重复运行会用相同值覆盖。key 追加到各文件末尾（顺序对 vue-i18n 无影响；下次 localize 流程会按 en.json 顺序重建）。
//
// 用法：node scripts/gen-legal-i18n.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES_DIR = join(ROOT, 'i18n', 'locales');

// ── 正文：英文（权威） ────────────────────────────────────────────
const EN = {
  nav_privacy: 'Privacy',
  nav_terms: 'Terms',

  privacy_back_home: '← Home',
  privacy_title: 'Privacy Policy',
  privacy_updated: 'Last updated: July 26, 2026',
  privacy_intro:
    'Open Tavern (also called RoleChat AI) is a client-side tool. It runs in your browser and does not offer user accounts, a backend, or a server-side API. This page explains what little data is involved and how it is handled.',
  privacy_nodata_title: 'We do not collect your personal data',
  privacy_nodata_body:
    'There is no login, no server-side database, and no analytics account tied to you. We do not ask for your name, email, or any personal information to use the tool. The only way we receive an email from you is if you choose to write to us.',
  privacy_local_title: 'Your data stays on your device',
  privacy_local_body:
    'All of your conversations, characters, world books, and settings are stored locally in your browser (using the browser local storage and the Origin Private File System). This data never leaves your device through us. Clearing your browser data or site storage deletes it permanently, and we have no way to recover it.',
  privacy_api_title: 'Your own AI provider',
  privacy_api_body:
    'Open Tavern does not run its own model server. When you chat, your messages are sent directly from your browser to the AI provider you configured, using the API key and endpoint you entered yourself. We do not proxy, read, or store these requests — they travel between your browser and your chosen provider.',
  privacy_third_title: 'Third-party resources',
  privacy_third_body:
    'The app loads some static resources from content delivery networks, such as styling and sanitization libraries and web fonts. If you enable browser-local inference, model files are downloaded directly to your browser from a public model CDN. These external services have their own privacy practices that we do not control.',
  privacy_cookies_title: 'Cookies and local storage',
  privacy_cookies_body:
    'We use a minimal cookie to remember your language preference. We do not use advertising or tracking cookies of our own. Your chats and settings are kept in the browser local storage, not in cookies.',
  privacy_ads_title: 'Advertising',
  privacy_ads_body:
    'If advertising is shown, it may be provided by Google and other third-party advertising partners. These partners may use cookies and similar technologies to serve ads based on your past visits to this and other sites. You can opt out of personalized advertising at Google Ads Settings, and learn more at aboutads.info.',
  privacy_children_title: 'Children',
  privacy_children_body:
    'Open Tavern is not directed at children under the age of 13 (or the equivalent minimum age in your country) and is not intended for use by them.',
  privacy_user_content_title: 'User-generated content',
  privacy_user_content_body:
    'Open Tavern is a neutral tool. Any content you create, using your own AI provider and your own imagination, is generated and stored locally by you. We do not provide, host, or take responsibility for user-created content.',
  privacy_changes_title: 'Changes to this policy',
  privacy_changes_body:
    'We may update this Privacy Policy from time to time. The date above reflects the latest revision. Continued use after changes means you accept the updated policy.',
  privacy_contact_title: 'Contact',
  privacy_contact_body: 'Questions about privacy? Email us at',
  privacy_seo_title: 'Privacy Policy · Open Tavern · RoleChat AI',
  privacy_seo_desc:
    'Open Tavern is a privacy-first, client-side tool: no accounts, no backend, no server-side storage. Your chats and characters stay in your browser. Read the full privacy policy.',

  terms_back_home: '← Home',
  terms_title: 'Terms of Service',
  terms_updated: 'Last updated: July 26, 2026',
  terms_accept_title: 'Acceptance of these terms',
  terms_accept_body:
    'By opening or using Open Tavern (also called RoleChat AI), you agree to these Terms of Service. If you do not agree, please do not use the tool.',
  terms_service_title: 'What Open Tavern is',
  terms_service_body:
    'Open Tavern is a neutral, client-side tool that runs in your browser. It does not provide user accounts, run its own model server, or host conversations. You bring your own AI provider by entering your own API key.',
  terms_resp_title: 'Your responsibilities',
  terms_resp_body:
    'You are responsible for the AI provider account and API key you use, including any cost and compliance with that provider’s own terms. You are responsible for the prompts you send and the content you generate.',
  terms_content_title: 'A neutral tool — your content is your own',
  terms_content_body:
    'Open Tavern is provided as a general-purpose creative tool, similar to a text editor. We do not provide adult or sexual character content. Any content you create with the tool is your own work, created using your own provider and your own input, and is your sole responsibility. It does not represent Open Tavern, and we do not endorse it.',
  terms_use_title: 'Acceptable use',
  terms_use_body:
    'You agree not to use the tool to create or distribute content that is illegal, infringes the rights of others, or harms anyone. You must follow the terms of any third-party AI provider you connect.',
  terms_ip_title: 'Intellectual property',
  terms_ip_body:
    'The Open Tavern software and its original built-in characters are licensed under AGPL-3.0. Content you create with the tool belongs to you. If you import third-party character cards, you are responsible for having the rights to use them.',
  terms_third_title: 'Third-party services',
  terms_third_body:
    'You may connect external AI providers and load third-party resources at your own discretion. We are not responsible for the availability, accuracy, or practices of those third parties, and their terms apply to your use of them.',
  terms_warranty_title: 'No warranty',
  terms_warranty_body:
    'The tool is provided "as is" and "as available", without warranties of any kind. We do not guarantee it will be uninterrupted, error-free, or meet your needs.',
  terms_liability_title: 'Limitation of liability',
  terms_liability_body:
    'To the maximum extent permitted by law, Open Tavern and its author are not liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, the tool.',
  terms_changes_title: 'Changes to these terms',
  terms_changes_body:
    'We may update these Terms from time to time. The date above reflects the latest revision. Continued use after changes means you accept the updated terms.',
  terms_lang_note_title: 'Language of these terms',
  terms_lang_note_body:
    'These Terms are provided in English and may be translated for convenience. If there is any difference, the English version controls.',
  terms_contact_title: 'Contact',
  terms_contact_body: 'Questions about these terms? Email us at',
  terms_seo_title: 'Terms of Service · Open Tavern · RoleChat AI',
  terms_seo_desc:
    'Open Tavern is a neutral client-side creative tool: bring your own AI key, and you are responsible for what you create. Read the full terms of service.',
};

// ── 正文：简体中文 ────────────────────────────────────────────────
const ZH_CN = {
  nav_privacy: '隐私政策',
  nav_terms: '服务条款',

  privacy_back_home: '← 首页',
  privacy_title: '隐私政策',
  privacy_updated: '最后更新：2026 年 7 月 26 日',
  privacy_intro:
    'Open Tavern（又称 RoleChat AI）是一款在浏览器中运行的客户端工具，不提供用户账号、后端服务或服务端 API。本页说明涉及的数据及其处理方式。',
  privacy_nodata_title: '我们不收集你的个人数据',
  privacy_nodata_body:
    '本工具无需登录，没有服务端数据库，也没有与你绑定的分析账户。使用时无需提供姓名、邮箱等任何个人信息。只有当你主动来信时，我们才会收到你的邮箱。',
  privacy_local_title: '你的数据保存在你的设备上',
  privacy_local_body:
    '你的全部对话、角色、世界书和设置都保存在浏览器本地（使用浏览器的本地存储与 OPFS）。这些数据不会经由我们离开你的设备。清除浏览器数据或站点存储会永久删除它们，我们无法恢复。',
  privacy_api_title: '你自带的 AI 服务',
  privacy_api_body:
    'Open Tavern 不运行自有的模型服务。你聊天时，消息会从浏览器直接发送到你配置的 AI 服务（使用你自己填写的 API 密钥和接口地址）。我们不代理、不读取、不存储这些请求——它们只在你浏览器与你选择的服务之间传输。',
  privacy_third_title: '第三方资源',
  privacy_third_body:
    '应用会从内容分发网络（CDN）加载一些静态资源，例如样式、文本净化库和网页字体。如果你启用浏览器本地推理，模型文件会从公共模型 CDN 直接下载到你的浏览器。这些外部服务各有自己的隐私做法，我们无法控制。',
  privacy_cookies_title: 'Cookie 与本地存储',
  privacy_cookies_body:
    '我们仅使用一个最小化的 Cookie 来记住你的语言偏好，自身不使用广告或追踪类 Cookie。你的对话和设置保存在浏览器本地存储中，而非 Cookie 中。',
  privacy_ads_title: '广告',
  privacy_ads_body:
    '如果展示广告，广告可能由 Google 及其他第三方广告合作方提供。这些合作方可能使用 Cookie 及类似技术，基于你此前访问本站及更多站点的情况投放广告。你可以在 Google 广告设置中关闭个性化广告，详情可访问 aboutads.info。',
  privacy_children_title: '未成年人',
  privacy_children_body:
    'Open Tavern 面向 13 岁及以上（或你所在地区规定的最低年龄）用户，不针对更低年龄的未成年人，也不供其使用。',
  privacy_user_content_title: '用户生成内容',
  privacy_user_content_body:
    'Open Tavern 是一个中性工具。你使用自带的 AI 服务与自身想象所创建的任何内容，都由你在本地生成并保存。我们不提供、不托管，也不对用户创建的内容负责。',
  privacy_changes_title: '本政策的变更',
  privacy_changes_body:
    '我们可能不时更新本隐私政策。上方日期为最新修订日期。变更后继续使用即表示你接受更新后的政策。',
  privacy_contact_title: '联系我们',
  privacy_contact_body: '对隐私有疑问？请发邮件至',
  privacy_seo_title: '隐私政策 · Open Tavern · RoleChat AI',
  privacy_seo_desc:
    'Open Tavern 是隐私优先的客户端工具：无账号、无后端、无服务端存储，你的对话和角色都保存在浏览器中。阅读完整隐私政策。',

  terms_back_home: '← 首页',
  terms_title: '服务条款',
  terms_updated: '最后更新：2026 年 7 月 26 日',
  terms_accept_title: '接受本条款',
  terms_accept_body:
    '打开或使用 Open Tavern（又称 RoleChat AI）即表示你同意本服务条款。如不同意，请不要使用本工具。',
  terms_service_title: 'Open Tavern 是什么',
  terms_service_body:
    'Open Tavern 是一款在浏览器中运行的中性客户端工具，不提供用户账号、不运行自有模型服务、不托管对话。你需要自行输入自己的 API 密钥来接入 AI 服务。',
  terms_resp_title: '你的责任',
  terms_resp_body:
    '你对所使用的 AI 服务账号与 API 密钥负责，包括相关费用及遵守该服务自身的条款。你对所发送的提示词及生成的内容负责。',
  terms_content_title: '中性工具——内容由你自负',
  terms_content_body:
    'Open Tavern 作为通用创作工具提供，类似一个文本编辑器。我们不提供成人或性相关角色内容。你用本工具创建的任何内容都是你自己的作品，由你使用自带服务与自身输入生成，由你自行负责。这些内容不代表 Open Tavern，我们也不予背书。',
  terms_use_title: '合理使用',
  terms_use_body:
    '你承诺不使用本工具创建或传播违法、侵犯他人权利或损害他人的内容。你必须遵守所接入的任何第三方 AI 服务的条款。',
  terms_ip_title: '知识产权',
  terms_ip_body:
    'Open Tavern 软件及其原创内置角色依据 AGPL-3.0 许可。你用本工具创建的内容归你所有。若导入第三方角色卡，你需自行确保拥有使用权限。',
  terms_third_title: '第三方服务',
  terms_third_body:
    '你可自行决定接入外部 AI 服务或加载第三方资源，风险自负。我们不对其可用性、准确性或做法负责，其条款适用于你的使用。',
  terms_warranty_title: '不提供担保',
  terms_warranty_body:
    '本工具按“现状”与“可用”提供，不附带任何形式的担保。我们不保证其不中断、无错误或满足你的需求。',
  terms_liability_title: '责任限制',
  terms_liability_body:
    '在法律允许的最大范围内，对于因使用或无法使用本工具而产生的任何间接、附带或后果性损害，Open Tavern 及其作者不承担责任。',
  terms_changes_title: '条款变更',
  terms_changes_body:
    '我们可能不时更新本条款。上方日期为最新修订日期。变更后继续使用即表示你接受更新后的条款。',
  terms_lang_note_title: '条款语言',
  terms_lang_note_body: '本条款以英文提供，译文仅供参考。如有出入，以英文版本为准。',
  terms_contact_title: '联系我们',
  terms_contact_body: '对条款有疑问？请发邮件至',
  terms_seo_title: '服务条款 · Open Tavern · RoleChat AI',
  terms_seo_desc:
    'Open Tavern 是中性的客户端创作工具：自带 AI 密钥，内容由你自负。阅读完整服务条款。',
};

// ── 正文：繁體中文 ────────────────────────────────────────────────
const ZH_TW = {
  nav_privacy: '隱私政策',
  nav_terms: '服務條款',

  privacy_back_home: '← 首頁',
  privacy_title: '隱私政策',
  privacy_updated: '最後更新：2026 年 7 月 26 日',
  privacy_intro:
    'Open Tavern（又稱 RoleChat AI）是一款在瀏覽器中執行的用戶端工具，不提供使用者帳號、後端服務或伺服器端 API。本頁說明涉及的資料及其處理方式。',
  privacy_nodata_title: '我們不收集您的個人資料',
  privacy_nodata_body:
    '本工具無需登入，沒有伺服器端資料庫，也沒有與您綁定的分析帳號。使用時無需提供姓名、電子郵件等任何個人資訊。只有當您主動來信時，我們才會收到您的電子郵件。',
  privacy_local_title: '您的資料保存在您的裝置上',
  privacy_local_body:
    '您的全部對話、角色、世界書與設定都保存在瀏覽器本地（使用瀏覽器的本地儲存與 OPFS）。這些資料不會經由我們離開您的裝置。清除瀏覽器資料或網站儲存會永久刪除它們，我們無法復原。',
  privacy_api_title: '您自備的 AI 服務',
  privacy_api_body:
    'Open Tavern 不執行自有的模型服務。您聊天時，訊息會從瀏覽器直接傳送至您設定的 AI 服務（使用您自行填寫的 API 金鑰與端點）。我們不代理、不讀取、不儲存這些請求——它們只會在您的瀏覽器與您選擇的服務之間傳輸。',
  privacy_third_title: '第三方資源',
  privacy_third_body:
    '應用程式會從內容傳遞網路（CDN）載入一些靜態資源，例如樣式、文字淨化程式庫與網頁字型。若您啟用瀏覽器本地推論，模型檔案會從公共模型 CDN 直接下載到您的瀏覽器。這些外部服務各有自己的隱私作法，我們無法控制。',
  privacy_cookies_title: 'Cookie 與本地儲存',
  privacy_cookies_body:
    '我們僅使用一個最小化的 Cookie 來記住您的語言偏好，本身不使用廣告或追蹤類 Cookie。您的對話與設定保存在瀏覽器本地儲存中，而非 Cookie 中。',
  privacy_ads_title: '廣告',
  privacy_ads_body:
    '若展示廣告，廣告可能由 Google 及其他第三方廣告合作夥伴提供。這些合作夥伴可能使用 Cookie 及類似技術，根據您此前造訪本站及其他網站的情況投放廣告。您可以在 Google 廣告設定中停用個人化廣告，詳情請見 aboutads.info。',
  privacy_children_title: '未成年人',
  privacy_children_body:
    'Open Tavern 面向 13 歲及以上（或您所在地區規定的最低年齡）使用者，不針對更低年齡的未成年人，也不供其使用。',
  privacy_user_content_title: '使用者產生的內容',
  privacy_user_content_body:
    'Open Tavern 是一個中性工具。您使用自備的 AI 服務與自身想像所建立的任何內容，都由您在本地產生並儲存。我們不提供、不託管，也不對使用者建立的內容負責。',
  privacy_changes_title: '本政策的變更',
  privacy_changes_body:
    '我們可能不時更新本隱私政策。上方日期為最新修訂日期。變更後繼續使用即表示您接受更新後的政策。',
  privacy_contact_title: '聯絡我們',
  privacy_contact_body: '對隱私有疑問？請寄信至',
  privacy_seo_title: '隱私政策 · Open Tavern · RoleChat AI',
  privacy_seo_desc:
    'Open Tavern 是隱私優先的用戶端工具：無帳號、無後端、無伺服器端儲存，您的對話與角色都保存在瀏覽器中。閱讀完整隱私政策。',

  terms_back_home: '← 首頁',
  terms_title: '服務條款',
  terms_updated: '最後更新：2026 年 7 月 26 日',
  terms_accept_title: '接受本條款',
  terms_accept_body:
    '開啟或使用 Open Tavern（又稱 RoleChat AI）即表示您同意本服務條款。如不同意，請不要使用本工具。',
  terms_service_title: 'Open Tavern 是什麼',
  terms_service_body:
    'Open Tavern 是一款在瀏覽器中執行的中性用戶端工具，不提供使用者帳號、不執行自有模型服務、不託管對話。您需要自行輸入自己的 API 金鑰來接入 AI 服務。',
  terms_resp_title: '您的責任',
  terms_resp_body:
    '您對所使用的 AI 服務帳號與 API 金鑰負責，包括相關費用及遵守該服務自身的條款。您對所傳送的提示詞及產生的內容負責。',
  terms_content_title: '中性工具——內容由您自負',
  terms_content_body:
    'Open Tavern 作為通用創作工具提供，類似一個文字編輯器。我們不提供成人或性相關角色內容。您用本工具建立的任何內容都是您自己的作品，由您使用自備服務與自身輸入產生，由您自行負責。這些內容不代表 Open Tavern，我們也不予背書。',
  terms_use_title: '合理使用',
  terms_use_body:
    '您承諾不使用本工具建立或傳播違法、侵犯他人權利或損害他人的內容。您必須遵守所接入的任何第三方 AI 服務的條款。',
  terms_ip_title: '智慧財產權',
  terms_ip_body:
    'Open Tavern 軟體及其原創內建角色依據 AGPL-3.0 授權。您用本工具建立的內容歸您所有。若匯入第三方角色卡，您需自行確保擁有使用權限。',
  terms_third_title: '第三方服務',
  terms_third_body:
    '您可自行決定接入外部 AI 服務或載入第三方資源，風險自負。我們不對其可用性、準確性或作法負責，其條款適用於您的使用。',
  terms_warranty_title: '不提供擔保',
  terms_warranty_body:
    '本工具以「現狀」與「可用」提供，不附帶任何形式的擔保。我們不保證其不中斷、無錯誤或滿足您的需求。',
  terms_liability_title: '責任限制',
  terms_liability_body:
    '在法律允許的最大範圍內，對於因使用或無法使用本工具而產生的任何間接、附帶或衍生性損害，Open Tavern 及其作者不承擔責任。',
  terms_changes_title: '條款變更',
  terms_changes_body:
    '我們可能不時更新本條款。上方日期為最新修訂日期。變更後繼續使用即表示您接受更新後的條款。',
  terms_lang_note_title: '條款語言',
  terms_lang_note_body: '本條款以英文提供，譯文僅供參考。如有出入，以英文版本為準。',
  terms_contact_title: '聯絡我們',
  terms_contact_body: '對條款有疑問？請寄信至',
  terms_seo_title: '服務條款 · Open Tavern · RoleChat AI',
  terms_seo_desc:
    'Open Tavern 是中性的用戶端創作工具：自備 AI 金鑰，內容由您自負。閱讀完整服務條款。',
};

// nav 標籤：25 個 locale 全部母語（保持導覽列一致）
const NAV = {
  en: ['Privacy', 'Terms'],
  'zh-CN': ['隐私政策', '服务条款'],
  'zh-TW': ['隱私政策', '服務條款'],
  es: ['Privacidad', 'Términos'],
  ar: ['الخصوصية', 'الشروط'],
  pt: ['Privacidade', 'Termos'],
  ru: ['Конфиденциальность', 'Условия'],
  fr: ['Confidentialité', 'Conditions'],
  de: ['Datenschutz', 'AGB'],
  ja: ['プライバシー', '利用規約'],
  ko: ['개인정보', '약관'],
  it: ['Privacy', 'Termini'],
  nl: ['Privacy', 'Voorwaarden'],
  sv: ['Integritet', 'Villkor'],
  no: ['Personvern', 'Vilkår'],
  da: ['Privatliv', 'Vilkår'],
  fi: ['Tietosuoja', 'Ehdot'],
  pl: ['Prywatność', 'Warunki'],
  tr: ['Gizlilik', 'Şartlar'],
  hi: ['गोपनीयता', 'शर्तें'],
  id: ['Privasi', 'Ketentuan'],
  vi: ['Quyền riêng tư', 'Điều khoản'],
  th: ['ความเป็นส่วนตัว', 'ข้อกำหนด'],
  ms: ['Privasi', 'Terma'],
  tl: ['Pagkapribado', 'Mga Tuntunin'],
};

const NATIVE_BODIES = { en: EN, 'zh-CN': ZH_CN, 'zh-TW': ZH_TW };
const KEYS = Object.keys(EN);

function buildValues(code) {
  const native = NATIVE_BODIES[code] ?? EN; // 正文：非中英文 locale 用英文
  const out = {};
  for (const k of KEYS) out[k] = native[k];
  const nav = NAV[code] ?? NAV.en;
  out.nav_privacy = nav[0];
  out.nav_terms = nav[1];
  return out;
}

const files = readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json'));
let touchedFiles = 0;
const missing = [];

for (const file of files) {
  const code = file.replace(/\.json$/, '');
  const path = join(LOCALES_DIR, file);
  const obj = JSON.parse(readFileSync(path, 'utf8'));
  const values = buildValues(code);
  for (const [k, v] of Object.entries(values)) obj[k] = v;
  writeFileSync(path, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  touchedFiles++;
}

// 校验：每个 locale 都必须包含全部新 key
for (const file of files) {
  const obj = JSON.parse(readFileSync(join(LOCALES_DIR, file), 'utf8'));
  for (const k of [...KEYS, 'nav_privacy', 'nav_terms']) {
    if (!(k in obj)) missing.push(`${file}: ${k}`);
  }
}

console.log(`gen-legal-i18n: updated ${touchedFiles} locale file(s), ${KEYS.length + 2} key(s) each.`);
if (missing.length) {
  console.error(`✗ ${missing.length} missing key(s):\n` + missing.join('\n'));
  process.exit(1);
}
console.log('✓ all locales contain every legal key.');
