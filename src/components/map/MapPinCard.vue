<script setup lang="ts">
import { computed } from 'vue'
import type { MapPin } from '@/types'
import { pinPath } from '@/composables/useLeafletMap'
import { useCatalogStore } from '@/stores/catalog'
import { formatM2, formatPrice, sentenceCase } from '@/utils/format'
import { copy } from '@/config/copy.public'

const props = defineProps<{ pin: MapPin }>()
const emit = defineEmits<{ focus: [pin: MapPin] }>()
const catalog = useCatalogStore()

const title = computed(() => sentenceCase(props.pin.title))
const price = computed(() => {
  if (!props.pin.price) return copy.common.priceOnRequest
  const from = props.pin.kind === 'project' ? `${copy.common.from} ` : ''
  return `${from}${formatPrice(props.pin.price)}`
})
const meta = computed(() => {
  const parts: string[] = [catalog.typeLabel(props.pin.type)]
  if (props.pin.bedrooms) parts.push(`${props.pin.bedrooms} ${copy.specs.bedroomsShort}`)
  const area = props.pin.builtM2 || props.pin.totalM2
  if (area) parts.push(formatM2(area))
  return parts.join(' · ')
})
</script>

<template>
  <article class="mcard" @mouseenter="emit('focus', pin)">
    <RouterLink :to="pinPath(pin)" class="mcard__media" :aria-label="title">
      <img v-if="pin.cover" :src="pin.cover" alt="" loading="lazy" />
      <i v-else class="fa-regular fa-image"></i>
    </RouterLink>
    <div class="mcard__body">
      <p class="mcard__price">{{ price }}</p>
      <RouterLink :to="pinPath(pin)" class="mcard__title">{{ title }}</RouterLink>
      <p class="mcard__meta">{{ meta }}</p>
      <p class="mcard__place">
        {{ catalog.sectorLabel(pin.sector) }} · {{ copy.common.city }}
        <span v-if="!pin.exact" class="mcard__approx">· {{ copy.map.approx }}</span>
      </p>
    </div>
    <button type="button" class="mcard__locate" :aria-label="`Ubicar ${title} en el mapa`" @click="emit('focus', pin)">
      <i class="fa-solid fa-location-crosshairs"></i>
    </button>
  </article>
</template>

<style scoped lang="scss">
.mcard {
  position: relative;
  @include card;
  @include flex(row, stretch, flex-start);
  overflow: hidden;
  min-height: 104px;

  &__media {
    flex: 0 0 104px;
    @include flex(row, center, center);
    background: $sand;
    color: $ink-muted;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    padding: 0.65rem 2.4rem 0.65rem 0.8rem;
    @include flex(column, flex-start, center, 0.1rem);
  }

  &__price {
    font-family: $font-display;
    font-weight: 700;
    font-size: $text-base;
  }

  &__title {
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.3;
    color: $ink;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta,
  &__place {
    font-size: $text-xs;
    color: $ink-muted;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  &__approx {
    color: $brand-blue;
  }

  &__locate {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    color: $ink-muted;
    @include transition(color);

    &:hover {
      color: $brand-blue;
    }
  }
}
</style>
