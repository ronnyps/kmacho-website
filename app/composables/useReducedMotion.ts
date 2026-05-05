export const useReducedMotion = () => {
  const reduced = ref(false)
  const mq = ref<MediaQueryList | null>(null)

  const update = () => {
    if (mq.value) {
      reduced.value = mq.value.matches
    }
  }

  onMounted(() => {
    mq.value = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mq.value.addEventListener('change', update)
  })

  onBeforeUnmount(() => {
    if (mq.value) {
      mq.value.removeEventListener('change', update)
    }
  })

  return reduced
}
