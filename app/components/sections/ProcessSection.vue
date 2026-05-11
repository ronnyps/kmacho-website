<script setup lang="ts">
const { t } = useI18n()

const steps = computed(() => [
  { n: '01', title: t('process.steps.discovery.title'), body: t('process.steps.discovery.body'), duration: t('process.steps.discovery.duration') },
  { n: '02', title: t('process.steps.proposal.title'),  body: t('process.steps.proposal.body'),  duration: t('process.steps.proposal.duration')  },
  { n: '03', title: t('process.steps.build.title'),     body: t('process.steps.build.body'),     duration: t('process.steps.build.duration')     },
  { n: '04', title: t('process.steps.qa.title'),        body: t('process.steps.qa.body'),        duration: t('process.steps.qa.duration')        },
  { n: '05', title: t('process.steps.delivery.title'),  body: t('process.steps.delivery.body'),  duration: t('process.steps.delivery.duration')  },
  { n: '06', title: t('process.steps.support.title'),   body: t('process.steps.support.body'),   duration: t('process.steps.support.duration')   },
])
</script>

<template>
  <section id="process" class="process js-process">
    <div class="process__inner section-shell">
      <div class="process__split">

        <!-- Izquierda: header sticky -->
        <div class="process__left">
          <div class="process__sticky">
            <p class="section-overline js-process-overline">{{ t('process.overline') }}</p>
            <h2 class="process__title section-title js-process-title">{{ t('process.title') }}</h2>
            <p class="process__subtitle section-subtitle js-process-subtitle">{{ t('process.subtitle') }}</p>
          </div>
        </div>

        <!-- Derecha: rows con línea vertical progresiva -->
        <div class="process__right">

          <!-- Línea vertical de progreso -->
          <div class="process__vtrack" aria-hidden="true">
            <div class="process__vfill js-process-vfill" />
          </div>

          <article
            v-for="step in steps"
            :key="step.n"
            class="process__row js-process-step"
          >
            <div class="process__row-glow" aria-hidden="true" />
            <span class="process__row-num">{{ step.n }}</span>
            <div class="process__row-content">
              <h3 class="process__row-title">{{ step.title }}</h3>
              <p class="process__row-body">{{ step.body }}</p>
              <span class="process__row-duration">{{ step.duration }}</span>
            </div>
          </article>

        </div>
      </div>
    </div>
  </section>
</template>
