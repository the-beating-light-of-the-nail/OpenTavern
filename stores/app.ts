import { defineStore } from 'pinia';
import type { AppData, AppState, Settings } from '~/types/state';
import { createDefaultState, defaultSettings, defaultSillyTavernPreset, DEFAULT_TWO_STAGE_PROMPT } from '~/utils/defaults';
import { useStorage } from '~/composables/useStorage';

// 防抖计时器（模块级，与原版 _persistTimeout 一致）
let _persistTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * 全局应用状态（Pinia）。
 * state 形状与原版 opentavern-data.json 严格对应，运行时额外字段 isGenerating / abortController 不参与持久化。
 */
export const useAppStore = defineStore('app', {
  state: (): AppState => createDefaultState(),

  getters: {
    activeConversation: (s) => (s.activeConvId ? s.conversations[s.activeConvId] : null),
    hasCharacters: (s) => Object.keys(s.characters || {}).length > 0,
  },

  actions: {
    /**
     * 合并补全：老用户数据可能缺少后新增的设置键。
     * 等价于原版 ensureComfySettings / ensureSillyTavernPresetSettings 的逐键回填逻辑。
     */
    ensureSettings() {
      const defs = defaultSettings();
      const s = this.settings as Settings;
      if (!s || typeof s !== 'object') {
        this.settings = defs;
        return;
      }
      // 顶层缺失键回填默认
      for (const k of Object.keys(defs)) {
        if (s[k] === undefined || s[k] === null) (s as any)[k] = (defs as any)[k];
      }
      // 类型修正（与原版逐条一致）
      if (typeof s.twoStageEnabled !== 'boolean') s.twoStageEnabled = false;
      if (typeof s.twoStageTemperature !== 'number') s.twoStageTemperature = 0.3;
      if (typeof s.twoStageTopP !== 'number') s.twoStageTopP = 0.85;
      if (typeof s.twoStageIncludeRecentContext !== 'boolean') s.twoStageIncludeRecentContext = false;
      if (!s.twoStageSystemPrompt) s.twoStageSystemPrompt = DEFAULT_TWO_STAGE_PROMPT;
      if (typeof s.requestCotEnabled !== 'boolean') s.requestCotEnabled = false;
      if (typeof s.showCotEnabled !== 'boolean') s.showCotEnabled = true;
      if (typeof s.ollamaCompatMode !== 'boolean') s.ollamaCompatMode = false;
      if (typeof s.postHistoryInstructions !== 'string') s.postHistoryInstructions = '';
      if (typeof s.twoStagePostHistoryInstructions !== 'string') s.twoStagePostHistoryInstructions = '';
      if (typeof s.summaryPrompt !== 'string') s.summaryPrompt = '';
      // ComfyUI 字符串化
      s.comfyServer = String(s.comfyServer ?? defs.comfyServer);
      s.comfyWorkflowName = String(s.comfyWorkflowName ?? '');
      s.comfyPositiveNodeId = String(s.comfyPositiveNodeId ?? '');
      s.comfyNegativeNodeId = String(s.comfyNegativeNodeId ?? '');
      s.comfySeedNodeId = String(s.comfySeedNodeId ?? '');
      s.comfyNegativePrompt = String(s.comfyNegativePrompt ?? defs.comfyNegativePrompt);
      s.comfyPromptTemplate = String(s.comfyPromptTemplate ?? defs.comfyPromptTemplate);
      // SillyTavern Preset 结构保证
      if (!s.sillyTavernPreset || typeof s.sillyTavernPreset !== 'object') s.sillyTavernPreset = defaultSillyTavernPreset();
      const preset = s.sillyTavernPreset;
      if (!Array.isArray(preset.prompts)) preset.prompts = [];
      if (!Array.isArray(preset.promptOrder)) preset.promptOrder = [];
      preset.name = String(preset.name ?? '');
      preset.importedAt = String(preset.importedAt ?? '');
    },

    /** 从存储加载并注入 state；无数据时保持默认空状态 */
    async load() {
      const { service } = useStorage();
      service.installPageHideFlush();
      const { data } = await service.load();
      if (data) {
        this.settings = (data.settings && typeof data.settings === 'object') ? data.settings : defaultSettings();
        this.conversations = data.conversations || {};
        this.conversationOrder = data.conversationOrder || [];
        this.activeConvId = data.activeConvId ?? null;
        this.worldBooks = data.worldBooks || {};
        this.characters = data.characters || {};
        this.charactersMigrated = !!data.charactersMigrated;
        this.lastSaved = data.lastSaved || Date.now();
      } else {
        this.lastSaved = Date.now();
      }
      this.ensureSettings();
    },

    /** 防抖持久化（450ms），immediate=true 时立即写。等价原版 persistState() */
    persist(immediate = false) {
      const data: AppData = {
        settings: this._safeSettingsForPersist(),
        conversations: this.conversations,
        conversationOrder: this.conversationOrder,
        activeConvId: this.activeConvId,
        worldBooks: this.worldBooks || {},
        characters: this.characters || {},
        charactersMigrated: !!this.charactersMigrated,
        lastSaved: Date.now(),
      };

      const { service } = useStorage();
      const doPersist = async () => {
        try {
          await service.saveAll(data);
        } catch (e) {
          console.error('[persist] Save error:', e);
        }
      };

      if (immediate) {
        if (_persistTimer) { clearTimeout(_persistTimer); _persistTimer = null; }
        return doPersist();
      }

      if (_persistTimer) clearTimeout(_persistTimer);
      _persistTimer = setTimeout(() => {
        _persistTimer = null;
        doPersist();
      }, 450);
      return Promise.resolve();
    },

    /** 脱敏：未开启 saveApiKey 时剔除 apiKey / summarizeApiKey，避免明文落盘 */
    _safeSettingsForPersist(): Settings {
      const s: Settings = JSON.parse(JSON.stringify(this.settings || {}));
      if (!s.saveApiKey) {
        s.apiKey = '';
        s.summarizeApiKey = '';
      }
      return s;
    },

    setActiveConv(id: string | null) {
      this.activeConvId = id;
      this.persist();
    },
  },
});
