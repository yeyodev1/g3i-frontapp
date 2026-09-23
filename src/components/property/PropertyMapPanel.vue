<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { MapPin } from '@/types'
import { useLeafletMap } from '@/composables/useLeafletMap'
import { useCatalogStore } from '@/stores/catalog'
import { copyProperties } from '@/config/copy.properties'

const props = defineProps<{ pins: MapPin[]; loading?: boolean }>()

const router = useRouter()
const catalog = useCatalogStore()
const el = ref<HTMLElement | null>(null)
const { ready, setPins } = useLeafletMap(el, {
  scrollWheelZoom: true,
  onNavigate: (path) => router.push(path),
})

watch(
  [ready, () => props.pins],
  () => {
    if (ready.value) setPins(props.pins, catalog.sectorLabel)
  },
  { immediate: true },
)
</script>

<template>
  <div class="map-panel">
    <div ref="el" class="map-panel__canvas"></div>
    <p v-if="!loading" class="map-panel__count">
      {{ pins.length ? copyProperties.mapCount(pins.length) : copyProperties.mapEmpty }}
    </p>
    <div v-if="loading" class="map-panel__loading"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
  </div>
</template>

<style scoped lang="scss">
.map-panel {
  position: relative;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $line;

  &__canvas {
    height: 68vh;
    min-height: 380px;
    z-index: 0;
  }

  &__count {
    position: absolute;
    top: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 400;
    background: rgba($surface, 0.95);
    border: 1px solid $line;
    border-radius: $radius-pill;
    padding: 0.35rem 0.9rem;
    font-size: $text-xs;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: $shadow-sm;
  }

  &__loading {
    position: absolute;
    inset: 0;
    z-index: 450;
    @include flex(row, center, center);
    background: rgba($surface, 0.6);
    font-size: 1.4rem;
    color: $ink-soft;
  }
}
</style>
