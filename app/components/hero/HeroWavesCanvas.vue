<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
const reduced = useReducedMotion()
let dispose: (() => void) | null = null

onMounted(() => {
  if (!canvasRef.value || reduced.value) return
  dispose = useHeroWaves(canvasRef.value)
})

onBeforeUnmount(() => dispose?.())
</script>

<template>
  <canvas ref="canvasRef" class="hero-waves" />
</template>
