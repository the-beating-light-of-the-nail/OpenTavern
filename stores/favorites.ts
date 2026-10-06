import { defineStore } from 'pinia';

/**
 * 角色收藏（站级点赞的本地实现）：localStorage 持久化的 slug 集合。
 * 无账号体系下的收藏设计——数据只在本浏览器，不上传、不同步。
 */
const FAV_KEY = 'opentavern-char-favs';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    slugs: [] as string[],
    loaded: false,
  }),

  getters: {
    has: (s) => (slug: string) => s.slugs.includes(slug),
    count: (s) => s.slugs.length,
    /** 仅返回在给定清单中已收藏的（用于网格过滤；收藏的失效 slug 自动忽略） */
    filterFaved: (s) => (list: string[]) => list.filter((x) => s.slugs.includes(x)),
  },

  actions: {
    load() {
      if (this.loaded || typeof window === 'undefined') return;
      try {
        const raw = localStorage.getItem(FAV_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        this.slugs = Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
      } catch {
        this.slugs = [];
      }
      this.loaded = true;
    },

    persist() {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(this.slugs));
      } catch { /* 配额满等异常静默 */ }
    },

    toggle(slug: string): boolean {
      this.load();
      const at = this.slugs.indexOf(slug);
      if (at >= 0) this.slugs.splice(at, 1);
      else this.slugs.unshift(slug);
      this.persist();
      return at < 0;
    },
  },
});
