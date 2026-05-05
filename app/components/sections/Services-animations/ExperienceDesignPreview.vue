<template>
  <div class="srv-ani srv-ani--layout" aria-hidden="true">
    <span class="frame"></span>
    <span class="bar bar--1"></span>
    <span class="bar bar--2"></span>
    <span class="panel panel--left"></span>
    <span class="panel panel--right"></span>
    <span class="cta"></span>
  </div>
</template>

<style scoped>
.srv-ani {
  position: relative;
  width: 100%;
  height: 100%;
}

.frame {
  position: absolute;
  inset: 12% 8%;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.bar,
.panel,
.cta {
  position: absolute;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--surface) 58%, transparent);
}

.bar--1 { left: 14%; top: 22%; width: 28%; height: 7%; }
.bar--2 { left: 46%; top: 22%; width: 40%; height: 7%; opacity: 0.7; }
.panel--left { left: 14%; top: 36%; width: 32%; height: 34%; animation: shiftA 3.2s ease-in-out infinite; }
.panel--right { left: 50%; top: 36%; width: 36%; height: 34%; animation: shiftB 3.2s ease-in-out infinite; }
.cta { left: 32%; bottom: 18%; width: 36%; height: 10%; border-color: var(--ink3); }

@keyframes shiftA {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(8%); }
}

@keyframes shiftB {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-8%); }
}
</style>
