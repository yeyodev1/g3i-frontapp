import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

/**
 * Marca la sección visible para la navegación sticky. Se re-observa cuando
 * cambian los ids (secciones que aparecen al llegar los datos).
 */
export function useSectionSpy(ids: Ref<string[]>, offset = 140) {
  const active = ref('')
  let observer: IntersectionObserver | null = null

  function observe() {
    observer?.disconnect()
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) active.value = visible[0].target.id
      },
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: 0 },
    )
    for (const id of ids.value) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  }

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - offset + 20
    window.scrollTo({ top, behavior: 'smooth' })
    active.value = id
  }

  // Espera al render de las secciones antes de observarlas.
  watch(ids, () => requestAnimationFrame(observe), { immediate: true, flush: 'post' })
  onBeforeUnmount(() => observer?.disconnect())

  return { active, scrollTo }
}
