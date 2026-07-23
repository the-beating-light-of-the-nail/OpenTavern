import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

/**
 * UI 运行时状态：模态框统一开关控制。
 * 同一时刻可开启多个模态（如 WebLLM 确认 + 通用对话框），由各模态组件读取 isOpen(name)。
 * 每个模态可携带 payload（如角色编辑器接收待编辑的角色卡对象）。
 */
export type ModalName =
  | 'settings'
  | 'webllmConfirm'
  | 'webllmProgress'
  | 'appDialog'
  | 'promptViewer'
  | 'charImport'
  | 'charEditor'
  | 'worldBook'
  | 'summaryManager'
  | 'announce'
  | 'newChatPicker'
  | 'quickNewChat'
  | 'groupMention';

export const useUiStore = defineStore('ui', {
  state: () => ({
    /** 每个模态的开启状态 */
    _open: {} as Record<string, boolean>,
    /** 每个模态的载荷（可选） */
    _payload: {} as Record<string, any>,
    /** 通用对话框（appDialog）队列化数据 */
    dialog: {
      open: false,
      title: '',
      message: '',
      icon: '!',
      danger: false,
      showCancel: false,
      okText: '',
      cancelText: '',
      _resolve: null as null | ((v: boolean) => void),
    },
  }),

  getters: {
    isOpen: (s) => (name: ModalName) => !!s._open[name],
    payload: (s) => (name: ModalName) => s._payload[name] ?? null,
  },

  actions: {
    open(name: ModalName, payload: any = null) {
      this._open[name] = true;
      if (payload !== null) this._payload[name] = payload;
    },
    close(name: ModalName) {
      this._open[name] = false;
    },
    toggle(name: ModalName) {
      this._open[name] = !this._open[name];
    },

    /** 通用确认/提示对话框，返回 Promise<boolean>（true=确定，false=取消） */
    showDialog(opts: { title?: string; message: string; icon?: string; danger?: boolean; showCancel?: boolean; okText?: string; cancelText?: string }): Promise<boolean> {
      let t: (k: string) => string = (k) => k;
      try { const app = useNuxtApp(); if (app?.$i18n?.t) t = (k: string) => app.$i18n.t(k); } catch { /* noop */ }
      this.dialog.title = opts.title || (opts.showCancel ? t('dialog_confirm_default_title') : t('dialog_info_default_title'));
      this.dialog.message = String(opts.message || '');
      this.dialog.icon = opts.icon || (opts.showCancel ? '?' : '!');
      this.dialog.danger = !!opts.danger;
      this.dialog.showCancel = !!opts.showCancel;
      this.dialog.okText = opts.okText || '';
      this.dialog.cancelText = opts.cancelText || '';
      this.dialog.open = true;
      return new Promise((resolve) => {
        this.dialog._resolve = resolve;
      });
    },
    resolveDialog(value: boolean) {
      this.dialog.open = false;
      const r = this.dialog._resolve;
      this.dialog._resolve = null;
      if (r) r(value);
    },
  },
});
