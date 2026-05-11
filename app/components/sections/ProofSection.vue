<script setup lang="ts">
const { t } = useI18n()

const cases = computed(() => [
  {
    key: 'sunfire',
    company: t('proof.items.sunfire.company'),
    title: t('proof.items.sunfire.title'),
    body: t('proof.items.sunfire.body'),
    impact: t('proof.items.sunfire.impact'),
  },
  {
    key: 'wtc',
    company: t('proof.items.wtc.company'),
    title: t('proof.items.wtc.title'),
    body: t('proof.items.wtc.body'),
    impact: t('proof.items.wtc.impact'),
  },
  {
    key: 'primeshell',
    company: t('proof.items.primeshell.company'),
    title: t('proof.items.primeshell.title'),
    body: t('proof.items.primeshell.body'),
    impact: t('proof.items.primeshell.impact'),
  },
])
</script>

<template>
  <section id="work" class="proof js-proof">
    <div class="proof__inner section-shell section-shell--dark">
      <div class="proof__header section-header">
        <p class="proof__overline section-overline section-overline--dark js-proof-overline">{{ t('proof.overline') }}</p>
        <h2 class="proof__title section-title js-proof-title market-gap__title js-gap-title">{{ t('proof.title') }}</h2>
        <p class="proof__subtitle section-subtitle js-proof-subtitle">{{ t('proof.subtitle') }}</p>
      </div>

      <div class="proof__grid grid-3">
        <article
          v-for="item in cases"
          :key="item.key"
          class="proof__card interactive js-proof-card"
        >
          <div class="proof__visual" aria-hidden="true">
            <span class="proof__visual-chip">{{ item.company }}</span>
          </div>

          <p class="proof__company">{{ item.company }}</p>
          <h3>{{ item.title }}</h3>
          <p class="proof__body">{{ item.body }}</p>
          <p class="proof__impact">{{ item.impact }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
