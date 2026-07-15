<script setup lang="ts">
import { characters } from '~/data/characters';

useSeoMeta({
  title: 'RoleChat AI - Private AI Character Roleplay',
  description:
    'RoleChat AI is an easy private AI roleplay platform. Chat with original romance and fantasy characters in seconds. No installation. No complicated setup. Bring your own AI key.',
  ogTitle: 'RoleChat AI - Private AI Character Roleplay',
  ogDescription:
    'RoleChat AI is an easy private AI roleplay platform. Chat with original romance and fantasy characters in seconds. No installation. No complicated setup. Bring your own AI key.',
});

// 首页展示前 6 个原创角色（链接到真实角色页）
const featured = characters.slice(0, 6);


const howSteps = [
  { n: 1, title: 'Pick a character', desc: 'Choose an original romance or fantasy character with their own voice, backstory, and secrets.' },
  { n: 2, title: 'Add your AI key', desc: 'Paste your own OpenAI-compatible API key. It stays in your browser — we never see or store it on a server.' },
  { n: 3, title: 'Start chatting', desc: 'Type your first message and the story begins. No installs, no setup wizard, no jargon.' },
];

const privatePoints = [
  { title: 'Your key never leaves your browser', desc: 'Your API key is stored locally on your device. There is no server in the middle reading your conversations.' },
  { title: 'No account required', desc: 'Nothing to sign up for. Nothing to log into. Open the app and start.' },
  { title: 'Your chats stay on your device', desc: 'Conversations are saved to your browser\'s storage — not uploaded to a cloud we control.' },
  { title: 'Bring your own key', desc: 'Use any OpenAI-compatible provider you trust. You pick the model, you pay only for what you use.' },
];

const guides = [
  { title: 'How to get an AI key', desc: 'A 2-minute walkthrough of grabbing a key from a popular provider and pasting it into Settings.' },
  { title: 'Start your first chat', desc: 'From picking a character to your first reply — everything you need to begin in under 60 seconds.' },
  { title: 'Tips for better roleplay', desc: 'Small habits that make characters feel more alive: tone, pacing, and how to steer the story.' },
];

const faqs = [
  { q: 'Do I need to install anything?', a: 'No. RoleChat AI runs entirely in your browser. There is nothing to download or install — just open the page and start chatting.' },
  { q: 'Is my data private?', a: 'Yes. Your API key and your conversations are stored locally in your browser. We do not run a server that reads your chats. You bring your own AI key, so your messages go directly between your browser and the AI provider you choose.' },
  { q: 'What is an API key and where do I get one?', a: 'An API key is a secret string that lets the app talk to an AI provider. You can get one from any OpenAI-compatible service. Paste it into Settings inside the app and you\'re ready.' },
  { q: 'Can I use my own character cards?', a: 'Yes. If you already have a character card (SillyTavern format), you can import it into the app. We\'re also building a library of original characters you can start with right away.' },
  { q: 'Is RoleChat AI free?', a: 'The app itself is free. You pay the AI provider you choose for the messages you generate, using your own key. There is no subscription and no middleman markup.' },
  { q: 'Do I need to understand model settings?', a: 'No. Sensible defaults are set for you. If you like, you can open the advanced options later — but you never have to in order to enjoy a great chat.' },
];
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <!-- Top Nav -->
    <SiteHeader :show-extra-links="true" />

    <!-- Hero -->
    <section class="rc-hero-bg relative overflow-hidden">
      <div class="mx-auto max-w-3xl px-5 py-24 text-center sm:py-32">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-rose-tint px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> The easiest private AI roleplay
        </div>
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
          The easiest private<br class="hidden sm:block" /> AI roleplay.
        </h1>
        <p class="mx-auto mt-5 max-w-xl text-base text-plum-muted sm:text-lg">
          Chat with original romance and fantasy characters in seconds. No installation. No complicated setup. Bring your own AI key.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/app" class="rc-btn-primary">Start Chatting</NuxtLink>
          <NuxtLink to="/characters" class="rc-btn-ghost">Explore Characters</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Popular Romance Characters (原创非 IP，链接到真实角色页) -->
    <section class="mx-auto max-w-5xl px-5 py-20">
      <div class="mb-10 text-center">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Popular Romance Characters</h2>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">Original male leads, each with their own voice, story, and secrets. Pick one and start a private chat in seconds.</p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="c in featured" :key="c.slug" :to="`/characters/${c.slug}`" class="rc-card group block p-5">
          <div class="flex items-center gap-3">
            <CharAvatar :avatar="c.avatar" :initial="c.initial" size="md" />
            <div class="min-w-0">
              <h3 class="truncate text-base font-bold group-hover:text-rose-accent">{{ c.name }}</h3>
              <p class="truncate text-xs text-rose-accent">{{ c.archetype }}</p>
            </div>
          </div>
          <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-plum-muted">{{ c.tagline }}</p>
          <div class="mt-4 flex flex-wrap gap-1.5">
            <span v-for="t in c.tags.slice(0, 3)" :key="t" class="rc-tag">{{ t }}</span>
          </div>
        </NuxtLink>
      </div>
      <div class="mt-10 text-center">
        <NuxtLink to="/characters" class="rc-btn-ghost">See all characters</NuxtLink>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how" class="border-y border-border-warm bg-rose-tint">
      <div class="mx-auto max-w-5xl px-5 py-20">
        <div class="mb-12 text-center">
          <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
          <p class="mx-auto mt-3 max-w-xl text-plum-muted">Three steps from zero to your first reply.</p>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div v-for="s in howSteps" :key="s.n" class="rc-card p-6">
            <div class="rc-avatar-fill mb-4 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold">{{ s.n }}</div>
            <h3 class="text-base font-bold">{{ s.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Private by Design -->
    <section class="mx-auto max-w-5xl px-5 py-20">
      <div class="mb-12 text-center">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Private by design</h2>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">Your conversations are yours. We built it that way from the start.</p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div v-for="p in privatePoints" :key="p.title" class="rc-card p-6">
          <h3 class="flex items-center gap-2 text-base font-bold">
            <span class="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" /> {{ p.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ p.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Beginner Guides -->
    <section class="border-y border-border-warm bg-rose-tint">
      <div class="mx-auto max-w-5xl px-5 py-20">
        <div class="mb-12 text-center">
          <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Beginner guides</h2>
          <p class="mx-auto mt-3 max-w-xl text-plum-muted">New to AI roleplay? Start here.</p>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-for="g in guides" :key="g.title" class="rc-card p-6">
            <h3 class="text-base font-bold">{{ g.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ g.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="mx-auto max-w-3xl px-5 py-20">
      <div class="mb-10 text-center">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">FAQ</h2>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">Everything you might want to know before you start.</p>
      </div>
      <div class="rc-faq">
        <details v-for="f in faqs" :key="f.q">
          <summary>{{ f.q }}</summary>
          <p class="rc-faq-a">{{ f.a }}</p>
        </details>
      </div>
    </section>

    <!-- Footer CTA -->
    <section class="rc-hero-bg border-t border-border-warm">
      <div class="mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Ready to start your story?</h2>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">Open the app, pick a character, and say hello. It really is that easy.</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/app" class="rc-btn-primary">Start Chatting</NuxtLink>
          <NuxtLink to="/characters" class="rc-btn-ghost">Explore Characters</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border-warm">
      <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div class="flex items-center gap-2">
          <div class="rc-avatar-fill flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold tracking-tighter">RC</div>
          <span class="text-sm font-bold">RoleChat AI</span>
        </div>
        <nav class="flex items-center gap-4 text-xs text-plum-faint">
          <NuxtLink to="/characters" class="hover:text-plum-light">Characters</NuxtLink>
          <NuxtLink to="/guides" class="hover:text-plum-light">Guides</NuxtLink>
          <NuxtLink to="/app" class="hover:text-plum-light">Open App</NuxtLink>
          <a href="#how" class="hover:text-plum-light">How it works</a>
          <a href="#faq" class="hover:text-plum-light">FAQ</a>
        </nav>
        <p class="text-xs text-plum-faint">The easiest private AI roleplay.</p>
      </div>
    </footer>
  </div>
</template>

