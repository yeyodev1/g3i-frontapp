import { formatPrice } from './format'
import type { PriceRange } from '@/types'

/** Respaldo si el panel aún no guardó rangos (los del diseño aprobado). */
export const DEFAULT_PRICE_RANGES: PriceRange[] = [
  { min: null, max: 150_000 },
  { min: 150_000, max: 300_000 },
  { min: 300_000, max: null },
]

/** «Hasta $ 150.000» · «$ 150.000 – $ 300.000» · «Más de $ 300.000». */
export function priceRangeLabel({ min, max }: PriceRange): string {
  if (min && max) return `${formatPrice(min)} – ${formatPrice(max)}`
  if (max) return `Hasta ${formatPrice(max)}`
  if (min) return `Más de ${formatPrice(min)}`
  return ''
}

export const priceRangeKey = ({ min, max }: PriceRange) => `${min ?? ''}-${max ?? ''}`

/** Mismo criterio que el API (minPrice/maxPrice inclusivos). */
export function inPriceRange(price: number | null | undefined, { min, max }: PriceRange): boolean {
  if (!price) return false
  if (min && price < min) return false
  if (max && price > max) return false
  return true
}

// Redondea a un número «de vitrina»: 50.000 en adelante de 50 en 50 mil, abajo de 10 en 10 mil.
function roundNice(n: number): number {
  const step = n >= 100_000 ? 50_000 : 10_000
  return Math.max(step, Math.round(n / step) * step)
}

/**
 * Tres rangos con más o menos la misma cantidad de propiedades en cada uno,
 * cortando en los tercios de los precios publicados.
 */
export function suggestPriceRanges(prices: number[]): PriceRange[] {
  const sorted = prices.filter((p) => p > 0).sort((a, b) => a - b)
  if (sorted.length < 3) return DEFAULT_PRICE_RANGES.map((r) => ({ ...r }))
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))]!
  const a = roundNice(at(1 / 3))
  const b = Math.max(a + (a >= 100_000 ? 50_000 : 10_000), roundNice(at(2 / 3)))
  return [
    { min: null, max: a },
    { min: a, max: b },
    { min: b, max: null },
  ]
}
