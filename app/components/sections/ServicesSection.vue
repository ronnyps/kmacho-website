<script setup lang="ts">
import ExperienceDesignPreview from './Services-animations/ExperienceDesignPreview.vue'
import ProductGrowthPreview from './Services-animations/ProductGrowthPreview.vue'
import StrategyConsultingPreview from './Services-animations/StrategyConsultingPreview.vue'
import TechInnovationPreview from './Services-animations/TechInnovationPreview.vue'

const { t } = useI18n()

const pillars = computed(() => [
  {
    key: 'innovation',
    title: t('services.items.innovation.title'),
    body: t('services.items.innovation.body')
  },
  {
    key: 'experience',
    title: t('services.items.experience.title'),
    body: t('services.items.experience.body')
  },
  {
    key: 'consulting',
    title: t('services.items.consulting.title'),
    body: t('services.items.consulting.body')
  },
  {
    key: 'growth',
    title: t('services.items.growth.title'),
    body: t('services.items.growth.body')
  }
])

const animationComponentByKey = {
  innovation: TechInnovationPreview,
  experience: ExperienceDesignPreview,
  consulting: StrategyConsultingPreview,
  growth: ProductGrowthPreview,
} as const
</script>

<template>
  <section id="services" class="services js-services">
    <div class="services__inner section-shell">
      <div class="services__header section-header">
        <p class="services__overline section-overline js-services-overline">{{ t('services.overline') }}</p>
        <h2 class="services__title section-title js-services-title market-gap__title js-gap-title">{{ t('services.title') }}</h2>
      </div>

      <div class="services__grid">
        <article
          v-for="(pillar, index) in pillars"
          :key="pillar.key"
          class="services__row js-service-card"
          :class="{ 'services__row--reverse': index % 2 === 1 }"
          :data-pillarkey="pillar.key"
        >
          <div class="services__content">
            <h3>{{ pillar.title }}</h3>
            <p>{{ pillar.body }}</p>
            <a
              class="services__content-arrow interactive"
              data-cursor-surface="true"
              href="#contact"
              :aria-label="pillar.title"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8.5 3.5L12 7l-3.5 3.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
          </div>
          <div class="services__visual" aria-hidden="true">
            <div class="services__anim-slot">
              <img class="services__grid-bg" src="/svg/isometric/grid-back.svg" alt="" aria-hidden="true" />
              <component :is="animationComponentByKey[pillar.key]" />
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services__grid-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}

.services__anim-slot {
  position: relative;
}

.services__anim-slot > :not(.services__grid-bg) {
  position: relative;
  z-index: 1;
}
</style>
