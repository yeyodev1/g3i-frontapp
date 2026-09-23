const money = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatMoney(value: number): string {
  return money.format(value)
}

// Los precios de inmuebles van en dólares enteros: "$255.874".
const price = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return ''
  return price.format(value)
}

/** Versión corta para los pines del mapa: "$255K", "$1,2M". */
export function formatPriceShort(value: number | null | undefined): string {
  if (!value) return ''
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toLocaleString('es-EC', { maximumFractionDigits: 1 })}M`
  }
  if (value >= 1000) return `$${Math.round(value / 1000)}K`
  return formatPrice(value)
}

const area = new Intl.NumberFormat('es-EC', { maximumFractionDigits: 2 })

export function formatNumber(value: number): string {
  return area.format(value)
}

export function formatM2(value: number | null | undefined): string {
  if (!value) return ''
  return `${area.format(value)} m²`
}

const date = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatDate(value: string | Date): string {
  return date.format(typeof value === 'string' ? new Date(value) : value)
}

/** Algunos títulos migrados vienen en mayúsculas: se pasan a oración. */
export function sentenceCase(text: string): string {
  if (!text) return ''
  const letters = text.replace(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü]/g, '')
  const upper = letters.replace(/[^A-ZÁÉÍÓÚÑÜ]/g, '')
  if (!letters.length || upper.length / letters.length < 0.7) return text
  const lower = text.toLocaleLowerCase('es-EC')
  return lower.charAt(0).toLocaleUpperCase('es-EC') + lower.slice(1)
}
