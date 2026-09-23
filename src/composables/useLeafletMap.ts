import { onBeforeUnmount, onMounted, ref, shallowRef, type Ref } from 'vue'
import L from 'leaflet'
import type { MapPin } from '@/types'
import { formatPrice, formatPriceShort } from '@/utils/format'
import { escapeHtml } from '@/utils/markdown'
import { copy } from '@/config/copy.public'
// Los pines y popups son HTML de Leaflet, fuera del scope de cualquier SFC.
import '@/components/map/leaflet-pins.scss'

export const CUMBAYA: [number, number] = [-0.2, -78.43]

interface MapOptions {
  center?: [number, number]
  zoom?: number
  scrollWheelZoom?: boolean
  interactive?: boolean
  /** Links internos de los popups: se navegan con el router, sin recargar. */
  onNavigate?: (path: string) => void
  onMove?: () => void
}

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

export function pinPath(pin: MapPin): string {
  return pin.kind === 'project' ? `/proyectos/${pin.slug}` : `/propiedades/${pin.slug}`
}

// Los íconos por defecto de Leaflet se rompen con Vite: siempre divIcon propio.
function priceIcon(pin: MapPin, active = false): L.DivIcon {
  const label = pin.price ? formatPriceShort(pin.price) : pin.kind === 'project' ? 'Proyecto' : ''
  const kind = pin.kind === 'project' ? ' map-pin--project' : ''
  return L.divIcon({
    className: 'map-pin-wrap',
    html: `<span class="map-pin${kind}${active ? ' map-pin--active' : ''}">${escapeHtml(label || '•')}</span>`,
    iconSize: [0, 0],
  })
}

function popupHtml(pin: MapPin, sectorLabel: string): string {
  const price = pin.price
    ? `${pin.kind === 'project' ? `${copy.common.from} ` : ''}${formatPrice(pin.price)}`
    : ''
  const img = pin.cover ? `<img src="${escapeHtml(pin.cover)}" alt="" loading="lazy">` : ''
  const approx = pin.exact ? '' : `<small>${escapeHtml(copy.map.approx)}</small>`
  return `<a class="map-popup" href="${pinPath(pin)}" data-to="${pinPath(pin)}">${img}
    <span class="map-popup__body"><strong>${escapeHtml(pin.title)}</strong>
    <span>${escapeHtml(sectorLabel)} · Quito</span><b>${escapeHtml(price)}</b>${approx}</span></a>`
}

export function useLeafletMap(el: Ref<HTMLElement | null>, options: MapOptions = {}) {
  const map = shallowRef<L.Map | null>(null)
  const ready = ref(false)
  let layer: L.LayerGroup | null = null
  let observer: ResizeObserver | null = null

  onMounted(() => {
    if (!el.value) return
    const interactive = options.interactive ?? true
    const instance = L.map(el.value, {
      center: options.center ?? CUMBAYA,
      zoom: options.zoom ?? 13,
      scrollWheelZoom: options.scrollWheelZoom ?? false,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      zoomControl: interactive,
      attributionControl: true,
    })
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, subdomains: 'abcd', maxZoom: 19 }).addTo(instance)
    layer = L.layerGroup().addTo(instance)

    instance.on('popupopen', (e) => {
      const link = e.popup.getElement()?.querySelector<HTMLAnchorElement>('[data-to]')
      if (!link || !options.onNavigate) return
      link.addEventListener('click', (ev) => {
        if (ev.metaKey || ev.ctrlKey) return
        ev.preventDefault()
        options.onNavigate?.(link.dataset.to || '/')
      })
    })
    if (options.onMove) instance.on('moveend', options.onMove)

    // El contenedor puede cambiar de tamaño (toggle lista/mapa, drawer).
    observer = new ResizeObserver(() => instance.invalidateSize())
    observer.observe(el.value)

    map.value = instance
    ready.value = true
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    map.value?.remove()
    map.value = null
  })

  function setPins(pins: MapPin[], sectorLabel: (key: string) => string, fit = true) {
    if (!map.value || !layer) return
    layer.clearLayers()
    const points: L.LatLngExpression[] = []
    for (const pin of pins) {
      const pos: L.LatLngExpression = [pin.lat, pin.lng]
      points.push(pos)
      if (!pin.exact) {
        L.circle(pos, {
          radius: pin.radiusMeters || 400,
          color: '#1a6ab5',
          weight: 1,
          fillColor: '#1a6ab5',
          fillOpacity: 0.08,
        }).addTo(layer)
      }
      L.marker(pos, { icon: priceIcon(pin), title: pin.title, riseOnHover: true })
        .bindPopup(popupHtml(pin, sectorLabel(pin.sector)), { closeButton: false, minWidth: 220, maxWidth: 260 })
        .addTo(layer)
    }
    if (fit && points.length) {
      map.value.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 })
    }
  }

  /** Un solo inmueble: pin exacto o círculo si la ubicación es aproximada. */
  function setLocation(lat: number, lng: number, exact: boolean, radiusMeters = 400) {
    if (!map.value || !layer) return
    layer.clearLayers()
    const pos: L.LatLngExpression = [lat, lng]
    if (exact) {
      L.marker(pos, {
        icon: L.divIcon({ className: 'map-pin-wrap', html: '<span class="map-dot"></span>', iconSize: [0, 0] }),
      }).addTo(layer)
      map.value.setView(pos, 16)
    } else {
      const circle = L.circle(pos, {
        radius: radiusMeters || 400,
        color: '#1a6ab5',
        weight: 1.5,
        fillColor: '#1a6ab5',
        fillOpacity: 0.12,
      }).addTo(layer)
      map.value.fitBounds(circle.getBounds(), { padding: [20, 20] })
    }
  }

  function inView(pins: MapPin[]): MapPin[] {
    if (!map.value) return pins
    const bounds = map.value.getBounds()
    return pins.filter((p) => bounds.contains([p.lat, p.lng]))
  }

  function focus(pin: MapPin) {
    map.value?.setView([pin.lat, pin.lng], Math.max(map.value.getZoom(), 15))
  }

  return { map, ready, setPins, setLocation, inView, focus }
}
