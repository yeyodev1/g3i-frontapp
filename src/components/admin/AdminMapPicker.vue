<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import type { GeoLocation } from '@/types'

const props = defineProps<{ modelValue: GeoLocation }>()
const emit = defineEmits<{ 'update:modelValue': [value: GeoLocation] }>()

// Centro del valle (Cumbayá) cuando todavía no hay pin.
const DEFAULT_CENTER: L.LatLngTuple = [-0.2005, -78.4317]
// CARTO empezó a pedir API key: se usa OpenStreetMap estándar, igual que el sitio público.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

const el = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null
let circle: L.Circle | null = null

const icon = L.divIcon({
  className: 'admin-pin',
  html: '<span class="admin-pin__dot"><i class="fa-solid fa-location-dot"></i></span>',
  iconSize: [36, 36],
  iconAnchor: [18, 34],
})

function set(lat: number, lng: number) {
  const round = (n: number) => Math.round(n * 1e6) / 1e6
  emit('update:modelValue', { ...props.modelValue, lat: round(lat), lng: round(lng) })
}

function clear() {
  emit('update:modelValue', { ...props.modelValue, lat: null, lng: null })
}

function draw() {
  if (!map) return
  const { lat, lng, exact, radiusMeters } = props.modelValue
  if (lat === null || lng === null) {
    marker?.remove()
    circle?.remove()
    marker = null
    circle = null
    return
  }
  const point: L.LatLngTuple = [lat, lng]
  if (!marker) {
    marker = L.marker(point, { icon, draggable: true }).addTo(map)
    marker.on('dragend', () => {
      const pos = marker!.getLatLng()
      set(pos.lat, pos.lng)
    })
  } else {
    marker.setLatLng(point)
  }
  if (exact) {
    circle?.remove()
    circle = null
  } else if (!circle) {
    circle = L.circle(point, { radius: radiusMeters || 400, color: '#1a6ab5', weight: 1.5, fillOpacity: 0.12 }).addTo(map)
  } else {
    circle.setLatLng(point).setRadius(radiusMeters || 400)
  }
}

onMounted(() => {
  if (!el.value) return
  const { lat, lng } = props.modelValue
  const hasPin = lat !== null && lng !== null
  map = L.map(el.value, { scrollWheelZoom: false }).setView(hasPin ? [lat, lng] : DEFAULT_CENTER, hasPin ? 15 : 13)
  L.tileLayer(TILES, {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
  }).addTo(map)
  map.on('click', (e: L.LeafletMouseEvent) => set(e.latlng.lat, e.latlng.lng))
  draw()
  // El contenedor puede terminar de medirse después del montaje.
  setTimeout(() => map?.invalidateSize(), 200)
})

watch(() => props.modelValue, draw, { deep: true })

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div class="mappicker">
    <div ref="el" class="mappicker__map"></div>
    <div class="mappicker__bar">
      <span v-if="modelValue.lat !== null" class="mappicker__coords">
        <i class="fa-solid fa-location-dot"></i> Pin colocado
      </span>
      <span v-else class="mappicker__coords mappicker__coords--empty">Sin pin todavía</span>
      <button v-if="modelValue.lat !== null" type="button" class="mappicker__clear" @click="clear">
        <i class="fa-solid fa-xmark"></i> Quitar pin
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mappicker {
  @include flex(column, stretch, flex-start, 0.5rem);

  &__map {
    height: 300px;
    border-radius: $radius-sm;
    border: 1px solid $line;
    overflow: hidden;
    z-index: 0;
    cursor: crosshair;

    @include from('md') {
      height: 380px;
    }
  }

  &__bar {
    @include flex(row, center, space-between, 0.6rem);
    font-size: 0.85rem;
  }

  &__coords {
    color: $success;
    font-weight: 600;

    &--empty {
      color: $ink-muted;
      font-weight: 400;
    }
  }

  &__clear {
    color: $danger;
    font-weight: 600;
    font-size: 0.85rem;
    padding: 0.5rem;
  }

  :deep(.admin-pin) {
    background: none;
    border: none;
  }

  :deep(.admin-pin__dot) {
    display: block;
    font-size: 2.1rem;
    line-height: 1;
    color: $brand-orange;
    text-align: center;
    filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.35));
  }
}
</style>
