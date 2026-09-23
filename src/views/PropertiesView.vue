<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PageHero from '@/components/common/PageHero.vue'
import SkeletonCards from '@/components/common/SkeletonCards.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import PaginationNav from '@/components/common/PaginationNav.vue'
import PropertyCard from '@/components/property/PropertyCard.vue'
import PropertyFilters from '@/components/property/PropertyFilters.vue'
import PropertyTypeChips from '@/components/property/PropertyTypeChips.vue'
import PropertyMapPanel from '@/components/property/PropertyMapPanel.vue'
import { usePropertyListing } from '@/composables/usePropertyListing'
import { useSeo } from '@/composables/useSeo'
import { useCatalogStore } from '@/stores/catalog'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { copyProperties } from '@/config/copy.properties'

const catalog = useCatalogStore()
const { filters, page, activeCount, update, setPage, clear, isMap, list, map, pins } = usePropertyListing()

onMounted(() => catalog.ensureBasics())

const result = computed(() => list.data.value)
const total = computed(() => (isMap.value ? pins.value.length : (result.value?.total ?? 0)))

// "Casa en venta en Cumbayá" cuando hay filtros; si no, el título general.
const seoTitle = computed(() => {
  const { type, sector } = filters.value
  if (!type && !sector) return site.listing.propertiesTitle
  const what = type ? `${catalog.typeLabel(type)} ${copyProperties.inSale}` : site.listing.propertiesTitle
  return sector ? `${what} ${copyProperties.in} ${catalog.sectorLabel(sector)}` : what
})
useSeo(() => ({ title: seoTitle.value, description: `${site.listing.propertiesText} ${site.tagline}.` }))

// Sin filtros la portada dice «Todas las propiedades», como el sistema de diseño.
const heroTitle = computed(() => (filters.value.type || filters.value.sector ? seoTitle.value : copyProperties.heroTitle))
const type = computed({
  get: () => filters.value.type,
  set: (value: string) => update({ type: value }),
})
</script>

<template>
  <div class="properties">
    <PageHero :eyebrow="copyProperties.heroEyebrow" :title="heroTitle" :text="site.listing.propertiesText" />

    <div class="properties__body">
      <aside class="properties__aside">
        <PropertyFilters :filters="filters" :active-count="activeCount" @update="update" @clear="clear" />
      </aside>

      <div class="properties__main">
        <div class="properties__toolbar">
          <PropertyTypeChips v-model="type" />
          <p class="properties__total" aria-live="polite">
            <template v-if="!list.loading.value && !map.loading.value">{{ copyProperties.count(total) }}</template>
          </p>
        </div>

        <template v-if="isMap">
          <StateMessage v-if="map.error.value" icon="fa-solid fa-triangle-exclamation" :title="copy.common.error" :text="map.error.value" retry @retry="map.load()" />
          <PropertyMapPanel v-else :pins="pins" :loading="map.loading.value" />
        </template>

        <template v-else>
          <SkeletonCards v-if="list.loading.value && !result" :count="4" />
          <StateMessage
            v-else-if="list.error.value"
            icon="fa-solid fa-triangle-exclamation"
            :title="copy.common.error"
            :text="list.error.value"
            retry
            @retry="list.load()"
          />
          <StateMessage v-else-if="result && !result.items.length" icon="fa-solid fa-magnifying-glass" :text="site.listing.empty">
            <button v-if="activeCount" type="button" class="btn btn--ghost" @click="clear">{{ site.listing.clearFilters }}</button>
          </StateMessage>
          <template v-else-if="result">
            <div class="properties__grid" :class="{ 'is-loading': list.loading.value }">
              <PropertyCard v-for="(item, i) in result.items" :key="item._id" :property="item" :eager="i < 2" />
            </div>
            <PaginationNav :page="page" :pages="result.pages" @go="setPage" />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.properties {
  &__body {
    @include container;
    @include flex(column, stretch, flex-start, 1.5rem);
    padding-block: 2rem $space-section;

    // Columna de filtros a la izquierda y resultados en dos columnas, como el ejemplo.
    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3.5rem;
      padding-top: 3.5rem;
    }
  }

  &__aside {
    @include from('lg') {
      flex: 0 0 240px;
      position: sticky;
      top: 110px;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__toolbar {
    @include flex(column, stretch, flex-start, 0.9rem);
    margin-bottom: 1.5rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
  }

  &__total {
    flex-shrink: 0;
    font-size: 0.8125rem;
    font-weight: 300;
    color: $ink-muted;
  }

  &__grid {
    @include flex-cards(300px, 1.75rem);
    transition: opacity 0.2s ease;

    &.is-loading {
      opacity: 0.55;
    }

    // Dos columnas desde tablet; la fila huérfana no se estira a todo el ancho.
    > * {
      max-width: 100%;

      @include from('md') {
        flex-basis: calc(50% - 0.875rem);
        max-width: calc(50% - 0.875rem);
      }
    }
  }
}
</style>
