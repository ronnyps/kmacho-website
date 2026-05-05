<script setup lang="ts">
const barRef = ref<HTMLDivElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(() => {
  const bar = barRef.value
  if (!bar) return

  const onScroll = () => {
    const doc = document.documentElement
    const total = doc.scrollHeight - doc.clientHeight
    const ratio = total > 0 ? (window.scrollY || window.pageYOffset) / total : 0
    bar.style.transform = `scaleX(${ratio})`
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  cleanup = () => window.removeEventListener('scroll', onScroll)
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div class="scroll-progress" aria-hidden="true">
    <div ref="barRef" class="scroll-progress__bar" />
  </div>
</template>
