import { computed, onUnmounted, ref, watch, type Ref } from 'vue'
import { useBodyScroll } from './useBodyScroll'

/**
 * Estado de un lightbox: índice, teclado (flechas / Esc) y swipe táctil.
 * El total se pasa como ref porque las imágenes llegan después del fetch.
 */
export function useGallery(total: Ref<number>) {
  const index = ref(0)
  const open = ref(false)
  let touchX = 0

  useBodyScroll(open)

  const hasMany = computed(() => total.value > 1)

  function go(i: number) {
    if (!total.value) return
    index.value = (i + total.value) % total.value
  }
  const next = () => go(index.value + 1)
  const prev = () => go(index.value - 1)

  function show(i = 0) {
    go(i)
    open.value = true
  }
  const close = () => (open.value = false)

  function onKey(e: KeyboardEvent) {
    if (!open.value) return
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowRight') next()
    else if (e.key === 'ArrowLeft') prev()
  }

  function onTouchStart(e: TouchEvent) {
    touchX = e.changedTouches[0]?.clientX ?? 0
  }
  function onTouchEnd(e: TouchEvent) {
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX
    if (Math.abs(dx) < 40) return
    if (dx < 0) next()
    else prev()
  }

  watch(open, (value) => {
    if (value) window.addEventListener('keydown', onKey)
    else window.removeEventListener('keydown', onKey)
  })
  watch(total, () => {
    if (index.value >= total.value) index.value = 0
  })
  onUnmounted(() => window.removeEventListener('keydown', onKey))

  return { index, open, hasMany, go, next, prev, show, close, onTouchStart, onTouchEnd }
}
