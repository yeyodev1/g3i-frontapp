<script setup lang="ts">
import { computed } from 'vue'
import FieldSelect from '@/components/forms/FieldSelect.vue'
import { useCatalogStore } from '@/stores/catalog'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'

type Key = 'stage' | 'type' | 'sector'

const props = defineProps<{ filters: Record<Key, string>; activeCount: number }>()
const emit = defineEmits<{ update: [patch: Partial<Record<Key, string>>]; clear: [] }>()
const catalog = useCatalogStore()

function bind(key: Key) {
  return computed({
    get: () => props.filters[key],
    set: (value: string) => emit('update', { [key]: value }),
  })
}
const stage = bind('stage')
const type = bind('type')
const sector = bind('sector')
</script>

<template>
  <form class="pfilters" role="search" @submit.prevent>
    <FieldSelect v-model="stage" :label="copy.filters.stage" :options="catalog.projectStages" :placeholder="copy.filters.anyStage" />
    <FieldSelect v-model="type" :label="copy.filters.type" :options="catalog.propertyTypes" :placeholder="copy.filters.anyType" />
    <FieldSelect v-model="sector" :label="copy.filters.sector" :options="catalog.activeSectors" :placeholder="copy.filters.anySector" />
    <button v-if="activeCount" type="button" class="pfilters__clear" @click="emit('clear')">
      <i class="fa-solid fa-xmark"></i> {{ site.listing.clearFilters }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.pfilters {
  @include flex-cards(180px, 0.8rem);
  align-items: flex-end;
  padding: 1rem;
  @include card;

  @include from('md') {
    padding: 1.2rem 1.4rem;
  }

  &__clear {
    flex: 0 0 auto !important;
    height: 2.9rem;
    padding-inline: 0.6rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      color: $ink;
    }
  }
}
</style>
