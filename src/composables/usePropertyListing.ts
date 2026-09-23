import { computed, watch } from 'vue'
import { useListingFilters } from './useListingFilters'
import { useAsyncData } from './useAsyncData'
import { propertyService } from '@/services/property.service'
import { mapService } from '@/services/map.service'
import type { MapPin, PropertyFilters } from '@/types'

export const PROPERTY_FILTER_KEYS = [
  'type',
  'sector',
  'condition',
  'minPrice',
  'maxPrice',
  'bedrooms',
  'sort',
  'view',
] as const

export type PropertyFilterKey = (typeof PROPERTY_FILTER_KEYS)[number]

const PAGE_SIZE = 12

/**
 * Listado de propiedades: filtros en la URL, lista paginada y, en modo mapa,
 * los pines. /api/map no filtra por precio ni dormitorios: se afinan acá.
 */
export function usePropertyListing() {
  const listing = useListingFilters(PROPERTY_FILTER_KEYS, ['view'])
  const { filters, page } = listing

  const isMap = computed(() => filters.value.view === 'mapa')

  const apiFilters = computed<PropertyFilters>(() => {
    const f = filters.value
    return {
      type: f.type,
      sector: f.sector,
      condition: f.condition,
      minPrice: f.minPrice,
      maxPrice: f.maxPrice,
      bedrooms: f.bedrooms,
      sort: (f.sort || undefined) as PropertyFilters['sort'],
      page: page.value,
      limit: PAGE_SIZE,
    }
  })

  const list = useAsyncData(() => propertyService.list(apiFilters.value))
  const map = useAsyncData(() =>
    mapService
      .getPins({ type: filters.value.type, sector: filters.value.sector, condition: filters.value.condition })
      .then((r) => r.properties),
  )

  const pins = computed<MapPin[]>(() => {
    const f = filters.value
    const min = Number(f.minPrice) || 0
    const max = Number(f.maxPrice) || Infinity
    const beds = Number(f.bedrooms) || 0
    return (map.data.value ?? []).filter((p) => {
      const price = p.price ?? 0
      if (min && price < min) return false
      if (max !== Infinity && price > max) return false
      if (beds && (p.bedrooms ?? 0) < beds) return false
      return true
    })
  })

  const listKey = computed(() => JSON.stringify(apiFilters.value))
  const mapKey = computed(() => [filters.value.type, filters.value.sector, filters.value.condition].join('|'))

  watch([listKey, isMap], () => {
    if (!isMap.value) list.load()
  }, { immediate: true })

  watch([mapKey, isMap], () => {
    if (isMap.value) map.load()
  }, { immediate: true })

  return { ...listing, isMap, list, map, pins }
}
