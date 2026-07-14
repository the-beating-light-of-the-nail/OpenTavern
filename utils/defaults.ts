import type { AppData, Settings, SillyTavernPreset, AppState } from '~/types/state';

/**
 * 默认值 —— 与原版逐字移植（index.html:6232 DEFAULT_TWO_STAGE_PROMPT / 6316 defaultSettings /
 * 12961 defaultSillyTavernPreset / 7057 appStore initialState）。
 * 修改这些默认值会破坏与老用户数据的兼容，须谨慎。
 */

export const DEFAULT_TWO_STAGE_PROMPT = [
  '你是一个专门为角色扮演对话生成“下一步行动选项 + 小提示”的结构化助手。',
  '请严格基于刚刚完成的正文回复生成选项。',
  '不要续写正文，不要解释，不要添加前言或结语，只输出以下 XML 结构：',
  '',
  '<options>',
  '  <option>',
  '    <title>2-5字短标题</title>',
  '    <description>25-55字的行动导向描述，可包含亲密元素，但必须符合当前场景与角色性格。优先提供有创意且自然的发展方向。</description>',
  '  </option>',
  '  <!-- 共提供2-4个选项 -->',
  '</options>',
  '',
  '硬性要求：',
  '- 共提供 2-4 个 option。',
  '- title 必须短，description 必须可执行、贴合当前剧情。',
  '- 选项之间应有明显差异，避免机械重复。',
  '- 只输出 XML，不要 Markdown。',
].join('\n');

export function defaultSillyTavernPreset(): SillyTavernPreset {
  return { name: '', importedAt: '', prompts: [], promptOrder: [] };
}

export function defaultSettings(): Settings {
  return {
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: '',
    saveApiKey: false,
    ollamaCompatMode: false,
    model: 'gpt-4o',
    contextLength: 20,
    maxTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    userName: 'User',
    systemPrompt: '',
    postHistoryInstructions: '',
    twoStageEnabled: false,
    twoStageTemperature: 0.3,
    twoStageTopP: 0.85,
    twoStageIncludeRecentContext: false,
    twoStageSystemPrompt: DEFAULT_TWO_STAGE_PROMPT,
    twoStagePostHistoryInstructions: '',
    requestCotEnabled: false,
    showCotEnabled: true,
    cotMode: 'auto',
    userDescription: '',
    sillyTavernPreset: defaultSillyTavernPreset(),
    lang: 'en',
    summaryEnabled: true,
    autoSummarizeOnReply: false,
    summaryThreshold: 12,
    summaryMaxWords: 0,
    summaryPrompt: '',
    worldInfoBudgetEnabled: true,
    worldInfoBudget: 2048,
    uiTheme: 'new-light',
    lowPowerMode: false,
    summarizeUseMainAPI: true,
    summarizeApiEndpoint: '',
    summarizeApiKey: '',
    summarizeModel: 'deepseek-chat',
    inferenceBackend: 'remote-api',
    webllmModel: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    comfyEnabled: false,
    comfyServer: 'http://127.0.0.1:8188',
    comfyWorkflow: null,
    comfyWorkflowName: '',
    comfyPositiveNodeId: '',
    comfyNegativeNodeId: '',
    comfySeedNodeId: '',
    comfyNegativePrompt: 'low quality, blurry, bad anatomy, bad hands',
    comfyPromptTemplate: 'masterpiece, best quality, anime style, {{char}}, {{scene}}',
  };
}

/** 运行时 store 初始状态（含运行时字段 isGenerating/abortController） */
export function createDefaultState(): AppState {
  return {
    settings: defaultSettings(),
    conversations: {},
    conversationOrder: [],
    activeConvId: null,
    worldBooks: {},
    characters: {},
    charactersMigrated: true,
    lastSaved: 0,
    isGenerating: false,
    abortController: null,
    ready: false,
    currentView: 'library',
    sidebarOpen: false,
    streamingContent: '',
    streamingCot: '',
  };
}

/** 清空数据时写入的空数据形状（与原版 clearAllData emptyData 一致） */
export function createEmptyData(): AppData {
  return {
    lastSaved: Date.now(),
    conversations: {},
    conversationOrder: [],
    activeConvId: null,
    worldBooks: {},
    characters: {},
    settings: {} as Settings,
    charactersMigrated: true,
  };
}
