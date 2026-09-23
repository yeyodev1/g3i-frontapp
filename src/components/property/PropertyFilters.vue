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
const isMap = computed(() => props.filters.view === 'mapa')

function field(key: PropertyFilterKey) {
  return computed({
    get: () => props.filters[key],
    set: (value: string) => emit('update', { [key]: value }),
  })
}
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
    <div class="filters__bar">
      <button type="button" class="filters__toggle" :aria-expanded="open" aria-controls="property-filters" @click="open = !open">
        <i class="fa-solid fa-sliders" aria-hidden="true"></i>
        {{ open ? f.hideFilters : f.showFilters }}
        <span v-if="activeCount" class="filters__count">{{ activeCount }}</span>
      </button>

      <button
        type="button"
        role="switch"
        class="filters__switch"
        :aria-checked="isMap"
        @click="emit('update', { view: isMap ? '' : 'mapa' })"
      >
        <span class="filters__track" aria-hidden="true"><span></span></span>
        {{ copyProperties.showMap }}
      </button>
    </div>

    <div id="property-filters" class="filters__panel" :class="{ 'filters__panel--open': open }">
      <FieldSelect v-model="sector" :label="f.sector" :options="sectors" :placeholder="f.anySector" />
      <FieldSelect v-model="condition" :label="f.condition" :options="catalog.conditions" :placeholder="f.anyCondition" />

      <fieldset class="filters__price">
        <legend>{{ copyProperties.price }}</legend>
        <div class="filters__range">
          <label>
            <span class="visually-hidden">{{ f.minPrice }}</span>
            <input v-model="minPrice" type="text" inputmode="numeric" :placeholder="copyProperties.priceFrom" @change="applyPrice" @keyup.enter="applyPrice" />
          </label>
          <span class="filters__dash" aria-hidden="true">—</span>
          <label>
            <span class="visually-hidden">{{ f.maxPrice }}</span>
            <input v-model="maxPrice" type="text" inputmode="numeric" :placeholder="copyProperties.priceTo" @change="applyPrice" @keyup.enter="applyPrice" />
          </label>
        </div>
      </fieldset>

      <FieldSelect v-model="beds" :label="f.bedrooms" :options="bedrooms" :placeholder="f.anyBedrooms" />
      <FieldSelect v-model="sort" :label="f.sort" :options="copyProperties.sortOptions" :placeholder="copyProperties.sortDefault" />

      <div class="filters__actions">
        <button v-if="activeCount" type="button" class="filters__clear" @click="emit('clear')">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i> {{ site.listing.clearFilters }}
        </button>
        <button type="button" class="btn btn--dark filters__apply" @click="open = false">{{ f.apply }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./PropertyFilters.scss"></style>
