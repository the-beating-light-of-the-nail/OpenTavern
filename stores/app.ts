import { defineStore } from 'pinia';
import type { AppData, AppState, Settings } from '~/types/state';
import { createDefaultState, defaultSettings, defaultSillyTavernPreset, DEFAULT_TWO_STAGE_PROMPT } from '~/utils/defaults';
import { useStorage } from '~/composables/useStorage';
import { replacePlaceholders, makeId } from '~/utils/chat-helpers';
import { normalizeConversation } from '~/utils/group-helpers';

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

    /** 新增角色到本地角色库，返回生成的角色 id */
    addCharacter(character: Record<string, any>): string {
      const id = makeId();
      this.characters[id] = { id, data: character };
      this.persist();
      return id;
    },

    /** 更新已有角色（编辑模式）；角色不存在则忽略 */
    updateCharacter(id: string, character: Record<string, any>): void {
      if (this.characters[id]) {
        this.characters[id] = { id, data: character };
        this.persist();
      }
    },

    /**
     * 创建新会话（单角色 / 群组）。
     * 逐字移植原版 newConversation（index.html:574585）。
     * - 单角色：传入角色卡条目（含 .data）或裸角色对象；存 conv.character 深拷贝 + characterId/Name。
     * - 群组：传入长度>=2 的数组；成员 1:1 深拷贝整张卡（原版行为），首成员开场白带 speaker。
     * charEntry.data 视为平坦角色卡（name/first_mes/...）。
     */
    createConversation(charOrEntries?: any | any[]): string {
      this.persist();

      const conv: any = {
        id: makeId(),
        title: 'New Chat',
        character: null,
        messages: [],
        summaries: [],
        worldBookIds: [],
        group: null,
        created: Date.now(),
        updated: Date.now(),
      };

      const userName = this.settings.userName || 'User';
      // 角色卡条目 → 平坦角色（深拷贝）
      const flatChar = (entry: any): any => {
        if (!entry) return null;
        const src = entry && entry.data ? entry.data : entry;
        return src ? JSON.parse(JSON.stringify(src)) : null;
      };

      // i18n（在 Nuxt 上下文中可用）
      let t: (k: string, opts?: Record<string, any>) => string = (k) => k;
      try {
        const app: any = useNuxtApp();
        if (app?.$i18n?.t) t = (k: string, opts?: Record<string, any>) => app.$i18n.t(k, opts);
      } catch { /* noop */ }

      if (Array.isArray(charOrEntries) && charOrEntries.length >= 2) {
        // 群组模式
        const members = charOrEntries.map((entry: any, idx: number) => ({
          character: flatChar(entry),
          muted: false,
          order: idx,
        }));
        conv.group = {
          id: makeId(),
          name: t('group_chat_name_format', { names: members.map((m: any) => m.character?.name).filter(Boolean).join('、') }),
          members,
          replyStrategy: 'list_order',
          generationMode: 'switch',
          mergeIncludeMuted: false,
          scenarioOverride: null,
          allowSelfResponse: false,
          autoMode: false,
        };
        const first = members[0].character;
        if (first && first.first_mes) {
          const fm = replacePlaceholders(first.first_mes, first.name, userName);
          if (fm) conv.messages.push({ role: 'assistant', content: fm, speaker: first.name });
        }
        conv.title = conv.group.name;
      } else {
        // 单角色模式（含数组长度=1 的兜底）
        const entry: any = Array.isArray(charOrEntries) ? charOrEntries[0] : charOrEntries;
        const character = flatChar(entry);
        if (character) {
          conv.character = character;
          if (entry && entry.id) conv.characterId = entry.id;
          conv.characterName = character.name;
          const charName = character.name || 'Assistant';
          const fm = replacePlaceholders(character.first_mes, charName, userName);
          if (fm) conv.messages.push({ role: 'assistant', content: fm });
          conv.title = t('chat_with') + (character.name || '');
        }
      }

      normalizeConversation(conv);
      this.conversations[conv.id] = conv;
      this.conversationOrder.unshift(conv.id);
      this.activeConvId = conv.id;
      this.currentView = 'chat';
      this.persist();
      return conv.id;
    },
  },
});
