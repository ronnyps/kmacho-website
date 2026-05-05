<script setup lang="ts">
const { t } = useI18n()

const steps = computed(() => [
  {
    n: '01',
    title: t('process.steps.discovery.title'),
    body: t('process.steps.discovery.body'),
    duration: t('process.steps.discovery.duration'),
    note: t('process.steps.discovery.note')
  },
  {
    n: '02',
    title: t('process.steps.proposal.title'),
    body: t('process.steps.proposal.body'),
    duration: t('process.steps.proposal.duration'),
    note: t('process.steps.proposal.note')
  },
  {
    n: '03',
    title: t('process.steps.build.title'),
    body: t('process.steps.build.body'),
    duration: t('process.steps.build.duration'),
    note: t('process.steps.build.note')
  },
  {
    n: '04',
    title: t('process.steps.qa.title'),
    body: t('process.steps.qa.body'),
    duration: t('process.steps.qa.duration'),
    note: t('process.steps.qa.note')
  },
  {
    n: '05',
    title: t('process.steps.delivery.title'),
    body: t('process.steps.delivery.body'),
    duration: t('process.steps.delivery.duration'),
    note: t('process.steps.delivery.note')
  },
  {
    n: '06',
    title: t('process.steps.support.title'),
    body: t('process.steps.support.body'),
    duration: t('process.steps.support.duration'),
    note: t('process.steps.support.note')
  }
])
</script>

<template>
  <section id="process" class="process js-process">
    <div class="process__inner section-shell">
      <div class="process__header section-header">
        <p class="process__overline section-overline js-process-overline">{{ t('process.overline') }}</p>
        <h2 class="process__title section-title js-process-title market-gap__title js-gap-title">{{ t('process.title') }}</h2>
        <p class="process__subtitle section-subtitle js-process-subtitle">{{ t('process.subtitle') }}</p>
      </div>

      <div class="process__line">
        <span class="process__line-track"></span>
        <span class="process__line-fill js-process-line-fill"></span>
      </div>

      <div class="process__grid grid-3">
        <article v-for="step in steps" :key="step.n" class="process__step js-process-step interactive">
          <p class="process__step-number js-process-step-number">{{ step.n }}</p>
          <h3>{{ step.title }}</h3>
          <p>{{ step.body }}</p>
          <p class="process__step-duration">{{ step.duration }}</p>
          <div class="process__step-tooltip">{{ step.note }}</div>
        </article>
      </div>
    </div>
  </section>
</template>
