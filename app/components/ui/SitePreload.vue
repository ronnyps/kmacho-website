<script setup lang="ts">
import gsap from 'gsap'

const emit = defineEmits<{
  done: []
}>()

const rootRef = ref<HTMLElement | null>(null)
const logoRef = ref<HTMLElement | null>(null)
const noiseRef = ref<HTMLCanvasElement | null>(null)
const reduced = useReducedMotion()

let raf = 0
let ctx: gsap.Context | null = null
let finished = false

const complete = () => {
  if (finished) return
  finished = true
  if (raf) cancelAnimationFrame(raf)
  document.body.classList.remove('is-preloading')
  emit('done')
}

const startNoise = () => {
  if (!noiseRef.value) return

  const canvas = noiseRef.value
  const context = canvas.getContext('2d')
  if (!context) return

  // Tamaño fijo pequeño — el CSS lo estira, el grain sigue siendo convincente.
  // Evita alocar/destruir 20MB por frame en pantallas retina.
  const W = 1280
  const H = 720
  canvas.width = W
  canvas.height = H

  // ImageData pre-alocada una sola vez — sin GC en el loop de animación
  const image = context.createImageData(W, H) // ~3.7MB vs ~20MB a DPR completo
  const data = image.data
  let tick = 0

  const draw = () => {
    raf = requestAnimationFrame(draw)
    // 30fps: salta frames pares — mitad de trabajo, imperceptible visualmente
    if (++tick % 2 !== 0) return

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() > 0.52 ? 255 : 0
      data[i] = value
      data[i + 1] = value
      data[i + 2] = value
      data[i + 3] = value ? 36 : 0
    }
    context.putImageData(image, 0, 0)
  }

  draw()
}

onMounted(() => {
  document.body.classList.add('is-preloading')
  startNoise()

  if (!rootRef.value || !logoRef.value || reduced.value) {
    window.setTimeout(complete, reduced.value ? 200 : 1400)
    return
  }

  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Noise: entra rápido y se queda — no se apaga en toda la animación
    tl.to(noiseRef.value, { opacity: 0.45, duration: 0.3, ease: 'power2.out' }, 0)

    // Logo: entra desde abajo con blur — power3.out, sin overshoot
    tl.fromTo(
      logoRef.value,
      { autoAlpha: 0, y: 24, scale: 0.88, filter: 'blur(6px)' },
      { autoAlpha: 1, y: 0, scale: 1.1, filter: 'blur(0px)', duration: 0.58, ease: 'power3.out' },
      0.14,
    )

    // Going-back + color shift: arrancan juntos, terminan juntos en t=1.00
    // El logo llega a su posición final ya con el color cambiado — sin gap
    tl.to(logoRef.value, { y: -8, scale: 1.0, duration: 0.38, ease: 'power2.out' }, 0.62)
    tl.to('.site-preload__logo', { backgroundColor: 'var(--dark-ink)', duration: 0.38, ease: 'power2.out' }, 0.62)

    // Panel: ~300ms de hold tras la llegada, luego sube con el logo
    tl.to(rootRef.value, { yPercent: -100, duration: 0.72, ease: 'power3.in' }, 1.30)

    tl.add(complete)
  }, rootRef.value)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  ctx?.revert()
  document.body.classList.remove('is-preloading')
})
</script>

<template>
  <div ref="rootRef" class="site-preload" aria-hidden="true">
    <canvas ref="noiseRef" class="site-preload__noise"></canvas>
    <div ref="logoRef" class="site-preload__logo-wrap">
      <span class="site-preload__logo" role="presentation"></span>
    </div>
  </div>
</template>
