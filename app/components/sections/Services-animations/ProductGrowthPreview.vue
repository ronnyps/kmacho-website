<template>
  <div class="srv-ani srv-ani--growth" aria-hidden="true">
    <span class="axis axis--x"></span>
    <span class="axis axis--y"></span>
    <svg class="curve" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 34 C 24 30, 34 24, 52 22 C 68 20, 78 12, 98 8" />
    </svg>
    <span class="metric metric--a"></span>
    <span class="metric metric--b"></span>
  </div>
</template>

<style scoped>
.srv-ani {
  position: relative;
  width: 100%;
  height: 100%;
}

.axis {
  position: absolute;
  background: var(--border);
}

.axis--x { left: 10%; right: 8%; bottom: 16%; height: 1px; }
.axis--y { left: 10%; top: 16%; bottom: 16%; width: 1px; }

.curve {
  position: absolute;
  left: 10%;
  right: 8%;
  top: 16%;
  bottom: 16%;
  width: auto;
  height: auto;
}

.curve path {
  fill: none;
  stroke: var(--ink2);
  stroke-width: 1.6;
  stroke-dasharray: 180;
  stroke-dashoffset: 180;
  animation: trace 3.4s ease-in-out infinite;
}

.metric {
  position: absolute;
  width: 20%;
  height: 12%;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--surface) 55%, transparent);
  animation: fade 3.4s ease-in-out infinite;
}

.metric--a { left: 16%; top: 18%; }
.metric--b { right: 10%; top: 10%; animation-delay: 0.25s; }

@keyframes trace {
  0% { stroke-dashoffset: 180; opacity: 0.45; }
  55% { stroke-dashoffset: 0; opacity: 0.95; }
  100% { stroke-dashoffset: 0; opacity: 0.55; }
}

@keyframes fade {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.85; }
}
</style>
