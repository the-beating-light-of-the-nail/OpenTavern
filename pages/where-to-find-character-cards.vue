<script setup lang="ts">
useSeoMeta({
  title: 'Where to Find Character Cards (SillyTavern & Beyond) — Open Tavern',
  description:
    'A curated list of websites where you can download free AI character cards (SillyTavern-compatible V1/V2/V3 and PNG) and use them in Open Tavern, SillyTavern, or any compatible roleplay platform. Plus a beginner-friendly explanation of what character cards are.',
  ogTitle: 'Where to Find Character Cards (SillyTavern & Beyond)',
  ogDescription:
    'A curated list of websites where you can download free AI character cards compatible with Open Tavern, SillyTavern, RisuAI, and Janitor AI.',
});

const collections = [
  {
    name: 'Chatbots Webring',
    desc: 'A collection of character cards gathered from multiple platforms.',
  },
  {
    name: 'AICharacterCards.com',
    desc: 'A large collection of SillyTavern cards, plus several beginner-friendly guides for using SillyTavern. Also has a fun roulette feature that gives you a random character card.',
  },
  {
    name: 'Character Tavern',
    desc: 'A collection of cards from the SillyTavern community.',
  },
  {
    name: 'realm.risuai.net',
    desc: 'A collection of character cards from RisuAI.',
  },
  {
    name: 'Janny AI',
    desc: 'A collection of character cards from Janitor AI.',
  },
];

const cardsAndLorebooks = [
  {
    name: 'BotBooru',
    desc: 'Character cards gathered from multiple websites, along with lorebooks.',
  },
  {
    name: 'DataCat',
    desc: 'Lets you search for character cards and, in some cases, upload or download your own.',
  },
];

const individual = [
  {
    name: 'Wyvern.chat',
    desc: 'Popular among former Janitor AI users and also allows you to download character cards.',
  },
];
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-2xl px-5 py-12">
      <NuxtLink to="/guides" class="rc-nav-link mb-6 inline-flex">← All guides</NuxtLink>

      <h1 class="font-display text-3xl font-semibold tracking-wide sm:text-4xl">Where to Find Character Cards</h1>
      <p class="mt-4 leading-relaxed text-plum-muted">
        You've probably wondered where people actually get character cards from. Here's a list
        of websites where you can download bot cards and use them privately in Open Tavern,
        SillyTavern, or any compatible roleplay platform.
      </p>

      <!-- Quick explanation for beginners -->
      <section class="mt-10">
        <h2 class="text-xl font-bold">A quick explanation for beginners</h2>
        <div class="mt-3 space-y-3 leading-relaxed text-plum-muted">
          <p>
            A character card is a file that contains everything about a character or chatbot:
            their name, appearance, personality, speaking style, backstory, example dialogues, and more.
          </p>
          <p>
            Think of it as the character's passport. It's usually stored as a JSON file or embedded
            inside a PNG image, and it can be used to:
          </p>
          <ul class="list-disc space-y-1 pl-6">
            <li>transfer a character between platforms (for example, from Character.AI to Janitor AI, RisuAI, SillyTavern, or Open Tavern);</li>
            <li>save a copy if the original bot ever gets deleted;</li>
            <li>share the character with others so they can roleplay with the same bot on their own setup.</li>
          </ul>
          <p>
            In Open Tavern, you can drop a card file into the app and start chatting in seconds —
            no setup, no conversion. V1, V2, V3 JSON and SillyTavern PNG cards all work out of the box.
          </p>
        </div>
      </section>

      <!-- Section I -->
      <section class="mt-10">
        <h2 class="text-xl font-bold">I. Character card collections</h2>
        <div class="mt-4 grid grid-cols-1 gap-3">
          <div v-for="r in collections" :key="r.name" class="rc-card p-5">
            <h3 class="font-display text-lg font-semibold tracking-wide">{{ r.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ r.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Section II -->
      <section class="mt-10">
        <h2 class="text-xl font-bold">II. Character cards + lorebooks</h2>
        <div class="mt-4 grid grid-cols-1 gap-3">
          <div v-for="r in cardsAndLorebooks" :key="r.name" class="rc-card p-5">
            <h3 class="font-display text-lg font-semibold tracking-wide">{{ r.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ r.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Section III -->
      <section class="mt-10">
        <h2 class="text-xl font-bold">III. Individual websites</h2>
        <div class="mt-4 grid grid-cols-1 gap-3">
          <div v-for="r in individual" :key="r.name" class="rc-card p-5">
            <h3 class="font-display text-lg font-semibold tracking-wide">{{ r.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ r.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Disclaimer -->
      <section class="mt-12 rounded-2xl border border-border-warm bg-rose-tint p-6">
        <h2 class="text-base font-bold">Disclaimer</h2>
        <div class="mt-3 space-y-2 text-sm leading-relaxed text-plum-muted">
          <p>
            We are not responsible for the content hosted on these websites. They may contain
            uncensored or minimally moderated 18+ and fetish content. Browse at your own discretion.
          </p>
          <p>
            These are general-purpose websites. Each character card is the responsibility of its
            creator, so please use your own judgment. This list is provided for informational
            purposes only and should not be taken as an endorsement of any particular content.
          </p>
          <p>
            Please use these websites only to download cards for your personal use. We do not
            support reuploading or stealing other people's work, and we do not support character
            cards that violate basic ethical standards. As far as we know, there are currently no
            character card websites that are entirely SFW.
          </p>
          <p>
            Many creators also share cards on Discord and other social media — if you have a
            favorite community, ask there too.
          </p>
        </div>
      </section>

      <!-- CTA -->
      <section class="rc-hero-bg mt-12 rounded-2xl border border-border-warm p-8 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide">Ready to use a card?</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">
          Open Tavern reads every standard character card format — V1, V2, V3 JSON and SillyTavern
          PNG. Drop a file into the app and start chatting. No install, no setup.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/app" class="rc-btn-primary">Open the App</NuxtLink>
          <NuxtLink to="/characters" class="rc-btn-ghost">Browse built-in characters</NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
