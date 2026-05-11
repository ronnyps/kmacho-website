<template>
  <div ref="host" class="tech" aria-hidden="true" v-html="svgMarkup" />
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

const svgMarkup = ref('')
const host = ref<HTMLElement | null>(null)

onMounted(async () => {
  const response = await fetch('/svg/isometric/tech.svg', { cache: 'no-store' })
  if (!response.ok) return

  let svg = await response.text()

  const p = 'tech-'

  const inlineStyle = `<style>
#${p}screen, #${p}IA, #${p}code, #${p}centerBox { transition: transform 0.35s ease-out; }
#${p}screen:hover, #${p}IA:hover, #${p}code:hover, #${p}centerBox:hover { transform: translateY(-18px); }
@keyframes ${p}rippleOut {
  0%           { transform: scale(0.95); opacity: 0; }
  6%           { opacity: 0.65; }
  30%          { transform: scale(2);    opacity: 0; }
  30.1%, 100%  { transform: scale(0.95); opacity: 0; }
}
</style>`

  const DASH = 'stroke-dasharray="6 14" stroke-linecap="round"'

  svg = svg
    .replace(/(<svg\b[^>]*)\s+width="[^"]*"/, '$1')
    .replace(/(<svg\b[^>]*)\s+height="[^"]*"/, '$1')
    .replace(/(<svg\b[^>]*>)/, `$1${inlineStyle}`)
    .replace('id="connecto1" class="cls-9"', `id="connecto1" class="cls-6" ${DASH}`)
    .replace('id="connector2" class="cls-6"', `id="connector2" class="cls-6" ${DASH}`)
    .replace('id="connector3" class="cls-6"', `id="connector3" class="cls-6" ${DASH}`)
    .replace('id="connector4" class="cls-6"', `id="connector4" class="cls-6" ${DASH}`)
    .replace('id="connector5" class="cls-6"', `id="connector5" class="cls-6" ${DASH}`)
    .replace(/cls-/g, `${p}cls-`)
    .replace(/\bid="([^"]+)"/g, `id="${p}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${p}$1"`)

  svgMarkup.value = svg
  await nextTick()

  const svgRoot = host.value?.querySelector('svg')
  if (!svgRoot) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ;[`#${p}connecto1`, `#${p}connector2`, `#${p}connector3`, `#${p}connector4`, `#${p}connector5`].forEach((id) => {
    const el = svgRoot.querySelector(id)
    if (!el || reduced) return
    el.animate(
      [{ strokeDashoffset: '0' }, { strokeDashoffset: '-40' }],
      { duration: 1800, iterations: Infinity, easing: 'linear' },
    )
  })

  if (!reduced) {
    const centerBoxEl = svgRoot.querySelector(`#${p}centerBox`) as SVGGraphicsElement | null
    if (centerBoxEl) {
      const bbox = centerBoxEl.getBBox()
      const cx = bbox.x + bbox.width / 2
      const cy = bbox.y + bbox.height / 2
      const rx = bbox.width / 2
      const ry = rx * 0.58

      const ns = 'http://www.w3.org/2000/svg'
      ;[0, 550, 1100].forEach((delay) => {
        const ellipse = document.createElementNS(ns, 'ellipse')
        ellipse.setAttribute('cx', String(cx))
        ellipse.setAttribute('cy', String(cy))
        ellipse.setAttribute('rx', String(rx))
        ellipse.setAttribute('ry', String(ry))
        ellipse.setAttribute('fill', 'none')
        ellipse.setAttribute('stroke', 'var(--accent)')
        ellipse.setAttribute('stroke-width', '1.5')
        ellipse.style.transformOrigin = `${cx}px ${cy}px`
        ellipse.style.animation = `${p}rippleOut 7s ease-out ${delay}ms infinite`
        svgRoot.appendChild(ellipse)
      })
    }
  }
})
</script>

<style scoped>
.tech {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.tech :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
