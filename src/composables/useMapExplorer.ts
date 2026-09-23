import { computed, onMounted, ref, shallowRef, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLeafletMap } from './useLeafletMap'
import { useListingFilters } from './useListingFilters'
import { mapService, type MapFilters } from '@/services/map.service'
import { useCatalogStore } from '@/stores/catalog'
import type { MapPin } from '@/types'

const MAP_KEYS = ['kind', 'type', 'sector', 'stage'] as const

// La etapa de propiedades y la de proyectos casi coinciden; solo difiere el
// "listo para entrar": a-estrenar (propiedad) equivale a por-estrenar (proyecto).
function toProjectStage(value: string) {
  return value === 'a-estrenar' ? 'por-estrenar' : value
}
function toCondition(value: string) {
  return value === 'por-estrenar' ? 'a-estrenar' : value
}

/**
 * Estado del buscador en mapa: filtros en la query string, pines del API y
 * la lista de lo que se ve en el viewport (se recalcula al mover el mapa).
 */
export function useMapExplorer(el: Ref<HTMLElement | null>) {
  const router = useRouter()
  const catalog = useCatalogStore()
  const { filters, activeCount, update, clear } = useListingFilters(MAP_KEYS, ['kind'])

  const data = shallowRef<{ properties: MapPin[]; projects: MapPin[] }>({ properties: [], projects: [] })
  const loading = ref(true)
  const error = ref(false)
  const visible = shallowRef<MapPin[]>([])

  const kind = computed(() => filters.value.kind || 'all')

  const pins = computed(() => {
    if (kind.value === 'property') return data.value.properties
    if (kind.value === 'project') return data.value.projects
    return [...data.value.properties, ...data.value.projects]
  })

  const stageOptions = computed(() =>
    kind.value === 'project' ? catalog.projectStages : catalog.conditions,
  )

  function refreshVisible() {
    visible.value = inView(pins.value)
  }

  const { ready, setPins, inView, focus } = useLeafletMap(el, {
    zoom: 13,
    scrollWheelZoom: true,
    onNavigate: (path) => router.push(path),
    onMove: refreshVisible,
  })

  async function load() {
    loading.value = true
    error.value = false
    const f = filters.value
    const query: MapFilters = { type: f.type, sector: f.sector }
    if (f.stage) {
      if (kind.value !== 'project') query.condition = toCondition(f.stage)
      if (kind.value !== 'property') query.stage = toProjectStage(f.stage)
    }
    try {
      data.value = await mapService.getPins(query)
    } catch {
      error.value = true
      data.value = { properties: [], projects: [] }
    } finally {
      loading.value = false
    }
  }

  watch(filters, load)

  watch([ready, pins], () => {
    if (!ready.value) return
    setPins(pins.value, catalog.sectorLabel, pins.value.length > 0)
    refreshVisible()
  })

  onMounted(() => {
    catalog.ensureBasics()
    load()
  })

  return {
    filters,
    activeCount,
    update,
    clear,
    kind,
    pins,
    visible,
    loading,
    error,
    load,
    focus,
    stageOptions,
  }
}
