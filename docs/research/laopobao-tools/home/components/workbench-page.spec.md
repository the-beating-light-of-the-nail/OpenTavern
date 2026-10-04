# 页面规格：pages/index.vue（工作台首页组装）

- **源站对照**：`#root > div.min-h-screen.flex.flex-col` + `main.container`
- **目标文件**：`pages/index.vue`（整页替换，用户已确认方案 A）
- **交互模型**：`static` + 分类筛选 `click-driven`

## 保留 / 移除清单

| 原首页内容 | 处置 |
| --- | --- |
| `SiteHeader` | 替换为 `<WorkbenchHeader>` |
| Hero（`rc-hero-bg` + `PetalField` + badge + h1 + CTA） | **移除**（源站无 hero） |
| 工具中枢（侧栏 + 网格，旧版 3 列） | 重建为工作台骨架（4 列 + 新卡样式） |
| `home_featured_eyebrow` 分隔条 | 移除 |
| Popular Romance Characters + `AdCard` 网格内插 | 移除 |
| SillyTavern Compatible 区 | 移除 |
| How It Works 区 | 移除 |
| Private by Design 区 | 移除 |
| Beginner Guides 区 | 移除 |
| FAQ 区 | 移除 |
| Footer CTA 区 | 移除 |
| 内联 footer | 替换为 `.wb-footer` 极简页脚 |
| `content` 位 `AdBanner`（Hero 下方） | 保留，改挂到工具网格下方 `.wb-ads` |
| `AdCard`（native 卡） | 保留，同挂 `.wb-ads`（不再插进网格，避免 330×280 撑破 249px 卡位） |

## 结构

```html
<div class="wb-shell">
  <WorkbenchHeader />
  <main class="wb-main">
    <div class="wb-layout">
      <HubCategoryNav variant="rail" :categories="categories" v-model="activeCat" />
      <div class="wb-content">
        <HubCategoryNav variant="pills" :categories="categories" v-model="activeCat" />
        <div class="wb-head">
          <div>
            <h1 class="wb-title">{{ t('home_hub_title') }}</h1>
            <p class="wb-sub">{{ t('home_hub_desc') }}</p>
          </div>
        </div>
        <div class="wb-grid">
          <HubToolCard v-for="tool in filteredHub" :key="tool.slug" :tool="tool"
                       :category-label="catLabelOf(tool.category)" :to="toOf(tool)" />
        </div>
        <ClientOnly>…广告位…</ClientOnly>
      </div>
    </div>
  </main>
  <footer class="wb-footer">…</footer>
</div>
```

## 数据流

- `activeCat: Ref<HubCategory | 'all'>`，初始 `'all'`
- `categories` = `HUB_CATEGORIES.map(c => ({ id, label: t(c.labelKey), count }))`，`count` 运行时算
- `filteredHub` = `activeCat === 'all' ? HOME_HUB : HOME_HUB.filter(x => x.category === activeCat)`
- `toOf(tool)` = `tool.href ?? localePath(tool.to ?? '/')`
- `catLabelOf(id)` = `t(HUB_CATEGORIES.find(c => c.id === id)?.labelKey ?? 'home_hub_cat_all')`

## SEO

- `useSeoMeta` 保持原样（`home_seo_title` / `home_seo_desc` / og 两项）——标题与描述不进正文也不改动
- `<h1>` 唯一，文案 = `home_hub_title`（对应源站「探索工具」）
- 页脚保留 /about /contact /privacy /terms 内链（合规与外链权重）

## 页脚内容

```
[OT] Open Tavern                              Tools · Characters · Guides · About · Contact · Privacy · Terms · Open App
{{ t('home_footer_tagline') }}
```

## 广告位

```html
<ClientOnly>
  <div v-if="anyContentOn || state.nativeBanner" class="wb-ads">
    <div v-if="anyContentOn" class="wb-ads-row">
      <AdBanner v-for="ad in contentAds" v-show="state[ad.id]" :key="ad.id"
                :src="ad.html" :width="ad.width" :height="ad.height" />
    </div>
    <AdCard />
  </div>
</ClientOnly>
```

- `contentAds` 过滤逻辑与旧版完全一致：`placement === 'content'` 且 `html/width/height` 齐全
- `anyContentOn` = 任一 content 位开启（`?adpanel=1` 面板控制）
- 默认状态：content 位全部 `defaultOn: false` → 不渲染；`nativeBanner` `defaultOn: true` → 渲染在网格下方
