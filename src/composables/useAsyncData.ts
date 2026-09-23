import { ref, shallowRef } from 'vue'
import type { ApiError } from '@/types'

/**
 * Carga + error + reintento para una vista. `notFound` separa el 404 (mensaje
 * amable) de un fallo de red (botón reintentar).
 */
export function useAsyncData<T>(loader: () => Promise<T>) {
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref('')
  const notFound = ref(false)
  let ticket = 0

  async function load() {
    const mine = ++ticket
    loading.value = true
    error.value = ''
    notFound.value = false
    try {
      const result = await loader()
      if (mine === ticket) data.value = result
    } catch (e) {
      if (mine !== ticket) return
      const err = e as ApiError
      if (err?.status === 404) notFound.value = true
      else error.value = err?.message || 'No se pudo cargar la información'
      data.value = null
    } finally {
      if (mine === ticket) loading.value = false
    }
  }

  return { data, loading, error, notFound, load }
}
