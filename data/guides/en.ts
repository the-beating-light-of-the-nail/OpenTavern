import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'How to Start AI Roleplay as a Beginner',
    datePublished: '2026-07-15',
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
    datePublished: '2026-07-15',
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
    datePublished: '2026-07-15',
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
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'How to Use OpenRouter for AI Character Roleplay',
    datePublished: '2026-07-15',
    description:
      'A step-by-step beginner guide to using OpenRouter with RoleChat AI. Create an account, get your API key, pick a model, and start chatting with original romance characters in minutes.',
    sections: [
      {
        heading: 'What is OpenRouter?',
        paragraphs: [
          'OpenRouter is a service that lets you access dozens of AI models from different providers through a single API. Instead of signing up separately for OpenAI, Anthropic, Google, and others, you create one OpenRouter account and use any model they offer.',
          'For AI roleplay, this is incredibly convenient. You can try different models, compare their writing styles, and switch whenever you want — all without changing your API key or leaving the app.',
        ],
      },
      {
        heading: 'Why OpenRouter works well for roleplay',
        paragraphs: [
          'Roleplay needs models that are good at creative writing, staying in character, and producing longer, immersive responses. OpenRouter gives you access to many such models, including some that are very affordable.',
          'Because you only pay for what you use, you can experiment freely. Start with a cheaper model, and if the writing feels flat, try a more powerful one — the switch takes seconds.',
        ],
      },
      {
        heading: 'Step 1: Create an OpenRouter account',
        paragraphs: [
          'Go to openrouter.ai and sign up. The process is straightforward — you\'ll need an email address and a way to add a small amount of credits (OpenRouter accepts several payment methods).',
          'You don\'t need to add a lot. A few dollars is enough for hundreds of roleplay messages with most models. You can always top up later.',
        ],
      },
      {
        heading: 'Step 2: Get your API key',
        paragraphs: [
          'Once logged in, go to the Keys section of your OpenRouter dashboard. Click "Create Key," give it a name you\'ll remember, and copy the string it shows you.',
          'Important: OpenRouter only shows the full key once. Save it somewhere safe immediately — if you lose it, you\'ll need to generate a new one.',
        ],
      },
      {
        heading: 'Step 3: Add it to RoleChat AI',
        paragraphs: [
          'Open the RoleChat AI app and click "Connect AI" in the top bar. In the Settings panel, click the "OpenRouter" quick-fill button — this automatically fills in the correct endpoint URL.',
          'Paste your OpenRouter API key into the API Key field. Then enter a model name in the Model field (for example, a good starting point is an affordable chat model). Click save, and you\'re connected.',
        ],
      },
      {
        heading: 'Step 4: Pick a character and start chatting',
        paragraphs: [
          'Now that your key is set up, browse the character library and pick someone who catches your eye. Click "Start Chat," and the character will send you their opening message.',
          'Type your reply, and within seconds you\'ll get a response in character. That\'s it — you\'re roleplaying. If the writing style doesn\'t suit you, try a different model from OpenRouter and see how it changes.',
        ],
      },
      {
        heading: 'Tips for choosing a model on OpenRouter',
        paragraphs: [
          'For romance roleplay, look for models known for creative writing and longer outputs. Generally, larger models write more richly but cost more per message; smaller models are cheaper but may produce shorter or less nuanced replies.',
          'Start with something affordable, get a feel for the flow, and upgrade if you want richer prose. There is no "wrong" choice — the best model is the one whose writing you enjoy most.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Browse characters', to: '/characters' },
      { label: 'Open the app', to: '/app' },
      { label: 'How to start AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Tips for better roleplay', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'What Is an AI Character Card?',
    datePublished: '2026-07-15',
    description:
      'A beginner-friendly explanation of AI character cards: what they are, how they work, and how to use them in RoleChat AI for private romance roleplay.',
    sections: [
      {
        heading: 'What is a character card?',
        paragraphs: [
          'A character card is a file that defines an AI character\'s personality, backstory, and behavior. Think of it as a detailed profile that tells the AI who it should pretend to be — their name, how they speak, what they care about, and how they relate to you.',
          'When you start a chat, the app reads the character card and uses it to guide every response. The result is a conversation that feels like talking to a real person with their own voice, not a generic chatbot.',
        ],
      },
      {
        heading: 'What\'s inside a character card?',
        paragraphs: [
          'A typical character card contains several key pieces of information: a name, a description (who they are and their backstory), a personality (how they behave and speak), a scenario (the setting and how you meet), and a first message (the opening line that starts the conversation).',
          'Some cards also include example dialogues, which show the AI how the character talks in practice. This helps the AI pick up the character\'s unique voice — their word choices, their rhythm, their little habits.',
        ],
      },
      {
        heading: 'Character card formats: V1, V2, V3 explained simply',
        paragraphs: [
          'Over time, the community has developed different versions of the character card format. V1 is the simplest — just the basics. V2 adds more fields like alternate greetings and creator notes. V3 is the most detailed, with room for extensions and richer metadata.',
          'You don\'t need to worry about which version is which. RoleChat AI supports all three automatically. When you pick or import a card, the app figures out the format and handles it for you.',
        ],
      },
      {
        heading: 'How character cards work in RoleChat AI',
        paragraphs: [
          'RoleChat AI comes with a built-in library of original characters — each one defined by a character card. You don\'t need to find or download anything. Just browse the library, pick a character, and start chatting.',
          'If you already have a character card from another tool (SillyTavern, for example), you can import it. RoleChat AI reads standard JSON cards and PNG cards with embedded data, so your existing library works here too.',
        ],
      },
      {
        heading: 'Built-in characters vs importing your own',
        paragraphs: [
          'For most beginners, starting with the built-in character library is the easiest path. Every character is original, written specifically for romance roleplay, and ready to chat with no setup beyond adding your AI key.',
          'If you\'re more experienced and have a collection of cards, the import feature lets you bring them along. Both paths work — the built-in library is just faster to get started.',
        ],
      },
      {
        heading: 'Are character cards safe?',
        paragraphs: [
          'Yes. A character card is just text data — it doesn\'t contain code or scripts. It can\'t harm your device or access your personal information. The worst a badly-written card can do is produce a confusing conversation.',
          'On RoleChat AI, your conversations stay in your browser, and the character data is processed by the AI provider you choose. No one else can see your chats.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Browse characters', to: '/characters' },
      { label: 'Open the app', to: '/app' },
      { label: 'How to start AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern vs Web Tavern: Which One Is Easier?',
    datePublished: '2026-07-15',
    description:
      'A friendly comparison of SillyTavern and RoleChat AI (formerly Web Tavern) for beginners. Installation, setup, privacy, and character cards — which is right for you?',
    sections: [
      {
        heading: 'What is SillyTavern?',
        paragraphs: [
          'SillyTavern is a popular, powerful, open-source frontend for AI roleplay. It has been around for years and has a passionate community. It supports an enormous range of settings, presets, extensions, and character card formats.',
          'The trade-off is complexity. SillyTavern requires installation — you run it on your own computer, configure connections to AI providers, and navigate a dense interface full of advanced parameters. For tech-savvy users, that power is a feature. For most beginners, it\'s a wall.',
        ],
      },
      {
        heading: 'What is RoleChat AI (formerly Web Tavern)?',
        paragraphs: [
          'RoleChat AI — originally known as Web Tavern — is a browser-based AI roleplay app designed for ease of use. There is nothing to install. You open a webpage, pick a character, add your AI key, and start chatting.',
          'It keeps the privacy principle that makes SillyTavern appealing (bring your own key, no middleman reading your chats) but strips away the intimidating setup. The goal is simple: the easiest private AI roleplay.',
        ],
      },
      {
        heading: 'Installation: complex vs zero',
        paragraphs: [
          'SillyTavern requires downloading the application, installing Node.js, running command-line scripts, and keeping the server process running while you chat. Mobile use requires additional remote-setup steps.',
          'RoleChat AI runs entirely in your browser. No downloads, no terminal, no server. It works on desktop, laptop, tablet, and phone — just open the page and start.',
        ],
      },
      {
        heading: 'Setup: deep parameters vs beginner-friendly',
        paragraphs: [
          'SillyTavern exposes temperature, top-p, context length, sampling methods, prompt templates, world info, and dozens more settings on the main screen. For advanced users who want to fine-tune every detail, this is powerful.',
          'RoleChat AI hides all of that behind an Advanced section. The default screen shows you your character, your messages, and an input box. If you want to dig into the parameters later, they\'re there — but you never have to touch them.',
        ],
      },
      {
        heading: 'Privacy: both respect your data',
        paragraphs: [
          'Both SillyTavern and RoleChat AI use the "bring your own key" model. You connect your own AI provider account, and your messages go directly between your device and that provider. Neither service runs a middleman server that reads your conversations.',
          'This is the key privacy advantage over many commercial roleplay apps, which route your chats through their own servers. With both SillyTavern and RoleChat AI, your chats are yours.',
        ],
      },
      {
        heading: 'Character cards: fully compatible',
        paragraphs: [
          'Both tools support the same character card formats (V1, V2, V3 JSON and PNG). If you have a card collection from SillyTavern, you can import those cards into RoleChat AI directly.',
          'RoleChat AI also offers a built-in library of original romance characters, so even if you have no cards, you can start chatting immediately.',
        ],
      },
      {
        heading: 'Which should you choose?',
        paragraphs: [
          'If you love tinkering, want maximum control over every parameter, and don\'t mind a technical setup, SillyTavern is a great choice with a strong community.',
          'If you want to open a page and start roleplaying in under a minute — without installing anything or learning what "top-p" means — RoleChat AI is built for you. You can always graduate to SillyTavern later, and your character cards will come with you.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Browse characters', to: '/characters' },
      { label: 'Open the app', to: '/app' },
      { label: 'What is a character card?', to: '/guides/what-is-a-character-card' },
      { label: 'How to start AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'Best AI Roleplay Prompts for Beginners',
    datePublished: '2026-07-15',
    description:
      'Simple, effective AI roleplay prompts and techniques for beginners. Learn how to set the scene, build emotion, and make your character feel alive — no experience needed.',
    sections: [
      {
        heading: 'What makes a good roleplay prompt?',
        paragraphs: [
          'In AI roleplay, a "prompt" isn\'t a technical command — it\'s just the way you write your messages. The more vivid and specific your input, the richer the character\'s response. Good prompts give the AI something to work with: a mood, a setting, an emotion, a small action.',
          'You don\'t need to be a great writer. You just need to give the character something real to react to. Here are five simple techniques that work for any character.',
        ],
      },
      {
        heading: 'Prompt 1: Set the scene',
        paragraphs: [
          'Instead of jumping straight to dialogue, paint where you are. A single sentence of scene-setting grounds the conversation and gives the character something to respond to.',
          'Example: "*The rain hasn\'t let up in hours. I push open the cafe door, dripping wet, and scan the room for an empty seat." This gives the character a setting, a mood, and a reason to notice you. Their response will be far more vivid than if you\'d just said "Hi."',
        ],
      },
      {
        heading: 'Prompt 2: Define the relationship early',
        paragraphs: [
          'The AI needs context about who you are to the character. Are you strangers? Old friends? Rivals? A short line in your first message can shape the entire conversation.',
          'Example: "We haven\'t spoken since graduation, and I\'m nervous as I walk up to your desk." This tells the character there\'s history, there\'s tension, and there\'s a reason this moment matters. The AI will lean into that dynamic.',
        ],
      },
      {
        heading: 'Prompt 3: Add emotional depth',
        paragraphs: [
          'Characters come alive when you show what you\'re feeling, not just what you\'re doing. A small honest emotion in your message invites the character to respond with their own.',
          'Example: "*I try to keep my voice steady, but my hands are shaking.* I didn\'t think I\'d ever see you again." The vulnerability here gives the character permission to be vulnerable back — and that\'s where the best roleplay moments happen.',
        ],
      },
      {
        heading: 'Prompt 4: Create gentle tension',
        paragraphs: [
          'A conversation where everything is easy gets boring fast. Introduce a small obstacle — a misunderstanding, a secret, a moment of hesitation — and watch the character engage more deeply.',
          'Example: "I want to tell you the truth, but every time I open my mouth, the words won\'t come." This gives the character a reason to push, to wait, to wonder. It turns a flat exchange into a scene with stakes.',
        ],
      },
      {
        heading: 'Prompt 5: Write in character yourself',
        paragraphs: [
          'The more you stay in character, the more the AI will too. Use asterisks for actions, quotation marks for speech, and keep your out-of-character comments brief. You don\'t have to be perfect — just consistent.',
          'Example: "*I set the cup down carefully.* \'You always did know when I was lying.\'" Notice how the action and the dialogue work together. The character now has a gesture, a tone, and an accusation to respond to.',
        ],
      },
      {
        heading: 'Putting it all together',
        paragraphs: [
          'You don\'t need to use all five techniques in every message. Pick one or two that fit the moment, and let the conversation flow naturally. The best roleplay feels like improv — you build on each other, one message at a time.',
          'Remember: the character is guided by their card and your input. If a response feels off, try rephrasing your message with more detail or emotion. Small changes in how you write can transform how the character responds.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Browse characters', to: '/characters' },
      { label: 'Open the app', to: '/app' },
      { label: 'Tips for better roleplay', to: '/guides/tips-for-better-roleplay' },
      { label: 'How to start AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
