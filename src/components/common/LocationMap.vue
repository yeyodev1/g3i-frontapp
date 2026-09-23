<script setup lang="ts">
import { ref, watch } from 'vue'
import type { GeoLocation } from '@/types'
import { useLeafletMap } from '@/composables/useLeafletMap'
import { site } from '@/config/site'

const props = defineProps<{ location: GeoLocation; label?: string }>()

const el = ref<HTMLElement | null>(null)
const { ready, setLocation } = useLeafletMap(el, { zoom: 15 })

watch(
  [ready, () => props.location],
  () => {
    const { lat, lng, exact, radiusMeters } = props.location
    if (ready.value && lat !== null && lng !== null) setLocation(lat, lng, exact, radiusMeters)
  },
  { immediate: true },
)
</script>

<template>
  <div class="location">
    <div ref="el" class="location__map" role="img" :aria-label="label || site.detail.locationTitle"></div>
    <p class="location__note">
      <i class="fa-solid fa-location-dot"></i>
      <span>{{ label }}</span>
      <span v-if="!location.exact" class="location__approx">· {{ site.detail.approxLocation }}</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.location {
  &__map {
    height: 300px;
    border-radius: $radius-md;
    overflow: hidden;
    border: 1px solid $line;
    z-index: 0;

    @include from('md') {
      height: 380px;
    }
  }

  &__note {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
    margin-top: 0.7rem;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $brand-orange;
    }
  }

  &__approx {
    color: $brand-blue;
  }
}
</style>
