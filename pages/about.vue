<script setup lang="ts">
useSeoMeta({
  title: 'About Open Tavern · RoleChat AI',
  description:
    'Open Tavern (RoleChat AI) is an independent, privacy-first AI roleplay platform. Learn who builds it, why it is bring-your-own-key, and how it keeps your conversations private.',
  ogTitle: 'About Open Tavern · RoleChat AI',
  ogDescription:
    'An independent, privacy-first AI roleplay platform — who builds it and why bring-your-own-key keeps your conversations private.',
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Open Tavern · RoleChat AI',
        url: absUrl('/about'),
        inLanguage: 'en',
      }),
    },
  ],
});
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-3xl px-5 py-16">
      <NuxtLink to="/" class="rc-nav-link mb-6 inline-flex">← Home</NuxtLink>
      <h1 class="font-display text-4xl font-semibold tracking-wide">About Open Tavern</h1>
      <p class="mt-4 text-lg leading-relaxed text-plum-muted">
        Open Tavern — also known as RoleChat AI — is an independent, privacy-first
        platform for AI character roleplay. Chat with original romance and fantasy
        characters, with no install and no complicated setup.
      </p>

      <div class="orn-divider" aria-hidden="true">✦</div>

      <section class="mt-10 space-y-5 leading-relaxed text-plum-muted">
        <h2 class="font-display text-2xl font-semibold tracking-wide">Why we built it</h2>
        <p>
          Most AI chat tools either lock you into a subscription or quietly store your
          conversations on someone else's server. Open Tavern is built around a
          different idea: <strong>your conversations stay between you and your AI
          provider.</strong> You bring your own API key, so your prompts and replies
          pass directly from the app to the model provider you already choose and
          trust — Open Tavern does not sit in the middle reading or storing your chats.
        </p>
        <p>
          We also wanted AI roleplay to be genuinely easy to start. No downloads, no
          command line, no complicated configuration. Open the app, pick a character,
          and begin.
        </p>
      </section>

      <section class="mt-12 space-y-5 leading-relaxed text-plum-muted">
        <h2 class="font-display text-2xl font-semibold tracking-wide">Bring your own key</h2>
        <p>
          Open Tavern works with popular providers through a single API key (OpenRouter,
          OpenAI, and others). Because you connect your own account, you control the
          model, the cost, and the data — there is no middleman billing layer and no
          hidden storage of your conversations.
        </p>
        <p>
          It also reads standard character-card formats (SillyTavern V1/V2/V3 JSON and
          PNG), so the characters and cards you already love work here too.
        </p>
      </section>

      <!-- TODO(personalize): Strengthen E-E-A-T by naming the maintainer, their
           background, and the editorial process behind new characters/guides. -->
      <section class="mt-12 space-y-5 leading-relaxed text-plum-muted">
        <h2 class="font-display text-2xl font-semibold tracking-wide">Who runs it</h2>
        <p>
          Open Tavern is built and maintained by an independent developer. New
          characters and guides are added regularly, and the project keeps privacy and
          ease-of-use at its core.
        </p>
        <p>
          Questions, feedback, or a character you'd like to see?
          <NuxtLink to="/contact" class="font-medium underline underline-offset-4"
            >Get in touch</NuxtLink
          >.
        </p>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
