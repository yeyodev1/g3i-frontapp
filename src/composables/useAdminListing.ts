import { reactive, ref, watch, type Ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Paginated } from '@/types'
import type { AdminListQuery } from '@/types/admin'

/**
 * Listado paginado con filtros. El buscador espera a que se deje de escribir
 * para no disparar una petición por tecla.
 */
export function useAdminListing<T>(fetcher: (query: AdminListQuery) => Promise<Paginated<T>>) {
  const toast = useToastStore()
  const query = reactive<AdminListQuery>({ q: '', status: '', type: '', kind: '', page: 1, limit: 20 })
  const items = ref([]) as Ref<T[]>
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    loading.value = true
    try {
      const data = await fetcher({ ...query })
      items.value = data.items
      total.value = data.total
      pages.value = data.pages || 1
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(
    () => query.q,
    () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        query.page = 1
        load()
      }, 350)
    },
  )

  watch(
    () => [query.status, query.type, query.kind],
    () => {
      query.page = 1
      load()
    },
  )

  watch(
    () => query.page,
    () => load(),
  )

  /** Reemplaza un elemento tras una acción rápida sin recargar todo. */
  function replace(updated: T & { _id: string }) {
    items.value = items.value.map((item) =>
      (item as { _id: string })._id === updated._id ? { ...item, ...updated } : item,
    )
  }

  function removeLocal(id: string) {
    items.value = items.value.filter((item) => (item as { _id: string })._id !== id)
    total.value = Math.max(0, total.value - 1)
  }

  return { query, items, total, pages, loading, loaded, load, replace, removeLocal }
}
