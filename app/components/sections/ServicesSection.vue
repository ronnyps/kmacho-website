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

      <div class="services__grid grid-3">
        <article
          v-for="pillar in pillars"
          :key="pillar.key"
          class="services__card js-service-card"
          :data-pillarkey="pillar.key"
        >
          <h3>{{ pillar.title }}</h3>
          <p>{{ pillar.body }}</p>
          <div class="services__anim-slot" aria-hidden="true">
            <component :is="animationComponentByKey[pillar.key]" />
          </div>
        </article>

        <article class="services__card services__card--closing js-service-card">
          <p class="services__closing-overline services__overline section-overline js-services-overline">{{ t('services.closing.eyebrow') }}</p>
          <h3 class="services__closing-hybrid">
            <span class="services__closing-strong">{{ t('services.closing.headlineStrong') }}&nbsp;</span>
            <span class="services__closing-soft">{{ t('services.closing.headlineSoft') }}</span>
          </h3>
        </article>
      </div>
    </div>
  </section>
</template>
