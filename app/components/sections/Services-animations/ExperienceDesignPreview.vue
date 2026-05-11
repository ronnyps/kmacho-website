<template>
  <div ref="host" class="experience" aria-hidden="true" v-html="svgMarkup" />
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

const svgMarkup = ref('')
const host = ref<HTMLElement | null>(null)

onMounted(async () => {
  const response = await fetch('/svg/isometric/uiux.svg', { cache: 'no-store' })
  if (!response.ok) return

  let svg = await response.text()

  const p = 'uiux-'
  const DASH = 'stroke-dasharray="6 14" stroke-linecap="round"'
  const hoverIds = ['slect', 'crop', 'shape', 'text', 'paint', 'code']

  const inlineStyle = `<style>
${hoverIds.map(id => `#${p}${id}`).join(', ')} { transition: transform 0.35s ease-out; }
${hoverIds.map(id => `#${p}${id}:hover`).join(', ')} { transform: translateY(-8px); }
</style>`

  svg = svg
    .replace(/(<svg\b[^>]*)\s+width="[^"]*"/, '$1')
    .replace(/(<svg\b[^>]*)\s+height="[^"]*"/, '$1')
    .replace(/(<svg\b[^>]*>)/, `$1${inlineStyle}`)
    .replace('id="connector1" class="cls-6"', `id="connector1" class="cls-6" ${DASH}`)
    .replace('id="connector2" class="cls-6"', `id="connector2" class="cls-6" ${DASH}`)
    .replace('id="connector3" class="cls-6"', `id="connector3" class="cls-6" ${DASH}`)
    .replace('id="connector4" class="cls-6"', `id="connector4" class="cls-6" ${DASH}`)
    .replace(/cls-/g, `${p}cls-`)
    .replace(/\bid="([^"]+)"/g, `id="${p}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${p}$1"`)

  svgMarkup.value = svg
  await nextTick()

  const svgRoot = host.value?.querySelector('svg')
  if (!svgRoot) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ;[`#${p}connector1`, `#${p}connector2`, `#${p}connector3`, `#${p}connector4`].forEach((id) => {
    const el = svgRoot.querySelector(id)
    if (!el || reduced) return
    el.animate(
      [{ strokeDashoffset: '0' }, { strokeDashoffset: '-40' }],
      { duration: 1800, iterations: Infinity, easing: 'linear' },
    )
  })
})
</script>

<style scoped>
.experience {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.experience :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
