<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
const reduced = useReducedMotion()
let raf = 0

const drawNoise = (context: CanvasRenderingContext2D, width: number, height: number) => {
  const image = context.createImageData(width, height)
  const data = image.data
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() > 0.52) {
      const v = Math.floor(Math.random() * 255)
      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
      data[i + 3] = 255
    } else {
      data[i + 3] = 0
    }
  }
  context.putImageData(image, 0, 0)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const context = canvas.getContext('2d')
  if (!context) return

  const tick = () => {
    const width = Math.max(640, Math.round(window.innerWidth * window.devicePixelRatio))
    const height = Math.max(360, Math.round(window.innerHeight * window.devicePixelRatio))
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    drawNoise(context, width, height)
    if (!reduced.value) raf = requestAnimationFrame(tick)
  }

  tick()
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <canvas ref="canvasRef" class="site-noise-overlay" aria-hidden="true"></canvas>
</template>
