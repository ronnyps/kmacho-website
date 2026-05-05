<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="hero-tag-strip" aria-label="Hero tag">
    <div class="hero-tag-strip__inner">
      <p class="hero-tag-strip__text">{{ t('hero.banner') }}</p>
    </div>
  </section>
</template>
