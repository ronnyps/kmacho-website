<script setup lang="ts">
const cursorRef = ref<HTMLDivElement | null>(null)
const isHover = ref(false)
const reduced = useReducedMotion()
let cleanup: (() => void) | null = null

const setCursorMode = (blend: 'normal' | 'difference', tone: 'light' | 'dark') => {
  if (!cursorRef.value) return
  cursorRef.value.style.setProperty('--cursor-blend-mode', blend)
  cursorRef.value.style.setProperty('--cursor-color', tone === 'light' ? 'var(--dark-ink)' : 'var(--ink)')
}

onMounted(() => {
  if (reduced.value || !cursorRef.value) return

  const cursor = cursorRef.value
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const cur = { x: pos.x, y: pos.y }
  let raf = 0

  const onMove = (e: PointerEvent) => {
    pos.x = e.clientX
    pos.y = e.clientY
    const target = e.target as Element | null
    isHover.value = !!target?.closest?.('.interactive')

    if (target?.closest?.('.hero-zone') || document.body.classList.contains('is-dark-zone')) {
      setCursorMode('difference', 'light')
      return
    }

    if (target?.closest?.('[data-cursor-surface="true"]')) {
      setCursorMode('difference', 'light')
      return
    }

    setCursorMode('normal', 'dark')
  }

  const tick = () => {
    cur.x += (pos.x - cur.x) * 0.12
    cur.y += (pos.y - cur.y) * 0.12
    cursor.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`
    raf = requestAnimationFrame(tick)
  }

  setCursorMode('normal', 'dark')
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
