<script setup lang="ts">
import MapPinCard from './MapPinCard.vue'
import type { MapPin } from '@/types'
import { copy } from '@/config/copy.public'

defineProps<{ pins: MapPin[]; loading: boolean }>()
const emit = defineEmits<{ focus: [pin: MapPin] }>()
</script>

<template>
  <section class="results" :aria-label="copy.map.title" aria-live="polite">
    <p class="results__count">
      <template v-if="loading"><i class="fa-solid fa-circle-notch fa-spin"></i> {{ copy.common.loading }}</template>
      <template v-else-if="pins.length">{{ copy.map.inView(pins.length) }}</template>
      <template v-else>{{ copy.map.noneInView }}</template>
    </p>
    <div v-if="pins.length" class="results__list">
      <MapPinCard v-for="pin in pins" :key="`${pin.kind}-${pin.id}`" :pin="pin" class="results__item" @focus="emit('focus', $event)" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.results {
  @include flex(column, stretch, flex-start, 0.6rem);
  min-height: 0;

  &__count {
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
    align-self: flex-start;

    @include until('lg') {
      background: rgba($surface, 0.95);
      padding: 0.35rem 0.75rem;
      border-radius: $radius-pill;
      box-shadow: $shadow-sm;
      margin-left: 1rem;
    }
  }

  // Móvil: tira horizontal deslizable; escritorio: lista vertical con scroll.
  &__list {
    @include flex(row, stretch, flex-start, 0.6rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding: 0 1rem 0.25rem;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('lg') {
      flex-direction: column;
      overflow-x: visible;
      overflow-y: auto;
      padding: 0 0.25rem 1rem 0;
      scrollbar-width: thin;
      flex: 1;
      min-height: 0;
    }
  }

  &__item {
    flex: 0 0 min(300px, 84vw);
    scroll-snap-align: start;
    box-shadow: $shadow-md;

    @include from('lg') {
      flex: 0 0 auto;
      box-shadow: none;
    }
  }
}
</style>
