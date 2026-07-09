/**
 * OpenTavern 状态类型定义。
 * 重点：序列化文件 `opentavern-data.json` 的形状必须与原版 100% 一致，
 * 故嵌套的 conversations / characters / worldBooks 使用宽松类型（Record<string, any>），
 * 保证任意字段都能无损往返（round-trip），不因类型收窄而丢数据。
 */

/** SillyTavern Preset Prompts 结构（settings.sillyTavernPreset） */
export interface SillyTavernPreset {
  name: string;
  importedAt: string;
  prompts: any[];
  promptOrder: any[];
  [k: string]: any;
}

/** 用户设置 —— 与原版 defaultSettings() 字段逐一对应 */
export interface Settings {
  apiEndpoint: string;
  apiKey: string;
  saveApiKey: boolean;
  ollamaCompatMode: boolean;
  model: string;
  contextLength: number;
  maxTokens: number;
  temperature: number;
  topP: number;
  userName: string;
  systemPrompt: string;
  postHistoryInstructions: string;
  twoStageEnabled: boolean;
  twoStageTemperature: number;
  twoStageTopP: number;
  twoStageIncludeRecentContext: boolean;
  twoStageSystemPrompt: string;
  twoStagePostHistoryInstructions: string;
  requestCotEnabled: boolean;
  showCotEnabled: boolean;
  cotMode: string;
  userDescription: string;
  sillyTavernPreset: SillyTavernPreset;
  lang: string;
  summaryEnabled: boolean;
  autoSummarizeOnReply: boolean;
  summaryThreshold: number;
  summaryMaxWords: number;
  summaryPrompt: string;
  worldInfoBudgetEnabled: boolean;
  worldInfoBudget: number;
  uiTheme: 'classic' | 'new-light' | 'new-dark' | string;
  lowPowerMode: boolean;
  summarizeUseMainAPI: boolean;
  summarizeApiEndpoint: string;
  summarizeApiKey: string;
  summarizeModel: string;
  inferenceBackend: 'remote-api' | 'webllm' | string;
  webllmModel: string;
  comfyEnabled: boolean;
  comfyServer: string;
  comfyWorkflow: any;
  comfyWorkflowName: string;
  comfyPositiveNodeId: string;
  comfyNegativeNodeId: string;
  comfySeedNodeId: string;
  comfyNegativePrompt: string;
  comfyPromptTemplate: string;
  [k: string]: any;
}

/**
 * 持久化数据形状（即 opentavern-data.json 的内容）。
 * 与原版 persistState() 构造的 dataToSave 严格一致。
 */
export interface AppData {
  settings: Settings;
  conversations: Record<string, any>;
  conversationOrder: string[];
  activeConvId: string | null;
  worldBooks: Record<string, any>;
  characters: Record<string, any>;
  charactersMigrated?: boolean;
  lastSaved: number;
  [k: string]: any;
}

/** 运行时 store 状态 = AppData 去掉 lastSaved（运行时单独维护） + 运行时字段 */
export interface AppState extends Omit<AppData, 'lastSaved'> {
  lastSaved: number;
  isGenerating: boolean;
  abortController: AbortController | null;
  /** 运行时：存储加载是否完成（仅前端） */
  ready: boolean;
  /** 运行时：当前视图（库 / 聊天） */
  currentView: 'library' | 'chat';
  /** 运行时：移动端侧栏抽屉是否展开 */
  sidebarOpen: boolean;
  /** 运行时：流式生成中的临时内容（实时显示） */
  streamingContent: string;
  /** 运行时：流式生成中的 CoT */
  streamingCot: string;
}

export type StorageBackend = 'opfs' | 'idb' | 'legacy-idb' | 'localStorage';

export interface StorageCandidate {
  backend: StorageBackend;
  data: AppData;
}

export interface StorageInfo {
  backend: StorageBackend;
  used: number;
  quota: number | null;
  originUsed?: number;
}
