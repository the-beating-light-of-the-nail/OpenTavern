import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'How to Start AI Roleplay (Even If You\'ve Never Done It Before)',
    description:
      'A complete beginner\'s guide to starting your first AI roleplay on RoleChat AI. Pick a character, add your AI key, and send your first message in under five minutes.',
    sections: [
      {
        heading: 'What is AI roleplay?',
        paragraphs: [
          'AI roleplay is a conversation between you and an AI that is acting as a fictional character. You play yourself — or anyone you want to be — and the AI responds in character, in real time, building a story with you one message at a time.',
          'Unlike a chatbot that answers questions, a roleplay character has a personality, a backstory, a way of speaking, and a relationship to you. The goal isn\'t to get information. It\'s to live inside a story with someone who feels real.',
          'On RoleChat AI, every character is original — not copied from a game or a show — and every conversation is completely private, running in your browser with your own AI key.',
        ],
      },
      {
        heading: 'Step 1: Pick a character',
        paragraphs: [
          'Go to the Characters page and browse the library. Each character has a name, a tagline, a short description, and personality tags so you know what you\'re getting into before you start.',
          'New to romance roleplay? Start with a "comfort" or "slow burn" character. They\'re gentler and more forgiving — perfect for finding your footing. You can always try a more intense character later.',
          'Once you\'ve found one you like, click their card to open their character page. Read the description and the opening message — that opening message is exactly how your conversation will begin.',
        ],
      },
      {
        heading: 'Step 2: Open the app and add your AI key',
        paragraphs: [
          'Click the "Start Private Chat" button on any character page to open the app. Before your first message, you\'ll need to add an AI key — a short secret string that lets the app talk to an AI provider.',
          'Don\'t have a key yet? See our guide on how to get an AI key — it takes about two minutes. Your key is stored only in your browser; we never see it or store it on a server.',
          'Once your key is in, the app is ready. You won\'t need to do this again unless you switch devices or clear your browser data.',
        ],
      },
      {
        heading: 'Step 3: Send your first message',
        paragraphs: [
          'The character will have already sent you an opening message — that\'s the scene-setter. Your job is simply to respond. You don\'t need to be a writer. You don\'t need to be clever. Just type what you\'d actually say.',
          'A great first message is often short and human: a reaction, a question, a gesture described in asterisks. For example, if a cold doctor hands you coffee, you might just say "Thank you" and watch what happens.',
          'The AI will respond in character, and the story builds from there. There\'s no wrong way to play — follow your curiosity, and the character will meet you there.',
        ],
      },
      {
        heading: 'Tips for your first session',
        paragraphs: [
          'Stay in character yourself if you can — it makes the world feel more real. But it\'s also okay to step back and just enjoy the ride.',
          'If a response doesn\'t feel right, you can regenerate it or edit your last message. Roleplay is collaborative; you\'re allowed to steer.',
          'Most of all: there\'s no rush. The best roleplay unfolds slowly. Let the relationship breathe.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Browse characters', to: '/characters' },
      { label: 'Open the app', to: '/app' },
      { label: 'How to get an AI key', to: '/guides/how-to-get-an-api-key' },
      { label: 'Tips for better roleplay', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'How to Get an AI Key for RoleChat AI',
    description:
      'A step-by-step guide to getting an OpenAI-compatible API key and adding it to RoleChat AI. No technical background needed — takes about two minutes.',
    sections: [
      {
        heading: 'What is an API key?',
        paragraphs: [
          'An API key is a short secret string — usually starting with "sk-" — that lets RoleChat AI talk to an AI provider on your behalf. It\'s how the app knows you\'re allowed to use the AI.',
          'You bring your own key, which means you choose the provider, you pay only for what you use, and your conversations go directly between your browser and that provider. There is no middleman.',
        ],
      },
      {
        heading: 'Step 1: Choose a provider',
        paragraphs: [
          'RoleChat AI works with any provider that offers an OpenAI-compatible API. Popular choices include well-known labs and newer low-cost providers. Pick one that\'s available in your region and fits your budget.',
          'Not sure where to start? Look for a provider with a generous free trial or low per-message pricing. You can always switch later by pasting a new key into Settings.',
        ],
      },
      {
        heading: 'Step 2: Create an account and generate a key',
        paragraphs: [
          'Sign up at your chosen provider\'s website, then find the "API keys" or "Access tokens" section of your dashboard. Click "Create new key," give it a name you\'ll remember, and copy the string it shows you.',
          'Important: most providers only show the full key once. Save it somewhere safe right away — if you lose it, you\'ll need to generate a new one.',
        ],
      },
      {
        heading: 'Step 3: Add it to RoleChat AI',
        paragraphs: [
          'Open the RoleChat AI app, click Settings, and paste your key into the "API Key" field. Add the provider\'s endpoint URL into the "API Endpoint" field (this is usually shown on the same dashboard page as your key).',
          'Optionally, choose a model from the dropdown. If you\'re unsure, pick the provider\'s recommended default — it\'s balanced for quality and cost.',
          'That\'s it. You\'re ready to chat. Your key stays in your browser and is never sent to us.',
        ],
      },
      {
        heading: 'Keeping your key safe',
        paragraphs: [
          'Never share your API key publicly — it\'s like a password for your AI account. If you think it\'s been compromised, regenerate it at your provider and update Settings.',
          'On a shared or public device, don\'t enable "save key to this browser." On your own device, it\'s safe to save it for convenience.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Open the app to add your key', to: '/app' },
      { label: 'Browse characters', to: '/characters' },
      { label: 'Start your first roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Tips for Better AI Roleplay',
    description:
      'Small habits that make AI characters feel more alive — tone, pacing, and how to gently steer the story without breaking immersion.',
    sections: [
      {
        heading: 'Respond like a person, not a prompt',
        paragraphs: [
          'The biggest beginner mistake is writing to the AI instead of writing to the character. Don\'t describe what you want to happen — just say what you\'d actually say. The AI is already playing the scene; your job is to be in it.',
          'Short, genuine replies almost always work better than long, over-written ones. A real "I don\'t know what to say" can move a scene further than a paragraph of narration.',
        ],
      },
      {
        heading: 'Use actions in asterisks',
        paragraphs: [
          'Wrapping a small action in asterisks — like *looks away* or *hands him the cup* — gives the character something physical to react to. It\'s the easiest way to add texture without writing a novel.',
          'Don\'t overdo it. One or two actions per message is plenty. Too many and it starts to feel like stage directions instead of a conversation.',
        ],
      },
      {
        heading: 'Let the relationship breathe',
        paragraphs: [
          'The best romance roleplay is slow. If you rush to a confession in the first three messages, the character has nowhere to grow. Let trust build, let tension simmer, let the small moments matter.',
          'Characters are written with emotional pacing in mind — pushing too hard too fast can make them feel out of character. Follow their lead, and the payoff is worth it.',
        ],
      },
      {
        heading: 'Steer when you need to',
        paragraphs: [
          'Roleplay is collaborative. If a response doesn\'t fit the story you want, you can edit your last message and try again, or regenerate the character\'s reply. You\'re not stuck with the first version.',
          'You can also gently redirect in-character: change the subject, leave the room, ask a question. The character will usually follow your lead without breaking the scene.',
        ],
      },
      {
        heading: 'Know when to stop',
        paragraphs: [
          'A great roleplay session is like a good chapter — it ends at a natural pause. When you\'re tired, stop. The conversation will be here when you come back, and the character will remember where you left off.',
          'There\'s no prize for marathon sessions. The story gets better when you\'re fresh.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Browse characters', to: '/characters' },
      { label: 'Open the app', to: '/app' },
      { label: 'New to roleplay? Start here', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];

export function getGuideBySlug(slug: string): GuideSeo | undefined {
  return guides.find((g) => g.slug === slug);
}
