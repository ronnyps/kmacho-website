<template>
  <div class="tech" aria-hidden="true">
    <svg class="tech__svg" viewBox="0 0 560 210" fill="none">
      <line class="c-wire" x1="490" y1="44" x2="410" y2="44" />
      <line class="c-flow" x1="490" y1="44" x2="410" y2="44" style="--fd:0.7s" />

      <line class="c-wire" x1="490" y1="106" x2="410" y2="106" />
      <line class="c-flow" x1="490" y1="106" x2="410" y2="106" style="--fd:1.4s" />

      <line class="c-wire" x1="490" y1="168" x2="410" y2="168" />
      <line class="c-flow" x1="490" y1="168" x2="410" y2="168" style="--fd:2.1s" />

      <g class="anim-in" style="--d:0.04s">
        <rect class="c-screen" x="62" y="8" width="348" height="194" rx="10" />
        <line class="c-head-line" x1="62" y1="34" x2="410" y2="34" />
        <circle class="c-hdot" cx="78" cy="21" r="4" />
        <circle class="c-hdot" cx="90" cy="21" r="4" style="animation-delay:.35s" />
        <circle class="c-hdot" cx="102" cy="21" r="4" style="animation-delay:.7s" />
        <line class="c-sdiv" x1="112" y1="34" x2="112" y2="202" />

        <rect class="c-sb" x="70" y="44" width="34" height="4" rx="2" />
        <rect class="c-sb" x="70" y="57" width="26" height="4" rx="2" />
        <rect class="c-sb" x="70" y="70" width="30" height="4" rx="2" />
        <rect class="c-sb" x="70" y="83" width="22" height="4" rx="2" />
        <rect class="c-sb" x="70" y="96" width="28" height="4" rx="2" />
        <rect class="c-sb" x="70" y="109" width="24" height="4" rx="2" />
        <rect class="c-sb" x="70" y="122" width="32" height="4" rx="2" />
        <rect class="c-sb" x="70" y="135" width="20" height="4" rx="2" />

        <rect class="c-box" x="122" y="38" width="100" height="62" rx="4" />
        <rect class="c-box" x="230" y="38" width="172" height="62" rx="4" />
        <rect class="c-box" x="122" y="110" width="280" height="84" rx="4" />
        <rect class="c-sb" x="132" y="126" width="160" height="4" rx="2" />
        <rect class="c-sb" x="132" y="139" width="230" height="4" rx="2" />
        <rect class="c-sb" x="132" y="152" width="130" height="4" rx="2" />
        <rect class="c-sb" x="132" y="165" width="188" height="4" rx="2" />
      </g>

      <g class="anim-in" style="--d:0.38s">
        <rect class="c-node" x="427" y="18" width="68" height="52" rx="8" />
        <rect class="c-nbox" x="434" y="25" width="54" height="38" rx="5" />
        <text class="c-lbl c-lbl--caps" x="461" y="50" text-anchor="middle">{{ rightNodes[0] }}</text>
        <circle class="c-st" cx="427" cy="26" r="4" />
      </g>

      <g class="anim-in" style="--d:0.48s">
        <rect class="c-node" x="427" y="90" width="68" height="32" rx="8" />
        <text class="c-lbl c-lbl--caps" x="461" y="111" text-anchor="middle">{{ rightNodes[1] }}</text>
        <circle class="c-st" cx="427" cy="99" r="4" />
      </g>

      <g class="anim-in" style="--d:0.56s">
        <rect class="c-node" x="427" y="142" width="68" height="52" rx="8" />
        <rect class="c-nbox" x="434" y="149" width="54" height="38" rx="5" />
        <text class="c-lbl c-lbl--caps" x="461" y="174" text-anchor="middle">{{ rightNodes[2] }}</text>
        <circle class="c-st" cx="427" cy="150" r="4" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const nodePool = ['AI', 'API', 'DB', 'AUTH', 'ML', 'ETL', 'CMS']
const nodeOffset = ref(0)

const rightNodes = computed(() => {
  const len = nodePool.length
  return [
    nodePool[nodeOffset.value % len],
    nodePool[(nodeOffset.value + 1) % len],
    nodePool[(nodeOffset.value + 2) % len]
  ]
})

let rotationTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  rotationTimer = setInterval(() => {
    nodeOffset.value = (nodeOffset.value + 1) % nodePool.length
  }, 1800)
})

onBeforeUnmount(() => {
  if (rotationTimer) clearInterval(rotationTimer)
})
</script>

<style scoped>
.tech {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech__svg {
  width: 100%;
  height: 100%;
}

.c-screen {
  fill: none;
  stroke: color-mix(in srgb, var(--ink) 22%, var(--bg) 78%);
  stroke-width: 0.8;
}

.c-head-line {
  stroke: color-mix(in srgb, var(--ink) 14%, var(--bg) 86%);
  stroke-width: 0.8;
}

.c-hdot {
  fill: none;
  stroke: color-mix(in srgb, var(--ink) 26%, var(--bg) 74%);
  stroke-width: 0.8;
  animation: pulse 2.4s ease-in-out infinite;
}

.c-sdiv {
  stroke: color-mix(in srgb, var(--ink) 14%, var(--bg) 86%);
  stroke-width: 0.6;
}

.c-sb {
  fill: color-mix(in srgb, var(--ink) 16%, var(--bg) 84%);
}

.c-box {
  fill: none;
  stroke: color-mix(in srgb, var(--ink) 15%, var(--bg) 85%);
  stroke-width: 0.7;
}

.c-node {
  fill: none;
  stroke: color-mix(in srgb, var(--ink) 20%, var(--bg) 80%);
  stroke-width: 0.8;
}

.c-nbox {
  fill: color-mix(in srgb, var(--ink) 5%, var(--bg) 95%);
  stroke: color-mix(in srgb, var(--ink) 13%, var(--bg) 87%);
  stroke-width: 0.6;
}

.c-st {
  fill: color-mix(in srgb, var(--ink) 32%, var(--bg) 68%);
  animation: pulse 2s ease-in-out infinite;
}

.c-lbl {
  font-family: 'Cascadia Code', 'Fira Code', 'SF Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  fill: color-mix(in srgb, var(--ink) 28%, var(--bg) 72%);
}

.c-lbl--caps {
  letter-spacing: 0.05em;
}

.c-wire {
  stroke: color-mix(in srgb, var(--ink) 10%, var(--bg) 90%);
  stroke-width: 0.6;
}

.c-flow {
  stroke: color-mix(in srgb, var(--ink) 38%, var(--bg) 62%);
  stroke-width: 1.2;
  stroke-dasharray: 4 10;
  animation: flow 1.4s linear infinite var(--fd, 0s);
}

.anim-in {
  opacity: 0;
  animation: fadein 0.5s ease forwards var(--d, 0s);
}

@keyframes fadein {
  to {
    opacity: 1;
  }
}

@keyframes flow {
  to {
    stroke-dashoffset: -28;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .anim-in {
    animation: none;
    opacity: 1;
  }

  .c-flow {
    animation: none;
  }

  .c-hdot,
  .c-st {
    animation: none;
    opacity: 0.7;
  }
}
</style>
