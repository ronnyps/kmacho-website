<script setup lang="ts">
const cursorRef = ref<HTMLDivElement | null>(null)
const isHover = ref(false)
const reduced = useReducedMotion()
let cleanup: (() => void) | null = null

onMounted(() => {
  if (reduced.value || !cursorRef.value) return

  const cursor = cursorRef.value
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const cur = { x: pos.x, y: pos.y }
  let raf = 0

  const onMove = (e: PointerEvent) => {
    pos.x = e.clientX
    pos.y = e.clientY
    isHover.value = !!(e.target as Element)?.closest?.('.interactive')
  }

  const tick = () => {
    cur.x += (pos.x - cur.x) * 0.12
    cur.y += (pos.y - cur.y) * 0.12
    cursor.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`
    raf = requestAnimationFrame(tick)
  }

  window.addEventListener('pointermove', onMove)
  tick()

  cleanup = () => {
    window.removeEventListener('pointermove', onMove)
    cancelAnimationFrame(raf)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div
    ref="cursorRef"
    class="custom-cursor"
    :class="{ 'is-hover': isHover }"
    aria-hidden="true"
  />
</template>
