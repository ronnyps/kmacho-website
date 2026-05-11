<script setup lang="ts">
import WebDevPreview       from './Solutions-animations/WebDevPreview.vue'
import MobileAppPreview    from './Solutions-animations/MobileAppPreview.vue'
import AISolutionsPreview  from './Solutions-animations/AISolutionsPreview.vue'
import UXUIDesignPreview   from './Solutions-animations/UXUIDesignPreview.vue'
import IoTPreview          from './Solutions-animations/IoTPreview.vue'
import CustomSoftwarePreview from './Solutions-animations/CustomSoftwarePreview.vue'

const { t } = useI18n()

const activeCard = ref<string | null>(null)

const solutions = computed(() => [
  { key: 'web',    num: '01', title: t('solutions.items.web.title'),    body: t('solutions.items.web.body'),    preview: WebDevPreview },
  { key: 'mobile', num: '02', title: t('solutions.items.mobile.title'), body: t('solutions.items.mobile.body'), preview: MobileAppPreview },
  { key: 'ai',     num: '03', title: t('solutions.items.ai.title'),     body: t('solutions.items.ai.body'),     preview: AISolutionsPreview },
  { key: 'design', num: '04', title: t('solutions.items.design.title'), body: t('solutions.items.design.body'), preview: UXUIDesignPreview },
  { key: 'iot',    num: '05', title: t('solutions.items.iot.title'),    body: t('solutions.items.iot.body'),    preview: IoTPreview },
  { key: 'custom', num: '06', title: t('solutions.items.custom.title'), body: t('solutions.items.custom.body'), preview: CustomSoftwarePreview },
])
</script>

<template>
  <section id="solutions" class="solutions js-solutions" aria-labelledby="solutions-heading">
    <div class="solutions__inner section-shell">
      <div class="solutions__grid">

        <!-- Row 1: intro + cards 01 + 02 -->
        <div class="solutions__row">
          <div class="solutions__intro">
            <p class="section-overline js-sol-item">{{ t('solutions.overline') }}</p>
            <h2 id="solutions-heading" class="section-title js-sol-item">
              <template v-for="(line, i) in t('solutions.title').split('\n')" :key="i">
                {{ line }}<br v-if="i < t('solutions.title').split('\n').length - 1">
              </template>
            </h2>
            <p class="section-subtitle js-sol-item">{{ t('solutions.subtitle') }}</p>
          </div>

          <article
            v-for="sol in solutions.slice(0, 2)"
            :key="sol.key"
            class="solutions__card js-sol-item"
            @mouseenter="activeCard = sol.key"
            @mouseleave="activeCard = null"
          >
            <span class="solutions__card-num" aria-hidden="true">{{ sol.num }}</span>
            <h3>{{ sol.title }}</h3>
            <p>{{ sol.body }}</p>
            <a href="#contact" class="solutions__card-arrow interactive" data-cursor-surface="true" :aria-label="sol.title">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8.5 3.5L12 7l-3.5 3.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <div class="solutions__card-preview">
              <component :is="sol.preview" :active="activeCard === sol.key" />
            </div>
          </article>
        </div>

        <!-- Row 2: cards 03 + 04 + 05 -->
        <div class="solutions__row">
          <article
            v-for="sol in solutions.slice(2, 5)"
            :key="sol.key"
            class="solutions__card js-sol-item"
            @mouseenter="activeCard = sol.key"
            @mouseleave="activeCard = null"
          >
            <span class="solutions__card-num" aria-hidden="true">{{ sol.num }}</span>
            <h3>{{ sol.title }}</h3>
            <p>{{ sol.body }}</p>
            <a href="#contact" class="solutions__card-arrow interactive" data-cursor-surface="true" :aria-label="sol.title">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8.5 3.5L12 7l-3.5 3.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <div class="solutions__card-preview">
              <component :is="sol.preview" :active="activeCard === sol.key" />
            </div>
          </article>
        </div>

        <!-- Row 3: card 06 + CTA (span 2) -->
        <div class="solutions__row solutions__row--last">
          <article
            class="solutions__card js-sol-item"
            @mouseenter="activeCard = solutions[5].key"
            @mouseleave="activeCard = null"
          >
            <span class="solutions__card-num" aria-hidden="true">{{ solutions[5].num }}</span>
            <h3>{{ solutions[5].title }}</h3>
            <p>{{ solutions[5].body }}</p>
            <a href="#contact" class="solutions__card-arrow interactive" data-cursor-surface="true" :aria-label="solutions[5].title">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8.5 3.5L12 7l-3.5 3.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <div class="solutions__card-preview">
              <component :is="solutions[5].preview" :active="activeCard === solutions[5].key" />
            </div>
          </article>

          <div class="solutions__cta js-sol-item">
            <p class="section-overline solutions__cta-tag">{{ t('solutions.cta.tag') }}</p>
            <p class="solutions__cta-text">
              <span class="solutions__cta-strong">{{ t('solutions.cta.headline') }} </span>
              <span class="solutions__cta-muted">{{ t('solutions.cta.sub') }}</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
