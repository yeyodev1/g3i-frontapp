import { ref } from 'vue'

const KEY = 'g3i:favorites'

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

// Estado de módulo: todas las tarjetas y la ficha comparten la misma lista.
const ids = ref<string[]>(read())

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids.value))
  } catch {
    // Modo privado o almacenamiento bloqueado: el corazón funciona en la sesión.
  }
}

/** Favoritos por visitante, guardados en este navegador. No hay página de favoritos. */
export function useFavorites() {
  const isFavorite = (id: string) => ids.value.includes(id)

  function toggle(id: string) {
    ids.value = isFavorite(id) ? ids.value.filter((x) => x !== id) : [...ids.value, id]
    persist()
  }

  return { ids, isFavorite, toggle }
}
