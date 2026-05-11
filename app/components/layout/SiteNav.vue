<script setup lang="ts">
import KmachoLogo from './KmachoLogo.vue'

const { t } = useI18n()
const isScrolled = ref(false)
const isDark = ref(true)
let cleanup: (() => void) | null = null
let observer: MutationObserver | null = null

onMounted(() => {
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset
    isScrolled.value = y > 80
    isDark.value =
      y < window.innerHeight * 0.85 || document.body.classList.contains('is-dark-zone')
  }

  const syncDarkState = () => {
    const y = window.scrollY || window.pageYOffset
    isDark.value =
      y < window.innerHeight * 0.85 || document.body.classList.contains('is-dark-zone')
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  syncDarkState()

  observer = new MutationObserver(syncDarkState)
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

  cleanup = () => window.removeEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  cleanup?.()
  observer?.disconnect()
})
</script>

<template>
  <header class="site-nav js-site-nav" :class="{ 'is-scrolled': isScrolled, 'is-dark': isDark }">
    <div class="site-nav__inner">
      <a class="site-nav__logo interactive" href="#" aria-label="Kmacho">
        <KmachoLogo />
      </a>
      <nav class="site-nav__links">
        <a class="interactive" href="#services">{{ t('nav.services') }}</a>
        <a class="interactive" href="#work">{{ t('nav.work') }}</a>
        <a class="interactive" href="#process">{{ t('nav.process') }}</a>
        <a class="interactive" href="#about">{{ t('nav.about') }}</a>
      </nav>
      <div class="site-nav__actions">
        <a class="site-nav__mini interactive" data-cursor-surface="true" href="#services">{{ t('nav.ask') }}</a>
        <a class="site-nav__mini interactive" data-cursor-surface="true" href="#process">{{ t('nav.login') }}</a>
        <a class="site-nav__cta interactive" data-cursor-surface="true" href="#contact">{{ t('nav.cta') }}</a>
      </div>
    </div>
  </header>
</template>
