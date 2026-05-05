<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="hero" id="hero">
    <div class="hero__shell layout-boundary surface-panel">
      <span class="hero__corner hero__corner--tl" aria-hidden="true"></span>
      <span class="hero__corner hero__corner--tr" aria-hidden="true"></span>
      <span class="hero__corner hero__corner--bl" aria-hidden="true"></span>
      <span class="hero__corner hero__corner--br" aria-hidden="true"></span>
      <div class="hero__content">
        <h1 class="hero__headline">
          <span class="hero__line-mask">
            <span class="hero__line-inner hero__line-strong js-hero-line">{{ t('hero.line1') }}</span>
          </span>
          <span class="hero__line-mask">
            <span class="hero__line-inner hero__line-strong js-hero-line">{{ t('hero.line2Static') }}</span>
          </span>
        </h1>

        <p class="hero__subtitle js-hero-subtitle">
          {{ t('hero.subtitle') }}
        </p>

        <div class="hero__actions">
          <a class="btn-primary interactive js-hero-action" href="#contact">{{ t('hero.ctaPrimary') }}</a>
          <a class="btn-ghost interactive js-hero-action" href="#work">
            <span>{{ t('hero.ctaSecondary') }}</span>
            <span class="btn-ghost__arrow">-&gt;</span>
          </a>
        </div>
      </div>
    </div>

    <HeroStatsBar />
  </section>
</template>
