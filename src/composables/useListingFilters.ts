import { computed } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'

/**
 * Filtros de un listado sincronizados con la query string: el enlace se puede
 * compartir y "atrás" restaura la búsqueda. Cambiar un filtro vuelve a la
 * página 1. `ignore` son claves que viajan en la URL pero no cuentan como
 * filtro activo (ej. la vista lista/mapa).
 */
export function useListingFilters<K extends string>(keys: readonly K[], ignore: readonly K[] = []) {
  const route = useRoute()
  const router = useRouter()

  const filters = computed(() => {
    const out = {} as Record<K, string>
    for (const key of keys) {
      const raw = route.query[key]
      out[key] = typeof raw === 'string' ? raw : ''
    }
    return out
  })

  const page = computed(() => Math.max(1, Number(route.query.page) || 1))

  const activeCount = computed(
    () => keys.filter((k) => !ignore.includes(k) && k !== ('sort' as K) && filters.value[k]).length,
  )

  function buildQuery(patch: Partial<Record<K | 'page', string | number>>): LocationQueryRaw {
    const query: LocationQueryRaw = {}
    for (const key of keys) if (filters.value[key]) query[key] = filters.value[key]
    if (page.value > 1) query.page = String(page.value)
    for (const [key, value] of Object.entries(patch)) {
      if (value === '' || value === undefined || value === null) delete query[key]
      else query[key] = String(value)
    }
    if (!('page' in patch)) delete query.page
    return query
  }

  function update(patch: Partial<Record<K | 'page', string | number>>) {
    router.replace({ query: buildQuery(patch) })
  }

  function setPage(n: number) {
    router.push({ query: buildQuery({ page: n > 1 ? n : '' } as Partial<Record<K | 'page', string>>) })
  }

  function clear() {
    const query: LocationQueryRaw = {}
    for (const key of ignore) if (filters.value[key]) query[key] = filters.value[key]
    router.replace({ query })
  }

  return { filters, page, activeCount, update, setPage, clear }
}
