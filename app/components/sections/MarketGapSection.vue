<script setup lang="ts">
import MarketGapVenn from './MarketGapVenn.vue'

const { t } = useI18n()
</script>

<template>
  <section class="market-gap js-market-gap" id="gap">
    <div class="market-gap__grid section-shell">
      <div class="market-gap__left">
        <p class="market-gap__overline section-overline js-gap-overline">{{ t('gap.overline') }}</p>
        <h2 class="market-gap__title js-gap-title">
          <span>{{ t('gap.title1') }}</span><br />
          <span class="market-gap__title-line--muted js-gap-title-muted">{{ t('gap.title2') }}</span>
        </h2>
        <div class="market-gap__body">
          <p class="js-gap-paragraph">{{ t('gap.body1') }}</p>
          <p class="js-gap-paragraph">{{ t('gap.body2') }}</p>
        </div>
        <p class="market-gap__tagline js-gap-tagline">{{ t('gap.tagline') }}</p>
      </div>

      <div class="market-gap__viz js-gap-viz">
        <MarketGapVenn />
      </div>
    </div>
  </section>
</template>
