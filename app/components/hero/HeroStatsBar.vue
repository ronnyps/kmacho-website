<script setup lang="ts">
const { t } = useI18n()

const stats = [
  { prefix: '',  display: '12+', target: 12,  labelKey: 'hero.stats.yearsLabel' },
  { prefix: '$', display: '120', target: 120, labelKey: 'hero.stats.rateLabel' },
  { prefix: '',  display: '100%', target: 100, labelKey: 'hero.stats.seniorLabel' },
  { prefix: '',  display: '3',   target: 3,   labelKey: 'hero.stats.verticalsLabel' },
]
</script>

<template>
  <div class="hero__stats js-hero-stats">
    <article v-for="stat in stats" :key="stat.labelKey" class="hero__stat-item interactive">
      <p class="hero__stat-value">
        <span v-if="stat.prefix">{{ stat.prefix }}</span>
        <span class="js-stat-number" :data-target="stat.target">{{ stat.display }}</span>
      </p>
      <p class="hero__stat-label">{{ t(stat.labelKey) }}</p>
    </article>
  </div>
</template>
