import type { Property, PropertyCard, Unit } from '@/types'
import { copy } from '@/config/copy.public'
import { copyProperties } from '@/config/copy.properties'
import { formatM2, formatNumber } from './format'

/** Un ícono con su valor. Regla de la clienta: si el valor es 0/null no se muestra. */
export interface Spec {
  key: string
  icon: string
  label: string
  value: string
  short?: string
}

const s = copy.specs
const has = (n: number | null | undefined): n is number => typeof n === 'number' && n > 0

type CardLike = Pick<
  PropertyCard,
  'type' | 'bedrooms' | 'bathrooms' | 'parking' | 'builtM2' | 'totalM2' | 'frontMeters'
>

/**
 * Specs compactas de tarjeta: dormitorios, baños y m², como la tarjeta del
 * sistema de diseño. Terrenos: m² de terreno y metros de frente.
 */
export function cardSpecs(p: CardLike): Spec[] {
  const out: Spec[] = []
  if (p.type === 'terreno') {
    if (has(p.totalM2)) out.push({ key: 'land', icon: 'fa-solid fa-vector-square', label: s.land, value: formatM2(p.totalM2) })
    if (has(p.frontMeters))
      out.push({
        key: 'front',
        icon: 'fa-solid fa-arrows-left-right',
        label: s.front,
        value: `${formatNumber(p.frontMeters)} m`,
        short: copyProperties.frontShort,
      })
    return out
  }
  if (has(p.bedrooms)) out.push({ key: 'bed', icon: 'fa-solid fa-bed', label: s.bedrooms, value: String(p.bedrooms), short: s.bedroomsShort })
  if (has(p.bathrooms)) out.push({ key: 'bath', icon: 'fa-solid fa-bath', label: s.bathrooms, value: formatNumber(p.bathrooms), short: s.bathroomsShort })
  const area = has(p.builtM2) ? p.builtM2 : p.totalM2
  if (has(area)) out.push({ key: 'area', icon: 'fa-solid fa-ruler-combined', label: s.built, value: formatM2(area) })
  return out
}

/** Specs grandes de la ficha de una propiedad. */
export function detailSpecs(p: Property, conditionLabel: string): Spec[] {
  const out: Spec[] = []
  const push = (key: string, icon: string, label: string, value: string) => out.push({ key, icon, label, value })

  if (p.type === 'terreno') {
    if (has(p.totalM2)) push('land', 'fa-solid fa-vector-square', s.land, formatM2(p.totalM2))
    if (has(p.frontMeters)) push('front', 'fa-solid fa-arrows-left-right', s.front, `${formatNumber(p.frontMeters)} m`)
    if (has(p.depthMeters)) push('depth', 'fa-solid fa-arrows-up-down', s.depth, `${formatNumber(p.depthMeters)} m`)
    if (has(p.buildableFloors)) push('buildable', 'fa-solid fa-layer-group', s.buildableFloors, String(p.buildableFloors))
    return out
  }

  if (has(p.bedrooms)) push('bed', 'fa-solid fa-bed', s.bedrooms, String(p.bedrooms))
  if (has(p.bathrooms)) {
    const half = has(p.halfBathrooms)
      ? ` + ${p.halfBathrooms} ${p.halfBathrooms === 1 ? s.halfBath : s.halfBaths}`
      : ''
    push('bath', 'fa-solid fa-bath', s.bathrooms, `${formatNumber(p.bathrooms)}${half}`)
  }
  if (has(p.parking)) push('car', 'fa-solid fa-car', s.parking, String(p.parking))
  if (has(p.builtM2)) push('built', 'fa-solid fa-ruler-combined', s.built, formatM2(p.builtM2))
  if (has(p.totalM2)) push('land', 'fa-solid fa-vector-square', s.land, formatM2(p.totalM2))
  if (has(p.gardenM2)) push('garden', 'fa-solid fa-seedling', s.garden, formatM2(p.gardenM2))
  if (has(p.storageRooms)) push('storage', 'fa-solid fa-box-archive', s.storage, String(p.storageRooms))
  if (has(p.floors)) push('floors', 'fa-solid fa-stairs', s.floors, String(p.floors))
  if (has(p.ageYears)) {
    push('age', 'fa-regular fa-calendar', s.age, `${p.ageYears} ${p.ageYears === 1 ? s.year : s.years}`)
  } else if (conditionLabel) {
    push('condition', 'fa-regular fa-calendar-check', s.condition, conditionLabel)
  }
  return out
}

/** Specs de una unidad del inventario de un proyecto. */
export function unitSpecs(u: Unit): Spec[] {
  const out: Spec[] = []
  const push = (key: string, icon: string, label: string, value: string) => out.push({ key, icon, label, value })
  if (has(u.builtM2)) push('built', 'fa-solid fa-ruler-combined', s.built, formatM2(u.builtM2))
  if (has(u.balconyM2)) push('balcony', 'fa-solid fa-person-through-window', s.balcony, formatM2(u.balconyM2))
  if (has(u.terraceM2)) push('terrace', 'fa-solid fa-umbrella-beach', s.terrace, formatM2(u.terraceM2))
  if (has(u.gardenM2)) push('garden', 'fa-solid fa-seedling', s.garden, formatM2(u.gardenM2))
  if (has(u.bedrooms)) push('bed', 'fa-solid fa-bed', s.bedrooms, String(u.bedrooms))
  if (has(u.bathrooms)) push('bath', 'fa-solid fa-bath', s.bathrooms, formatNumber(u.bathrooms))
  if (has(u.parking)) push('car', 'fa-solid fa-car', s.parking, String(u.parking))
  if (has(u.storageRooms)) push('storage', 'fa-solid fa-box-archive', s.storage, String(u.storageRooms))
  if (u.floor) push('floor', 'fa-solid fa-building', s.floor, u.floor)
  return out
}
