<script setup lang="ts">
const { t } = useI18n()

const row1 = [
  { name: 'React',        icon: '/icons-stack/react-js-icon.svg' },
  { name: 'Next.js',      icon: '/icons-stack/nextjs-icon-original.svg' },
  { name: 'TypeScript',   icon: '/icons-stack/typescript-programming-language-icon.svg' },
  { name: 'Tailwind CSS', icon: '/icons-stack/tailwind-css-icon.svg' },
  { name: 'Vue',          icon: '/icons-stack/vue-js-icon.svg' },
  { name: 'Nuxt',         icon: '/icons-stack/nuxt.svg' },
  { name: 'Svelte',       icon: '/icons-stack/svelte-icon.svg' },
  { name: 'Astro',        icon: '/icons-stack/Astro.svg' },
  { name: 'Angular',      icon: '/icons-stack/Angular.svg' },
  { name: 'Node.js',      icon: '/icons-stack/Node.js.svg' },
  { name: 'GraphQL',      icon: '/icons-stack/graphql-icon.svg' },
  { name: 'Python',       icon: '/icons-stack/Python.svg' },
]

const row2 = [
  { name: 'Claude',       icon: '/icons-stack/claude-logo.svg' },
  { name: 'Flutter',      icon: '/icons-stack/flutter-icon.svg' },
  { name: 'SwiftUI',      icon: '/icons-stack/swift-programming-language-icon.svg' },
  { name: 'Kotlin',       icon: '/icons-stack/Kotlin.svg' },
  { name: 'AWS',          icon: '/icons-stack/aws-icon.svg' },
  { name: 'Docker',       icon: '/icons-stack/docker-icon.svg' },
  { name: 'Kubernetes',   icon: '/icons-stack/kubernetes-icon.svg' },
  { name: 'OpenAI',       icon: '/icons-stack/OpenAI_logo_2025_(symbol).svg.png' },
  { name: 'PyTorch',      icon: '/icons-stack/pytorch-icon.svg' },
  { name: 'TensorFlow',   icon: '/icons-stack/tensorflow-2.svg' },
  { name: 'Figma',        icon: '/icons-stack/figma-icon.svg' },
  { name: 'Supabase',     icon: '/icons-stack/supabase-icon.svg' },
]
</script>

<template>
  <section class="stack" aria-labelledby="stack-heading">
    <div class="stack__inner">

      <header class="stack__header">
        <p class="section-overline js-stack-item">{{ t('stack.overline') }}</p>
        <h2 id="stack-heading" class="stack__title js-stack-item">{{ t('stack.title') }}</h2>
        <p class="stack__subtitle js-stack-item">{{ t('stack.subtitle') }}</p>
      </header>

      <div class="stack__marquees" aria-hidden="true">

        <div class="stack__row">
          <div class="stack__track stack__track--fwd">
            <div
              v-for="(tech, i) in [...row1, ...row1]"
              :key="`r1-${i}`"
              class="stack__card"
              data-cursor-surface="true"
            >
              <div class="stack__card-visual">
                <img :src="tech.icon" :alt="tech.name" class="stack__card-icon" />
              </div>
              <span class="stack__card-name">{{ tech.name }}</span>
            </div>
          </div>
        </div>

        <div class="stack__row">
          <div class="stack__track stack__track--rev">
            <div
              v-for="(tech, i) in [...row2, ...row2]"
              :key="`r2-${i}`"
              class="stack__card"
              data-cursor-surface="true"
            >
              <div class="stack__card-visual">
                <img :src="tech.icon" :alt="tech.name" class="stack__card-icon" />
              </div>
              <span class="stack__card-name">{{ tech.name }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
