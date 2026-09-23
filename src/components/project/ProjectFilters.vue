<script setup lang="ts">
import { useCatalogStore } from '@/stores/catalog'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { copyProjects } from '@/config/copy.projects'

type Key = 'stage' | 'type' | 'sector'

defineProps<{ filters: Record<Key, string>; activeCount: number; total?: number | null }>()
const emit = defineEmits<{ update: [patch: Partial<Record<Key, string>>]; clear: [] }>()
const catalog = useCatalogStore()

function onSelect(key: Key, event: Event) {
  emit('update', { [key]: (event.target as HTMLSelectElement).value })
}
</script>

<template>
  <form class="pfilters" role="search" :aria-label="copyProjects.filtersLabel" @submit.prevent>
    <!-- Etapa: chips como en el sistema de la marca -->
    <div class="pfilters__chips" role="group" :aria-label="copy.filters.stage">
      <button
        type="button"
        class="pfilters__chip"
        :class="{ 'is-active': !filters.stage }"
        :aria-pressed="!filters.stage"
        @click="emit('update', { stage: '' })"
      >
        {{ copyProjects.allStages }}
      </button>
      <button
        v-for="s in catalog.projectStages"
        :key="s.key"
        type="button"
        class="pfilters__chip"
        :class="{ 'is-active': filters.stage === s.key }"
        :aria-pressed="filters.stage === s.key"
        @click="emit('update', { stage: s.key })"
      >
        {{ s.label }}
      </button>
    </div>

    <div class="pfilters__row">
      <label class="pfilters__field">
        <span class="pfilters__label">{{ copy.filters.type }}</span>
        <select :value="filters.type" @change="onSelect('type', $event)">
          <option value="">{{ copy.filters.anyType }}</option>
          <option v-for="t in catalog.propertyTypes" :key="t.key" :value="t.key">{{ t.label }}</option>
        </select>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </label>
      <label class="pfilters__field">
        <span class="pfilters__label">{{ copy.filters.sector }}</span>
        <select :value="filters.sector" @change="onSelect('sector', $event)">
          <option value="">{{ copy.filters.anySector }}</option>
          <option v-for="s in catalog.activeSectors" :key="s.key" :value="s.key">{{ s.label }}</option>
        </select>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </label>

      <div class="pfilters__end">
        <button v-if="activeCount" type="button" class="pfilters__clear" @click="emit('clear')">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i> {{ site.listing.clearFilters }}
        </button>
        <span v-if="total != null" class="pfilters__count" aria-live="polite">{{ copyProjects.listCount(total) }}</span>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
.pfilters {
  @include flex(column, stretch, flex-start, 1.5rem);

  &__chips {
    @include flex(row, center, flex-start, 0.5rem);
    // En móvil los chips se deslizan en una sola fila.
    overflow-x: auto;
    scrollbar-width: none;
    margin-inline: -1.25rem;
    padding-inline: 1.25rem;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      flex-wrap: wrap;
      overflow: visible;
      margin-inline: 0;
      padding-inline: 0;
    }
  }

  &__chip {
    flex-shrink: 0;
    height: 40px;
    padding: 0 1.25rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: transparent;
    color: $ink;
    @include caps(0.75rem, 0.16em);
    @include transition;

    &:hover {
      border-color: $navy-900;
    }

    &.is-active {
      background: $navy-900;
      border-color: $navy-900;
      color: $surface;
    }
  }

  &__row {
    @include flex(row, flex-end, flex-start, 1rem 2rem);
    flex-wrap: wrap;
  }

  &__field {
    position: relative;
    @include flex(column, stretch, flex-start, 0.35rem);
    flex: 1 1 150px;
    max-width: 280px;

    select {
      appearance: none;
      width: 100%;
      height: 44px;
      padding: 0 1.8rem 0 0;
      border: 0;
      border-bottom: 1px solid $gray-400;
      border-radius: 0;
      background: transparent;
      font-family: $font-principal;
      font-size: 0.95rem;
      font-weight: 300;
      color: $ink;
      cursor: pointer;
      @include transition(border-color);

      &:hover,
      &:focus-visible {
        border-color: $navy-900;
      }
    }

    i {
      position: absolute;
      right: 0.2rem;
      bottom: 0.95rem;
      font-size: 0.7rem;
      color: $ink-soft;
      pointer-events: none;
    }
  }

  &__label {
    @include caps(0.6875rem, 0.22em);
    color: $ink-soft;
  }

  &__end {
    @include flex(row, center, space-between, 1rem);
    flex: 1 1 100%;

    @include from('md') {
      flex: 1 1 auto;
      justify-content: flex-end;
      padding-bottom: 0.7rem;
    }
  }

  &__clear {
    @include flex(row, center, flex-start, 0.4rem);
    @include caps(0.6875rem, 0.18em);
    color: $ember-600;

    &:hover {
      color: $ember-700;
    }
  }

  &__count {
    margin-left: auto;
    font-size: 0.8125rem;
    color: $ink-muted;

    @include from('md') {
      margin-left: 0;
    }
  }
}
</style>
