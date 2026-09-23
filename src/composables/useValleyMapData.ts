import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mapService, type MapFilters } from '@/services/map.service'
import { useCatalogStore } from '@/stores/catalog'
import { SECTORS_GEO, zoneOf } from '@/config/sectorsGeo'
import { copyPages } from '@/config/copy.pages'
import type { MapPin } from '@/types'

export interface ValleyZone {
  key: string
  name: string
  color: string
  count: number
}

type Kind = 'all' | 'property' | 'project'
const ZONE_KEYS = new Set(SECTORS_GEO.features.map((f) => f.properties.key))
const FILTER_KEYS = ['ver', 'tipo', 'etapa', 'precio'] as const

/**
 * Datos del mapa del valle. La etapa se filtra en el API (los pines no la traen); tipo,
 * precio y propiedades/proyectos se filtran en el cliente; todo se agrupa por zona
 * parroquial. Los filtros viven en la query (?zona=tumbaco&tipo=casa) para compartir el enlace.
 */
export function useValleyMapData() {
  const route = useRoute()
  const router = useRouter()
  const catalog = useCatalogStore()

  const data = shallowRef<{ properties: MapPin[]; projects: MapPin[] }>({ properties: [], projects: [] })
  const loading = ref(true)
  const error = ref(false)

  const q = (key: string) => (typeof route.query[key] === 'string' ? (route.query[key] as string) : '')
  const kind = computed<Kind>(() => {
    const v = q('ver')
    return v === 'property' || v === 'project' ? v : 'all'
  })
  const type = computed(() => q('tipo'))
  const stage = computed(() => q('etapa'))
  const price = computed(() => q('precio'))
  const active = computed(() => (ZONE_KEYS.has(q('zona')) ? q('zona') : ''))
  const activeFilters = computed(() => FILTER_KEYS.filter((k) => q(k)).length)

  function setQuery(patch: Record<string, string>) {
    const query = { ...route.query, ...patch }
    for (const k of Object.keys(query)) if (!query[k]) delete query[k]
    router.replace({ query })
  }

  // Etapas: la lista de propiedades salvo en «Proyectos»; «a estrenar» ≈ «por estrenar».
  const stageOptions = computed(() => (kind.value === 'project' ? catalog.projectStages : catalog.conditions))

  const byKind = computed(() => {
    const { properties, projects } = data.value
    if (kind.value === 'property') return properties
    if (kind.value === 'project') return projects
    return [...properties, ...projects]
  })

  const pins = computed(() => {
    const range = copyPages.valley.priceRanges.find((r) => r.key === price.value)
    return byKind.value.filter((p) => {
      if (type.value && p.type !== type.value) return false
      if (range && (!p.price || p.price < range.min || p.price >= range.max)) return false
      return true
    })
  })

  const zones = computed<ValleyZone[]>(() => {
    const counts: Record<string, number> = {}
    for (const p of pins.value) counts[zoneOf(p.sector)] = (counts[zoneOf(p.sector)] || 0) + 1
    return SECTORS_GEO.features.map(({ properties: z }) => ({
      key: z.key,
      name: z.name,
      color: z.color,
      count: counts[z.key] || 0,
    }))
  })

  const list = computed(() =>
    active.value ? pins.value.filter((p) => zoneOf(p.sector) === active.value) : pins.value,
  )

  // Solo los tipos que existen en el inventario de la vista actual.
  const typeOptions = computed(() => {
    const present = new Set(byKind.value.map((p) => p.type))
    return catalog.propertyTypes.filter((t) => present.has(t.key))
  })

  const zoneName = (key: string) => SECTORS_GEO.features.find((f) => f.properties.key === key)?.properties.name ?? ''

  async function load() {
    loading.value = true
    error.value = false
    const query: MapFilters = {}
    if (stage.value) {
      query.condition = stage.value === 'por-estrenar' ? 'a-estrenar' : stage.value
      query.stage = stage.value === 'a-estrenar' ? 'por-estrenar' : stage.value
    }
    try {
      data.value = await mapService.getPins(query)
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }

  watch(stage, load)
  onMounted(() => {
    catalog.ensureCatalogs()
    load()
  })

  return {
    loading,
    error,
    load,
    kind,
    type,
    stage,
    price,
    active,
    activeFilters,
    pins,
    zones,
    list,
    typeOptions,
    stageOptions,
    zoneName,
    setFilter: (key: string, value: string) =>
      setQuery(key === 'ver' ? { ver: value === 'all' ? '' : value, tipo: '', etapa: '' } : { [key]: value }),
    setActive: (key: string) => setQuery({ zona: key === active.value ? '' : key }),
    selectZone: (key: string) => setQuery({ zona: key }),
    clear: () => setQuery({ ver: '', tipo: '', etapa: '', precio: '', zona: '' }),
  }
}
