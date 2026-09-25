import { computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import {
  DEFAULT_PRICE_RANGES,
  inPriceRange,
  priceRangeKey,
  priceRangeLabel,
} from '@/utils/priceRanges'

/**
 * Rangos del filtro de precio: los define la inmobiliaria en Ajustes del sitio.
 * `options` deja fuera los rangos sin propiedades publicadas (como los sectores);
 * `all` los trae todos, para el mapa, que también muestra proyectos.
 */
export function usePriceRanges() {
  const catalog = useCatalogStore()

  const all = computed(() => {
    const saved = catalog.site?.settings.priceRanges
    const ranges = saved?.length ? saved : DEFAULT_PRICE_RANGES
    const prices = catalog.site?.counts.prices
    return ranges.map((r) => ({
      ...r,
      key: priceRangeKey(r),
      label: priceRangeLabel(r),
      count: prices ? prices.filter((p) => inPriceRange(p, r)).length : null,
    }))
  })

  const options = computed(() => all.value.filter((r) => r.count !== 0))
  const find = (key: string) => all.value.find((r) => r.key === key)

  return { all, options, find }
}
