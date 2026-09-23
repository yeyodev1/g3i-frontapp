<script setup lang="ts">
import type { ValleyZone } from '@/composables/useValleyMapData'
import { copyPages } from '@/config/copy.pages'

defineProps<{ zones: ValleyZone[]; active: string; kind: string }>()
defineEmits<{ pick: [key: string] }>()
</script>

<template>
  <nav class="zones" :aria-label="copyPages.valley.zonesLabel">
    <button
      v-for="zone in zones"
      :key="zone.key"
      type="button"
      class="zones__item"
      :class="{ 'is-active': active === zone.key }"
      :aria-pressed="active === zone.key"
      @click="$emit('pick', zone.key)"
    >
      <span class="zones__swatch" :style="{ background: zone.color }" aria-hidden="true"></span>
      <span class="zones__name">{{ zone.name }}</span>
      <span class="zones__count" :class="{ 'is-soon': !zone.count }">
        {{ zone.count ? copyPages.valley.count(zone.count, kind) : copyPages.valley.soon }}
      </span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
// Móvil: chips en scroll horizontal. Escritorio: lista con líneas finas, como el ejemplo.
.zones {
  @include flex(row, stretch, flex-start, 0.5rem);
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
  scroll-snap-type: x proximity;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('lg') {
    flex-direction: column;
    gap: 0;
    overflow: visible;
  }

  &__item {
    flex: 0 0 auto;
    scroll-snap-align: start;
    @include flex(row, center, flex-start, 0.6rem);
    padding: 0.55rem 0.9rem;
    border: 1px solid $line;
    background: $surface;
    color: $ink;
    text-align: left;
    @include transition(background);
    @include focus-ring;

    @include from('lg') {
      gap: 14px;
      padding: 11px 16px;
      border: 0;
      border-bottom: 1px solid $line;
    }

    &:hover {
      background: $gray-50;
    }

    &.is-active {
      background: $gray-100;
      border-color: $navy-900;

      @include from('lg') {
        border-color: $line;
        box-shadow: inset 2px 0 0 $ember-500;
      }
    }
  }

  &__swatch {
    flex: none;
    width: 12px;
    height: 12px;
  }

  &__name {
    font: 400 1.2rem/1.1 $font-display;
    white-space: nowrap;

    @include from('lg') {
      flex: 1;
      font-size: 21px;
    }
  }

  &__count {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: $ink-soft;
    white-space: nowrap;

    &.is-soon {
      color: $ink-muted;
    }
  }
}
</style>
