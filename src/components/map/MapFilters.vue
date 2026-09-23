<script setup lang="ts">
import { computed, ref } from 'vue'
import FieldSelect from '@/components/forms/FieldSelect.vue'
import { useCatalogStore } from '@/stores/catalog'
import { copy } from '@/config/copy.public'
import { copyHome } from '@/config/copy.home'
import type { CatalogItem } from '@/types'

const props = defineProps<{
  filters: Record<'kind' | 'type' | 'sector' | 'stage', string>
  activeCount: number
  stageOptions: CatalogItem[]
}>()
const emit = defineEmits<{ update: [patch: Record<string, string>]; clear: [] }>()

const catalog = useCatalogStore()
const open = ref(false)
const kind = computed(() => props.filters.kind || 'all')
const sectors = computed(() => catalog.activeSectors.map((s) => ({ key: s.key, label: s.label })))

function field(key: 'type' | 'sector' | 'stage') {
  return computed({
    get: () => props.filters[key],
    set: (value: string) => emit('update', { [key]: value }),
  })
}
const type = field('type')
const sector = field('sector')
const stage = field('stage')
</script>

<template>
  <div class="mfilters" :aria-label="copyHome.mapFilters" role="group">
    <div class="mfilters__bar">
      <div class="mfilters__kinds" role="radiogroup" :aria-label="copy.map.kind">
        <button
          v-for="k in copy.map.kinds"
          :key="k.key"
          type="button"
          role="radio"
          :aria-checked="kind === k.key"
          class="mfilters__kind"
          :class="{ 'is-active': kind === k.key }"
          @click="emit('update', { kind: k.key === 'all' ? '' : k.key })"
        >
          {{ k.label }}
        </button>
      </div>
      <button type="button" class="mfilters__toggle" :aria-expanded="open" @click="open = !open">
        <i class="fa-solid fa-sliders"></i>
        <span class="visually-hidden">{{ copy.filters.showFilters }}</span>
        <span v-if="activeCount" class="mfilters__count">{{ activeCount }}</span>
      </button>
    </div>

    <div class="mfilters__panel" :class="{ 'is-open': open }">
      <FieldSelect v-model="type" :label="copy.filters.type" :options="catalog.propertyTypes" :placeholder="copy.filters.anyType" />
      <FieldSelect v-model="sector" :label="copy.filters.sector" :options="sectors" :placeholder="copy.filters.anySector" />
      <FieldSelect v-model="stage" :label="copy.filters.stage" :options="stageOptions" :placeholder="copy.filters.anyStage" />
      <button v-if="activeCount" type="button" class="mfilters__clear" @click="emit('clear')">
        <i class="fa-solid fa-xmark"></i> {{ copyHome.clear }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mfilters {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__bar {
    @include flex(row, center, space-between, 0.5rem);
  }

  &__kinds {
    @include flex(row, center, flex-start, 0.2rem);
    padding: 0.2rem;
    border-radius: $radius-pill;
    background: $sand;
    border: 1px solid $line;
  }

  &__kind {
    font-size: $text-xs;
    font-weight: 600;
    padding: 0.5rem 0.8rem;
    border-radius: $radius-pill;
    color: $ink-soft;
    @include transition;

    &.is-active {
      background: $ink;
      color: $surface;
    }
  }

  &__toggle {
    position: relative;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    border: 1px solid $line;
    background: $surface;

    @include from('lg') {
      display: none;
    }
  }

  &__count {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 1.1rem;
    height: 1.1rem;
    border-radius: $radius-pill;
    background: $brand-blue;
    color: $surface;
    font-size: 0.65rem;
    font-weight: 700;
    @include flex(row, center, center);
  }

  &__panel {
    display: none;
    flex-direction: column;
    gap: 0.6rem;

    &.is-open {
      display: flex;
    }

    @include from('lg') {
      display: flex;
    }
  }

  &__clear {
    align-self: flex-start;
    font-size: $text-sm;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
