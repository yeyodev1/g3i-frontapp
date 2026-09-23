<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PageHero from '@/components/common/PageHero.vue'
import SkeletonCards from '@/components/common/SkeletonCards.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import PaginationNav from '@/components/common/PaginationNav.vue'
import PropertyCard from '@/components/property/PropertyCard.vue'
import PropertyFilters from '@/components/property/PropertyFilters.vue'
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

function setView(view: '' | 'mapa') {
  update({ view })
}
</script>

<template>
  <div class="properties">
    <PageHero :eyebrow="site.nav[1]?.label" :title="seoTitle" :text="site.listing.propertiesText" />

    <div class="properties__body">
      <PropertyFilters :filters="filters" :active-count="activeCount" @update="update" @clear="clear" />

      <div class="properties__toolbar">
        <p class="properties__total" aria-live="polite">
          <template v-if="!list.loading.value && !map.loading.value">{{ copy.filters.results(total) }}</template>
        </p>
        <div class="properties__views" role="group" :aria-label="copyProperties.viewToggle">
          <button type="button" :class="{ 'is-active': !isMap }" :aria-pressed="!isMap" @click="setView('')">
            <i class="fa-solid fa-table-cells-large"></i> {{ copy.filters.list }}
          </button>
          <button type="button" :class="{ 'is-active': isMap }" :aria-pressed="isMap" @click="setView('mapa')">
            <i class="fa-regular fa-map"></i> {{ copy.filters.map }}
          </button>
        </div>
      </div>

      <template v-if="isMap">
        <StateMessage v-if="map.error.value" icon="fa-solid fa-triangle-exclamation" :title="copy.common.error" :text="map.error.value" retry @retry="map.load()" />
        <PropertyMapPanel v-else :pins="pins" :loading="map.loading.value" />
      </template>

      <template v-else>
        <SkeletonCards v-if="list.loading.value && !result" :count="6" />
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
            <PropertyCard v-for="item in result.items" :key="item._id" :property="item" />
          </div>
          <PaginationNav :page="page" :pages="result.pages" @go="setPage" />
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.properties {
  &__body {
    @include container(1280px);
    padding-block: 1.5rem $space-section;
  }

  &__toolbar {
    @include flex(row, center, space-between, 1rem);
    margin: 1.25rem 0 1.25rem;
  }

  &__total {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__views {
    @include flex(row, center, flex-start, 0.2rem);
    padding: 0.2rem;
    border: 1px solid $line;
    border-radius: $radius-pill;

    button {
      @include flex(row, center, center, 0.4rem);
      height: 2.3rem;
      padding-inline: 0.9rem;
      border-radius: $radius-pill;
      font-size: $text-sm;
      font-weight: 600;
      color: $ink-soft;
      @include transition;

      i {
        font-size: 0.85em;
      }

      &.is-active {
        background: $ink;
        color: $surface;
      }
    }
  }

  &__grid {
    @include flex-cards(290px, 1.5rem);
    transition: opacity 0.2s ease;

    &.is-loading {
      opacity: 0.55;
    }

    // Evita que la última fila huérfana se estire a todo el ancho.
    > * {
      max-width: 100%;

      @include from('md') {
        max-width: calc(50% - 0.75rem);
      }

      @include from('lg') {
        max-width: calc(33.333% - 1rem);
      }
    }
  }
}
</style>
