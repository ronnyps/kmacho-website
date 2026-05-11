<script setup lang="ts">
import ScrollProgressBar from '../components/ui/ScrollProgressBar.vue'
import SitePreload from '../components/ui/SitePreload.vue'
import SiteNav from '../components/layout/SiteNav.vue'
import HeroTagStrip from '../components/hero/HeroTagStrip.vue'
import HeroWavesCanvas from '../components/hero/HeroWavesCanvas.vue'
import HeroSection from '../components/hero/HeroSection.vue'
import MarketGapSection from '../components/sections/MarketGapSection.vue'
import ServicesSection from '../components/sections/ServicesSection.vue'
import SolutionsSection from '../components/sections/SolutionsSection.vue'
import TechStackSection from '../components/sections/TechStackSection.vue'
import ProofSection from '../components/sections/ProofSection.vue'
import ProcessSection from '../components/sections/ProcessSection.vue'
import FitSection from '../components/sections/FitSection.vue'
import FinalCtaSection from '../components/sections/FinalCtaSection.vue'
import SiteFooter from '../components/layout/SiteFooter.vue'
import CustomCursor from '../components/ui/CustomCursor.vue'

const { t, locale } = useI18n()
const reduced = useReducedMotion()
const preloadDone = ref(false)
useLandingAnimations(reduced, preloadDone)

const siteUrl = 'https://www.kmacho.net'
const currentPath = computed(() => (locale.value === 'en' ? '/' : '/es'))
const canonicalUrl = computed(() => `${siteUrl}${currentPath.value}`)

useSeoMeta(() => ({
  title: t('seo.title'),
  description: t('seo.description')
}))

useHead(() => ({
  htmlAttrs: {
    lang: locale.value
  },
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/` },
    { rel: 'alternate', hreflang: 'es', href: `${siteUrl}/es` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/` }
  ]
}))
</script>

<template>
  <SitePreload @done="preloadDone = true" />
  <ScrollProgressBar />
  <SiteNav />
  <div class="hero-zone">
    <HeroWavesCanvas />
    <HeroTagStrip />
    <HeroSection />
  </div>
  <main>
    <MarketGapSection />
    <ServicesSection />
    <SolutionsSection />
    <TechStackSection />
    <ProcessSection />
    <ProofSection />
    <FitSection />
    <FinalCtaSection />
  </main>
  <SiteFooter />
  <CustomCursor />
</template>
