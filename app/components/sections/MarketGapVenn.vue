<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

type SegmentKey = 'enterprise' | 'startup' | 'freelancer'

type VennLabel = {
  key: SegmentKey
  text: string
  x: number
  y: number
}

const root = ref<HTMLElement | null>(null)
const reduced = useReducedMotion()

let ctx: gsap.Context | null = null
let observer: IntersectionObserver | null = null
let pulseTweens: gsap.core.Tween[] = []

// viewBox 700x750; circles are intentionally oversized for edge bleed.
const cx = 340
const cy = 375
const r = 280
const Rc = 195

const CIRCLES = {
  topLeft: { x: cx - Rc / 2, y: cy - Rc * Math.sqrt(3) / 2 },
  right: { x: cx + Rc, y: cy },
  bottomLeft: { x: cx - Rc / 2, y: cy + Rc * Math.sqrt(3) / 2 },
}

const KMACHO = { x: cx, y: cy }

// Intersection anchors for connectors and decorative dots.
const segmentDots: Record<SegmentKey, { x: number; y: number }> = {
  enterprise: { x: 277, y: 266 },
  startup: { x: 466, y: 375 },
  freelancer: { x: 277, y: 484 },
}

const DOTS = [segmentDots.enterprise, segmentDots.startup, segmentDots.freelancer]

const vennLabels: VennLabel[] = [
  { key: 'enterprise', text: 'ENTERPRISE', x: CIRCLES.topLeft.x - 82, y: CIRCLES.topLeft.y - 88 },
  { key: 'startup', text: 'STARTUP', x: CIRCLES.right.x + 84, y: CIRCLES.right.y + 82 },
  { key: 'freelancer', text: 'FREELANCER', x: CIRCLES.bottomLeft.x - 82, y: CIRCLES.bottomLeft.y + 88 },
]

const connectorStartOffset: Record<SegmentKey, { dx: number; dy: number }> = {
  enterprise: { dx: 32, dy: 24 },
  startup: { dx: -34, dy: -18 },
  freelancer: { dx: 30, dy: -24 },
}

const CONNECTORS = vennLabels.map((label) => ({
  x1: label.x + connectorStartOffset[label.key].dx,
  y1: label.y + connectorStartOffset[label.key].dy,
  x2: segmentDots[label.key].x,
  y2: segmentDots[label.key].y,
}))

const playEntry = () => {
  if (!root.value) return

  // Instante 0: superficie visible — los hijos manejan su propia entrada
  gsap.set('.vn-surface', { opacity: 1 })

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // Círculos: entran desde sus offsets direccionales.
  // back.out(1.1) da el overshoot de asentamiento de forma nativa,
  // sin necesidad de un segundo tween que compita sobre `scale`.
  tl.to('.vn-circle--topleft',    { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.72, ease: 'back.out(1.1)' }, 0)
    .to('.vn-circle--right',      { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.75, ease: 'back.out(1.1)' }, 0.07)
    .to('.vn-circle--bottomleft', { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.78, ease: 'back.out(1.1)' }, 0.14)
    .to('.vn-connector', { opacity: 1, strokeDashoffset: 0, duration: 0.48, stagger: 0.07, ease: 'power2.out' }, 0.52)
    .to('.vn-segment-label', { opacity: 0.92, y: 0, duration: 0.38, stagger: 0.07, ease: 'power2.out' }, 0.66)
    .to('.vn-dot', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.09, ease: 'back.out(2)' }, 0.82)
    .to('.vn-kmacho-label', { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 0.90)
    .fromTo(
      '.vn-pulse-ring',
      { attr: { r: 18 }, opacity: 0.65 },
      { attr: { r: 100 }, opacity: 0, duration: 1.0, ease: 'power1.out' },
      0.92,
    )
    .add(() => {
      pulseTweens.forEach((t) => t.kill())
      pulseTweens = []
      root.value?.querySelectorAll<SVGCircleElement>('.vn-dot-pulse').forEach((node, i) => {
        gsap.set(node, { opacity: 0 })
        const tw = gsap.fromTo(
          node,
          { attr: { r: 7 }, opacity: 0.3 },
          { attr: { r: 28 }, opacity: 0, duration: 1.9, repeat: -1, ease: 'sine.out', delay: i * 0.24 },
        )
        pulseTweens.push(tw)
      })
    }, 0.86)
}

onMounted(() => {
  if (!root.value) return

  ctx = gsap.context(() => {
    gsap.set('.vn-surface', { opacity: 0 })
    gsap.set('.vn-circle--topleft', { x: -55, y: -38, scale: 0.86, opacity: 0 })
    gsap.set('.vn-circle--right', { x: 64, y: 8, scale: 0.86, opacity: 0 })
    gsap.set('.vn-circle--bottomleft', { x: -52, y: 42, scale: 0.86, opacity: 0 })
    gsap.set('.vn-connector', { opacity: 0 })
    gsap.set('.vn-segment-label', { opacity: 0, y: 10 })
    gsap.set('.vn-dot', { opacity: 0, scale: 0.5, transformOrigin: 'center center' })
    gsap.set('.vn-dot-pulse', { opacity: 0, attr: { r: 7 } })
    gsap.set('.vn-kmacho-label', { opacity: 0, y: 8 })
    gsap.set('.vn-pulse-ring', { opacity: 0, attr: { r: 18 } })
    root.value?.querySelectorAll<SVGLineElement>('.vn-connector').forEach((line) => {
      const length = line.getTotalLength()
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
    })
  }, root.value)

  if (reduced.value) {
    gsap.set('.vn-surface', { opacity: 1 })
    gsap.set('.vn-circle--topleft', { x: 0, y: 0, opacity: 1 })
    gsap.set('.vn-circle--right', { x: 0, opacity: 1 })
    gsap.set('.vn-circle--bottomleft', { x: 0, y: 0, opacity: 1 })
    gsap.set('.vn-connector', { opacity: 1 })
    gsap.set('.vn-segment-label', { opacity: 0.9 })
    gsap.set('.vn-dot', { opacity: 1 })
    gsap.set('.vn-dot-pulse', { opacity: 0 })
    gsap.set('.vn-kmacho-label', { opacity: 1, y: 0 })
    gsap.set('.vn-pulse-ring', { opacity: 0 })
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        playEntry()
        observer?.disconnect()
      }
    },
    { threshold: 0.3 },
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  pulseTweens.forEach((t) => t.kill())
  pulseTweens = []
  observer?.disconnect()
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="venn" aria-hidden="true">
    <svg class="venn__svg" viewBox="0 0 700 750" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="vn-grad-tl" x1="78%" y1="78%" x2="18%" y2="18%">
          <stop offset="0%" class="vn-stop-tl-0" />
          <stop offset="62%" class="vn-stop-tl-1" />
          <stop offset="100%" class="vn-stop-tl-2" />
        </linearGradient>
        <linearGradient id="vn-grad-r" x1="18%" y1="52%" x2="88%" y2="58%">
          <stop offset="0%" class="vn-stop-r-0" />
          <stop offset="62%" class="vn-stop-r-1" />
          <stop offset="100%" class="vn-stop-r-2" />
        </linearGradient>
        <linearGradient id="vn-grad-bl" x1="78%" y1="22%" x2="20%" y2="86%">
          <stop offset="0%" class="vn-stop-bl-0" />
          <stop offset="62%" class="vn-stop-bl-1" />
          <stop offset="100%" class="vn-stop-bl-2" />
        </linearGradient>
      </defs>

      <g class="vn-surface">
        <g class="vn-circle vn-circle--topleft">
          <circle class="vn-circle-fill" :cx="CIRCLES.topLeft.x" :cy="CIRCLES.topLeft.y" :r="r" fill="url(#vn-grad-tl)" />
        </g>
        <g class="vn-circle vn-circle--right">
          <circle class="vn-circle-fill" :cx="CIRCLES.right.x" :cy="CIRCLES.right.y" :r="r" fill="url(#vn-grad-r)" />
        </g>
        <g class="vn-circle vn-circle--bottomleft">
          <circle class="vn-circle-fill" :cx="CIRCLES.bottomLeft.x" :cy="CIRCLES.bottomLeft.y" :r="r" fill="url(#vn-grad-bl)" />
        </g>

        <g class="vn-connectors">
          <line
            v-for="(c, i) in CONNECTORS"
            :key="i"
            class="vn-connector"
            :x1="c.x1"
            :y1="c.y1"
            :x2="c.x2"
            :y2="c.y2"
          />
        </g>

        <g class="vn-segment-labels">
          <text
            v-for="label in vennLabels"
            :key="label.key"
            class="vn-segment-label"
            :x="label.x"
            :y="label.y"
            text-anchor="middle"
          >{{ label.text }}</text>
        </g>

        <g class="vn-dots">
          <g v-for="(dot, i) in DOTS" :key="i" class="vn-dot">
            <circle class="vn-dot-pulse" :cx="dot.x" :cy="dot.y" r="7" />
            <circle class="vn-dot-ring" :cx="dot.x" :cy="dot.y" r="6" />
            <circle class="vn-dot-core" :cx="dot.x" :cy="dot.y" r="3" />
          </g>
        </g>

        <g class="vn-kmacho">
          <circle class="vn-pulse-ring" :cx="KMACHO.x" :cy="KMACHO.y" r="18" />
          <text class="vn-kmacho-label" :x="KMACHO.x" :y="KMACHO.y + 8" text-anchor="middle">K'MACHO</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.venn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Keep left bleed visible while clipping the rest */
  clip-path: inset(0 0 0 -9999px);
}

.venn__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.vn-circle-fill {
  transform-box: fill-box;
  transform-origin: center;
  opacity: 1;
  mix-blend-mode: multiply;
}

.vn-stop-tl-0 { stop-color: color-mix(in srgb, var(--bg) 48%, var(--ink2) 52%); stop-opacity: 0.2; }
.vn-stop-tl-1 { stop-color: color-mix(in srgb, var(--bg) 62%, var(--ink2) 38%); stop-opacity: 0.12; }
.vn-stop-tl-2 { stop-color: color-mix(in srgb, var(--bg) 76%, var(--ink3) 24%); stop-opacity: 0.05; }

.vn-stop-r-0 { stop-color: color-mix(in srgb, var(--bg) 50%, var(--ink2) 50%); stop-opacity: 0.2; }
.vn-stop-r-1 { stop-color: color-mix(in srgb, var(--bg) 64%, var(--ink2) 36%); stop-opacity: 0.12; }
.vn-stop-r-2 { stop-color: color-mix(in srgb, var(--bg) 78%, var(--ink3) 22%); stop-opacity: 0.05; }

.vn-stop-bl-0 { stop-color: color-mix(in srgb, var(--bg) 48%, var(--ink2) 52%); stop-opacity: 0.2; }
.vn-stop-bl-1 { stop-color: color-mix(in srgb, var(--bg) 62%, var(--ink2) 38%); stop-opacity: 0.12; }
.vn-stop-bl-2 { stop-color: color-mix(in srgb, var(--bg) 76%, var(--ink3) 24%); stop-opacity: 0.05; }

.vn-segment-label {
  font-family: 'Cascadia Code', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.18em;
  fill: color-mix(in srgb, var(--bg) 30%, var(--ink) 70%);
  text-transform: uppercase;
  pointer-events: none;
}

.vn-connector {
  stroke: color-mix(in srgb, var(--ink) 20%, var(--bg) 80%);
  stroke-width: 0.75;
  fill: none;
}

.vn-dot-ring {
  fill: none;
  stroke: color-mix(in srgb, var(--bg) 60%, var(--ink) 40%);
  stroke-width: 1;
}

.vn-dot-pulse {
  fill: none;
  stroke: color-mix(in srgb, var(--bg) 55%, var(--ink) 45%);
  stroke-width: 0.9;
  opacity: 0;
}

.vn-dot-core {
  fill: color-mix(in srgb, var(--bg) 75%, var(--ink) 25%);
}

.vn-pulse-ring {
  fill: none;
  stroke: color-mix(in srgb, var(--ink) 50%, var(--ink3) 50%);
  stroke-width: 1.5;
}

.vn-kmacho-label {
  fill: color-mix(in srgb, var(--bg) 8%, var(--ink) 92%);
  font-size: 22px;
  font-weight: var(--font-weight-700, 700);
  letter-spacing: 0.04em;
  font-family: 'Cascadia Code', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace;
}
</style>
