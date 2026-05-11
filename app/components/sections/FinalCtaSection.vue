<script setup lang="ts">
import FinalCtaBackground3D from './FinalCtaBackground3D.vue'

const { t } = useI18n()

const headlineLines = computed(() => t('cta.title').split('\n'))
</script>

<template>
  <section id="contact" class="final-cta js-final-cta">
    <ClientOnly>
      <FinalCtaBackground3D />
    </ClientOnly>

    <div class="final-cta__inner layout-boundary surface-panel surface-panel--dark">
      <p class="final-cta__overline">{{ t('cta.overline') }}</p>

      <h2 class="final-cta__title market-gap__title js-gap-title">
        <span v-for="(line, index) in headlineLines" :key="`${line}-${index}`" class="js-cta-word">{{ line }}</span>
      </h2>

      <p class="final-cta__subtitle js-cta-subtitle">{{ t('cta.subtitle') }}</p>

      <a href="#" class="final-cta__button interactive js-cta-button">{{ t('cta.button') }}</a>

      <p class="final-cta__expectation js-cta-meta">{{ t('cta.expectation') }}</p>
    </div>
  </section>
</template>
