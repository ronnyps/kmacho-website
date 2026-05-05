<template>
  <div class="srv-ani srv-ani--timeline" aria-hidden="true">
    <span class="line"></span>
    <span class="dot dot--1"></span>
    <span class="dot dot--2"></span>
    <span class="dot dot--3"></span>
    <span class="label label--1"></span>
    <span class="label label--2"></span>
    <span class="label label--3"></span>
  </div>
</template>

<style scoped>
.srv-ani {
  position: relative;
  width: 100%;
  height: 100%;
}

.line {
  position: absolute;
  left: 12%;
  right: 12%;
  top: 48%;
  height: 1px;
  background: var(--border);
}

.dot {
  position: absolute;
  top: calc(48% - 4px);
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--ink3);
  animation: ping 2.8s ease-in-out infinite;
}

.dot--1 { left: 18%; }
.dot--2 { left: 48%; animation-delay: 0.2s; }
.dot--3 { left: 78%; animation-delay: 0.4s; }

.label {
  position: absolute;
  width: 18%;
  height: 10%;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--surface) 50%, transparent);
  animation: glow 2.8s ease-in-out infinite;
}

.label--1 { left: 12%; top: 26%; }
.label--2 { left: 42%; top: 60%; animation-delay: 0.2s; }
.label--3 { left: 72%; top: 26%; animation-delay: 0.4s; }

@keyframes ping {
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes glow {
  0%, 100% { opacity: 0.42; }
  50% { opacity: 0.8; }
}
</style>
