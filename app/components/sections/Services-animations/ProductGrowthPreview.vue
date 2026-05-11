<template>
  <div ref="host" class="growth" aria-hidden="true" v-html="svgMarkup" />
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

const svgMarkup = ref('')
const host = ref<HTMLElement | null>(null)

onMounted(async () => {
  const response = await fetch('/svg/isometric/growth.svg', { cache: 'no-store' })
  if (!response.ok) return

  let svg = await response.text()

  const p = 'growth-'
  const DASH = 'stroke-dasharray="6 14" stroke-linecap="round"'

  svg = svg
    .replace(/(<svg\b[^>]*)\s+width="[^"]*"/, '$1')
    .replace(/(<svg\b[^>]*)\s+height="[^"]*"/, '$1')
    .replace('id="connector1" class="cls-7"', `id="connector1" class="cls-7" ${DASH}`)
    .replace('id="connector2" class="cls-7"', `id="connector2" class="cls-7" ${DASH}`)
    .replace('id="connector3" class="cls-7"', `id="connector3" class="cls-7" ${DASH}`)
    .replace('id="connector4" class="cls-7"', `id="connector4" class="cls-7" ${DASH}`)
    .replace('id="connector5" class="cls-7"', `id="connector5" class="cls-7" ${DASH}`)
    .replace(/cls-/g, `${p}cls-`)
    .replace(/\bid="([^"]+)"/g, `id="${p}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${p}$1"`)

  svgMarkup.value = svg
  await nextTick()

  const svgRoot = host.value?.querySelector('svg')
  if (!svgRoot) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ;[1, 2, 3, 4, 5].forEach((n) => {
    const el = svgRoot.querySelector(`#${p}connector${n}`)
    if (!el || reduced) return
    el.animate(
      [{ strokeDashoffset: '0' }, { strokeDashoffset: '-40' }],
      { duration: 1800, iterations: Infinity, easing: 'linear' },
    )
  })
})
</script>

<style scoped>
.growth {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.growth :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
