<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FieldSelect from '@/components/forms/FieldSelect.vue'
import { useCatalogStore } from '@/stores/catalog'
import { copy } from '@/config/copy.public'
import { site } from '@/config/site'
import { copyProperties } from '@/config/copy.properties'
import type { PropertyFilterKey } from '@/composables/usePropertyListing'

const props = defineProps<{ filters: Record<PropertyFilterKey, string>; activeCount: number }>()
const emit = defineEmits<{ update: [patch: Partial<Record<PropertyFilterKey, string>>]; clear: [] }>()

const catalog = useCatalogStore()
const open = ref(false)
const f = copy.filters

// Sectores: solo los que tienen algo publicado (acordado con la clienta).
const sectors = computed(() => catalog.activeSectors.map((s) => ({ key: s.key, label: s.label })))
const bedrooms = [1, 2, 3, 4, 5].map((n) => ({ key: String(n), label: f.bedroomsOption(n) }))

function field(key: PropertyFilterKey) {
  return computed({
    get: () => props.filters[key],
    set: (value: string) => emit('update', { [key]: value }),
  })
}
const type = field('type')
const sector = field('sector')
const condition = field('condition')
const beds = field('bedrooms')
const sort = field('sort')

// Los precios se aplican al salir del campo o con Enter, no en cada tecla.
const minPrice = ref(props.filters.minPrice)
const maxPrice = ref(props.filters.maxPrice)
watch(
  () => [props.filters.minPrice, props.filters.maxPrice],
  ([min, max]) => {
    minPrice.value = min ?? ''
    maxPrice.value = max ?? ''
  },
)
function applyPrice() {
  const clean = (v: string) => String(v ?? '').replace(/\D/g, '')
  emit('update', { minPrice: clean(minPrice.value), maxPrice: clean(maxPrice.value) })
}
</script>

<template>
  <div class="filters">
    <button type="button" class="filters__toggle" :aria-expanded="open" aria-controls="property-filters" @click="open = !open">
      <i class="fa-solid fa-sliders"></i>
      {{ open ? f.hideFilters : f.showFilters }}
      <span v-if="activeCount" class="filters__count">{{ activeCount }}</span>
    </button>

    <div id="property-filters" class="filters__panel" :class="{ 'filters__panel--open': open }">
      <FieldSelect v-model="type" :label="f.type" :options="catalog.propertyTypes" :placeholder="f.anyType" />
      <FieldSelect v-model="sector" :label="f.sector" :options="sectors" :placeholder="f.anySector" />
      <FieldSelect v-model="condition" :label="f.condition" :options="catalog.conditions" :placeholder="f.anyCondition" />
      <div class="filters__price">
        <div class="filters__field">
          <label for="pf-min">{{ f.minPrice }}</label>
          <input id="pf-min" v-model="minPrice" type="text" inputmode="numeric" :placeholder="copyProperties.pricePlaceholder" @change="applyPrice" @keyup.enter="applyPrice" />
        </div>
        <div class="filters__field">
          <label for="pf-max">{{ f.maxPrice }}</label>
          <input id="pf-max" v-model="maxPrice" type="text" inputmode="numeric" :placeholder="copyProperties.pricePlaceholder" @change="applyPrice" @keyup.enter="applyPrice" />
        </div>
      </div>
      <FieldSelect v-model="beds" :label="f.bedrooms" :options="bedrooms" :placeholder="f.anyBedrooms" />
      <FieldSelect v-model="sort" :label="f.sort" :options="f.sortOptions" />
      <div class="filters__actions">
        <button v-if="activeCount" type="button" class="filters__clear" @click="emit('clear')">
          <i class="fa-solid fa-xmark"></i> {{ site.listing.clearFilters }}
        </button>
        <button type="button" class="btn btn--primary filters__apply" @click="open = false">{{ f.apply }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filters {
  &__toggle {
    @include flex(row, center, center, 0.55rem);
    width: 100%;
    height: 2.9rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    background: $surface;

    i {
      color: $brand-blue;
    }

    @include from('lg') {
      display: none;
    }
  }

  &__count {
    @include flex(row, center, center);
    min-width: 1.3rem;
    height: 1.3rem;
    padding-inline: 0.3rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $surface;
    font-size: 0.7rem;
  }

  &__panel {
    display: none;
    margin-top: 0.9rem;
    padding: 1.1rem;
    @include card;
    flex-direction: column;
    gap: 0.9rem;

    &--open {
      display: flex;
    }

    @include from('lg') {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-end;
      margin-top: 0;
      padding: 1rem 1.1rem;

      > * {
        flex: 1 1 150px;
      }
    }
  }

  &__price {
    @include flex(row, flex-end, flex-start, 0.6rem);

    @include from('lg') {
      flex: 2 1 260px;
    }
  }

  &__field {
    flex: 1 1 0;
    min-width: 0;
  }

  &__actions {
    @include flex(row, center, space-between, 0.8rem);

    @include from('lg') {
      flex: 0 0 auto;
      min-height: 2.9rem;
    }
  }

  &__clear {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      color: $ink;
    }
  }

  &__apply {
    margin-left: auto;

    @include from('lg') {
      display: none;
    }
  }
}
</style>
