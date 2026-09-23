import { onBeforeUnmount, onMounted, ref, shallowRef, type Ref } from 'vue'
import L from 'leaflet'
import { SECTORS_GEO, zoneOf } from '@/config/sectorsGeo'
import { zoneLabelPoint, zoneLayer, zoneStyle, type ZoneLayer } from './useValleyMapZones'
import { groupPins, pinPopup, clusterPopup, domEl } from './useValleyMapPins'
import { BASE_LAYERS, type BaseLayerKey } from './useLeafletMap'
import { formatPriceShort } from '@/utils/format'
import { copyPages } from '@/config/copy.pages'
import type { MapPin } from '@/types'

interface ValleyMapOptions {
  onZoneClick: (key: string) => void
  onNavigate: (path: string) => void
  onSelect?: (id: string | null) => void
  typeLabel?: (key: string) => string
}

// Zonas donde G3i tiene inventario: el encuadre inicial, sin las parroquias grandes del este.
const CORE_ZONES = ['cumbaya', 'tumbaco', 'puembo', 'nayon', 'lumbisi']
const MAX_ZOOM = 18

/**
 * Mapa Leaflet del valle: parroquias con su color y nombre, pines de precio agrupados
 * cuando se enciman, popup con foto y capa Mapa/Satélite. El HTML de Leaflet se arma con
 * nodos DOM (textContent), sin innerHTML.
 */
export function useValleyMap(target: Ref<HTMLElement | null>, options: ValleyMapOptions) {
  const map = shallowRef<L.Map | null>(null)
  const ready = ref(false)
  const base = ref<BaseLayerKey>('map')
  const zones = new Map<string, ZoneLayer>()
  const markers = new Map<string, L.Marker>()
  const tiles = {} as Record<BaseLayerKey, L.TileLayer>
  let pins: MapPin[] = []
  let zoneName: (key: string) => string = () => ''
  let pinLayer: L.LayerGroup | null = null
  let activeKey = ''
  let selected: string | null = null
  let observer: ResizeObserver | null = null

  function coreBounds() {
    const b = L.latLngBounds([])
    for (const k of CORE_ZONES) {
      const layer = zones.get(k)
      if (layer) b.extend(layer.getBounds())
    }
    return b
  }

  onMounted(() => {
    if (!target.value) return
    // Con vista inicial: los círculos (Lumbisí) necesitan un mapa proyectado para sus límites.
    const instance = L.map(target.value, { scrollWheelZoom: false, zoomControl: false, center: [-0.2, -78.41], zoom: 12 })
    L.control.zoom({ position: 'bottomright' }).addTo(instance)
    for (const [key, def] of Object.entries(BASE_LAYERS) as [BaseLayerKey, (typeof BASE_LAYERS)[BaseLayerKey]][]) {
      tiles[key] = L.tileLayer(def.url, { attribution: def.attribution, maxZoom: MAX_ZOOM })
    }
    tiles.map.addTo(instance)
    instance.createPane('labels')
    const pane = instance.getPane('labels')!
    // Bajo los pines (markerPane = 600) para que los nombres no tapen precios ni grupos.
    pane.style.zIndex = '450'
    pane.style.pointerEvents = 'none'

    for (const feature of SECTORS_GEO.features) {
      const key = feature.properties.key
      const layer = zoneLayer(feature, zoneStyle(feature))
      layer.on('mouseover', () => layer.setStyle(zoneStyle(feature, true)))
      layer.on('mouseout', () => layer.setStyle(zoneStyle(feature, activeKey === key)))
      layer.on('click', () => options.onZoneClick(key))
      layer.addTo(instance)
      zones.set(key, layer)

      const label = domEl('span', `valley-label${feature.properties.point ? ' valley-label--point' : ''}`, feature.properties.name)
      L.marker(zoneLabelPoint(feature), {
        pane: 'labels',
        interactive: false,
        keyboard: false,
        icon: L.divIcon({ className: 'valley-label-wrap', html: label, iconSize: [0, 0] }),
      }).addTo(instance)
    }

    pinLayer = L.layerGroup().addTo(instance)
    instance.on('zoomend', render)
    instance.fitBounds(coreBounds(), { padding: [30, 30], animate: false })

    // Si el contenedor cambia de tamaño (transición de página, barra del navegador móvil)
    // se vuelve a encuadrar la zona, salvo que la persona ya haya movido el mapa.
    let touched = false
    target.value.addEventListener('pointerdown', () => (touched = true), { once: true })
    observer = new ResizeObserver(() => {
      instance.invalidateSize()
      if (!touched) setActive(activeKey, false)
    })
    observer.observe(target.value)
    map.value = instance
    ready.value = true
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    map.value?.remove()
    map.value = null
  })

  function markPin(id: string | null) {
    markers.forEach((m, key) => m.getElement()?.querySelector('.valley-pin')?.classList.toggle('is-on', key === id))
  }

  function onPopup(id: string | null) {
    selected = id
    markPin(id)
    options.onSelect?.(id)
  }

  const popupFor = (pin: MapPin) =>
    pinPopup(pin, zoneName(zoneOf(pin.sector)), options.typeLabel?.(pin.type) ?? '', options.onNavigate)
  // Margen arriba a la izquierda para no quedar bajo el control Mapa / Satélite.
  const popupOptions: L.PopupOptions = {
    offset: [0, -14],
    minWidth: 260,
    maxWidth: 260,
    autoPanPaddingTopLeft: [20, 70],
    autoPanPaddingBottomRight: [20, 20],
  }

  function openPin(pin: MapPin) {
    if (!map.value) return
    const marker = markers.get(pin.id)
    if (marker) return marker.openPopup()
    // Sigue agrupado (misma coordenada): popup suelto sobre el punto.
    const popup = L.popup(popupOptions).setLatLng([pin.lat, pin.lng]).setContent(popupFor(pin)).openOn(map.value)
    onPopup(pin.id)
    popup.once('remove', () => selected === pin.id && onPopup(null))
  }

  /** Agrupa los pines que se enciman a este zoom y los dibuja. */
  function render() {
    const instance = map.value
    if (!instance || !pinLayer) return
    pinLayer.clearLayers()
    markers.clear()
    for (const group of groupPins(pins, (p) => instance.latLngToLayerPoint([p.lat, p.lng]))) {
      if (group.length === 1) {
        const pin = group[0]!
        const html = domEl('span', `valley-pin${pin.kind === 'project' ? ' valley-pin--project' : ''}${pin.id === selected ? ' is-on' : ''}`)
        html.textContent = formatPriceShort(pin.price) || copyPages.valley.projectTag
        const marker = L.marker([pin.lat, pin.lng], {
          icon: L.divIcon({ className: 'valley-pin-wrap', html, iconSize: [0, 0] }),
          title: pin.title,
          riseOnHover: true,
        })
        marker.bindPopup(() => popupFor(pin), popupOptions)
        marker.on('popupopen', () => onPopup(pin.id))
        marker.on('popupclose', () => selected === pin.id && onPopup(null))
        marker.addTo(pinLayer)
        markers.set(pin.id, marker)
        continue
      }
      const bounds = L.latLngBounds(group.map((p) => [p.lat, p.lng] as [number, number]))
      const html = domEl('span', 'valley-cluster', String(group.length))
      const marker = L.marker(bounds.getCenter(), {
        icon: L.divIcon({ className: 'valley-pin-wrap', html, iconSize: [0, 0] }),
        title: copyPages.valley.cluster(group.length),
        riseOnHover: true,
      })
      marker.on('click', () => {
        const zoom = instance.getZoom()
        const same = bounds.getNorthEast().equals(bounds.getSouthWest(), 1e-5)
        if (same || zoom >= MAX_ZOOM - 1) {
          L.popup(popupOptions)
            .setLatLng(bounds.getCenter())
            .setContent(clusterPopup(group, (pin) => openPin(pin)))
            .openOn(instance)
        } else {
          instance.flyToBounds(bounds, { padding: [70, 70], maxZoom: MAX_ZOOM - 1, duration: 0.6 })
        }
      })
      marker.addTo(pinLayer)
    }
  }

  function setPins(next: MapPin[], names: (key: string) => string) {
    pins = next
    zoneName = names
    render()
  }

  function setActive(key: string, animate = true) {
    if (!map.value) return
    activeKey = key
    for (const feature of SECTORS_GEO.features) {
      zones.get(feature.properties.key)?.setStyle(zoneStyle(feature, feature.properties.key === key))
    }
    const bounds = key ? zones.get(key)?.getBounds() : coreBounds()
    if (!bounds?.isValid()) return
    if (animate) map.value.flyToBounds(bounds, { padding: [40, 40], duration: 0.8 })
    else map.value.fitBounds(bounds, { padding: [40, 40], animate: false })
  }

  function select(id: string) {
    const instance = map.value
    const pin = pins.find((p) => p.id === id)
    if (!instance || !pin) return
    instance.flyTo([pin.lat, pin.lng], Math.max(instance.getZoom(), 16), { duration: 0.7 })
    instance.once('moveend', () => openPin(pin))
  }

  function setBase(key: BaseLayerKey) {
    if (!map.value || key === base.value) return
    tiles[base.value].remove()
    tiles[key].addTo(map.value)
    base.value = key
    target.value?.classList.toggle('is-sat', key === 'sat')
  }

  return { map, ready, base, setPins, setActive, select, setBase }
}
