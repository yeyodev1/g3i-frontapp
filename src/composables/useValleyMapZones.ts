import L from 'leaflet'
import { SECTORS_GEO, type SectorFeature } from '@/config/sectorsGeo'

/** Estilo de las zonas: suave en reposo, marcado cuando la zona está activa. */
export function zoneStyle(feature: SectorFeature, active = false): L.PathOptions {
  const color = feature.properties.color
  return {
    color,
    weight: active ? 2.5 : 1.5,
    opacity: 0.9,
    fillColor: color,
    fillOpacity: active ? 0.28 : 0.12,
    dashArray: feature.properties.point ? '4 4' : undefined,
  }
}

export function zoneFeature(key: string): SectorFeature | undefined {
  return SECTORS_GEO.features.find((f) => f.properties.key === key)
}

/** Capa Leaflet de una zona: polígono parroquial o círculo punteado (Lumbisí). */
export type ZoneLayer = L.Circle | L.GeoJSON

export function zoneLayer(feature: SectorFeature, style: L.PathOptions): ZoneLayer {
  const g = feature.geometry
  if (g.type === 'Point') {
    return L.circle([g.coordinates[1], g.coordinates[0]], {
      radius: feature.properties.radiusMeters ?? 700,
      ...style,
    })
  }
  return L.geoJSON(g as GeoJSON.Geometry, { style: () => style })
}

type Ring = [number, number][]

function rings(feature: SectorFeature): Ring[] {
  const g = feature.geometry
  if (g.type === 'Polygon') return g.coordinates.slice(0, 1)
  if (g.type === 'MultiPolygon') return g.coordinates.map((p) => p[0]!)
  return []
}

function inRing(lng: number, lat: number, ring: Ring): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!
    const [xj, yj] = ring[j]!
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** Zona parroquial que contiene el punto (los círculos puntuales no cuentan). */
export function zoneAt(lat: number, lng: number): SectorFeature | undefined {
  return SECTORS_GEO.features.find((f) => rings(f).some((r) => inRing(lng, lat, r)))
}

/**
 * Punto para la etiqueta: el centroide del anillo si cae dentro; si no (formas en C),
 * el punto medio entre el centroide y un vértice del borde opuesto.
 */
export function zoneLabelPoint(feature: SectorFeature): [number, number] {
  const g = feature.geometry
  if (g.type === 'Point') return [g.coordinates[1], g.coordinates[0]]
  const ring = rings(feature)[0] ?? []
  let a = 0
  let cx = 0
  let cy = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!
    const [xj, yj] = ring[j]!
    const f = xj * yi - xi * yj
    a += f
    cx += (xj + xi) * f
    cy += (yj + yi) * f
  }
  const lng = cx / (3 * a)
  const lat = cy / (3 * a)
  if (inRing(lng, lat, ring)) return [lat, lng]
  const mid = ring[Math.floor(ring.length / 2)] ?? [lng, lat]
  return [(lat + mid[1]) / 2, (lng + mid[0]) / 2]
}
