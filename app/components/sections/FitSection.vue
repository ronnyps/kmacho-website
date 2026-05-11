<script setup lang="ts">
const { t } = useI18n()

const yesItems = computed(() => [
  t('fit.yes.1'),
  t('fit.yes.2'),
  t('fit.yes.3'),
  t('fit.yes.4'),
  t('fit.yes.5')
])

const noItems = computed(() => [
  t('fit.no.1'),
  t('fit.no.2'),
  t('fit.no.3'),
  t('fit.no.4'),
  t('fit.no.5')
])
</script>

<template>
  <section id="about" class="fit js-fit">
    <div class="fit__inner section-shell section-shell--dark">
      <div class="fit__header section-header">
        <p class="fit__overline section-overline section-overline--dark js-fit-overline">{{ t('fit.overline') }}</p>
        <h2 class="fit__title section-title section-title--dark js-fit-title">{{ t('fit.title') }}</h2>
        <p class="fit__subtitle section-subtitle section-subtitle--dark js-fit-subtitle">{{ t('fit.subtitle') }}</p>
      </div>

      <div class="fit__grid split-grid">
        <article class="fit__column js-fit-column">
          <h3>{{ t('fit.yesTitle') }}</h3>
          <ul>
            <li v-for="item in yesItems" :key="item" class="interactive js-fit-item"><span>&rarr;</span>{{ item }}</li>
          </ul>
        </article>

        <article class="fit__column js-fit-column">
          <h3>{{ t('fit.noTitle') }}</h3>
          <ul>
            <li v-for="item in noItems" :key="item" class="interactive js-fit-item"><span>&rarr;</span>{{ item }}</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
