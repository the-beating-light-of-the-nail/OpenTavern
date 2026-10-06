# OpenTavern 待办清单

## 国际化（i18n）
- [ ] 补充缺失的翻译键值
- [ ] 完善本地化数据（角色/合集/指南）
- [ ] **新增语言支持**
  - [ ] nl — 荷兰语（荷兰、比利时，CPM 极高，Tier 1）
  - [ ] sv — 瑞典语（瑞典，北欧高价值）
  - [ ] no — 挪威语（挪威，CPM 常居全球前列）
  - [ ] da — 丹麦语（丹麦，高单价北欧市场）
  - [ ] fi — 芬兰语（芬兰，CPM 极高，用户购买力强）
  - [ ] ar — 阿拉伯语（聚焦海湾国家阿联酋、沙特，CPM 很高）
  - [ ] pl — 波兰语（波兰，东欧价值最高的市场之一）
  - [ ] tr — 土耳其语（土耳其，年轻用户多，CPM Tier 2 中上）
  - [ ] hi — 印地语（印度，流量巨大但 CPM 极低，适合做规模）
  - [ ] id — 印尼语（印尼，量大价低）
  - [ ] vi — 越南语（越南，CPM 很低，人口多）
  - [ ] th — 泰语（泰国，东南亚低价流量）
  - [ ] ms — 马来语（马来西亚，价值略高于印尼但总体偏低）
  - [ ] tl — 菲律宾语（菲律宾，CPM 低，大量用户已使用英语）

## 角色系统
- [ ] **搜集高质量角色卡**
  - [ ] 咸鱼
  - [ ] 小红书
  - [ ] Reddit
  - [ ] Discover
  - [ ] 各类角色扮演卡平台
- [ ] 为角色卡配套擦边图片
- [x] 增加角色分类/标签系统（早已上线：/characters 分类 + 标签筛选，2026-10-07 台账核对时勾选）
- [ ] 优化角色卡片展示
- [x] 角色搜索/筛选功能（早已上线：pages/characters/index.vue 搜索框 + 分类 + 标签筛选）

## 对话体验
- [ ] 优化对话流交互
- [ ] 增加对话历史管理
- [ ] 群组对话功能完善
- [ ] WebLLM / ComfyUI 集成优化

## UI/UX
- [ ] 增加更多主题/配色方案
- [ ] 响应式布局优化
- [x] 暗色模式完善（2026-10-06：全站默认切 laopobao 同款 coffee 深色，/app 可切浅色）
- [ ] 动画/过渡效果增强

## SEO & 营销
- [ ] **研究乙女游戏 / 情感扮演方向，打造有深度和广度的 SEO 专题页**
- [ ] 增加更多着陆页
- [ ] 完善 OG 图片覆盖
- [ ] 性能优化（LCP/FID/CLS）
- [ ] 结构化数据（JSON-LD）
- [x] **角色卡下载功能（抢 "download character cards for SillyTavern" 意图，GSC 簇 C 的下载分支）**（2026-10-06 完成）
  - 实现：角色详情页「下载角色卡 (.json)」按钮——客户端即时把该原创角色数据组装成 SillyTavern V3 卡下载（`pages/characters/[slug].vue`），零托管、不上传。
  - 版权处理：按原评估仅对**原创角色**开放；`public/cards/` 下 16 张蔚蓝档案 IP 卡不提供下载入口（其 webp/avif 仅作头像图用）。`/cards` 下载索引页暂缓，待有更多原创卡再做。
- [x] **首页 5 个「即将上线」工具全部转正**（2026-10-06 完成）
  - Card Converter（`/tools/card-converter`）、Worldbook Forge（`/tools/worldbook-forge`）、Preset Lab（`/tools/preset-lab`）、AI Toolkit（`/tools/ai-toolkit`）、Story to Worldbook（`/tools/story-to-worldbook`）全部上线并加入 `/tools` 目录。
- [x] ShaderBackground WebGL 渲染（2026-10-06：classic 主题动态背景 + reduced-motion/低功耗降级）
- [x] **竞品对比页（抢 GSC 簇 B 的导航流量）**（2026-10-07 完成：/compare——OpenTavern vs SillyTavern/RisuAI/AgnAI 对比表 + 选型指南 + FAQ，5 语言，已入首页中枢 resource 分类）

## 功能扩展
- [ ] 用户系统（注册/登录）——需后端/认证方案决策（可用 Supabase），且与"无账号、本地优先"的产品定位有张力，动工前需拍板
- [x] 收藏/点赞功能（2026-10-07 完成：本地版——localStorage 收藏（stores/favorites），角色卡心标 + 详情页收藏 + /characters 收藏筛选；跨设备同步留待用户系统）
- [x] 分享功能（2026-10-07 完成：角色详情页分享行——原生 Web Share / 复制链接 / X / Telegram / Reddit）
- [x] 离线/PWA 支持（2026-10-07 完成：manifest + 图标 + service worker（页面 network-first、静态 cache-first）+ 离线页；SW 版本号 ot-v1，改缓存策略需升版本）
- [ ] API 文档（现状：站内无公开 API，先挂起）

## 工程化
- [ ] 添加测试（单元/集成/e2e）
- [ ] CI/CD 流程完善
- [ ] 组件文档（Storybook）
- [ ] 代码规范检查（ESLint/Prettier）

## 部署运维
- [ ] Docker 化部署
- [ ] 自部署文档
- [ ] 监控/日志
- [ ] 备份策略

---

> 勾选 `[x]` 表示已完成
