<script setup lang="ts">
const { t } = useI18n()

const headlineWords = computed(() => t('cta.title').split(' '))
</script>

<template>
  <section id="contact" class="final-cta js-final-cta">
    <div class="final-cta__inner layout-boundary surface-panel surface-panel--dark">
      <p class="final-cta__overline">{{ t('cta.overline') }}</p>

      <h2 class="final-cta__title market-gap__title js-gap-title">
        <span v-for="(word, index) in headlineWords" :key="`${word}-${index}`" class="js-cta-word">{{ word }}</span>
      </h2>

      <p class="final-cta__subtitle js-cta-subtitle">{{ t('cta.subtitle') }}</p>

      <a href="#" class="final-cta__button interactive js-cta-button">{{ t('cta.button') }}</a>

      <p class="final-cta__expectation js-cta-meta">{{ t('cta.expectation') }}</p>
      <p class="final-cta__meta js-cta-meta">{{ t('cta.meta') }}</p>
    </div>
  </section>
</template>
