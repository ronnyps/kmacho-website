<script setup lang="ts">
import SiteNoiseOverlay from './components/ui/SiteNoiseOverlay.vue'
</script>

<template>
  <ClientOnly>
    <SiteNoiseOverlay />
  </ClientOnly>
  <NuxtPage />
</template>
