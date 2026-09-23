<script setup lang="ts">
import type { Property } from '@/types'
import PropertyPriceBlock from './PropertyPriceBlock.vue'
import ShareButton from '@/components/common/ShareButton.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import { useCatalogStore } from '@/stores/catalog'

defineProps<{ property: Property; title: string; place: string; whatsappHref: string }>()
const catalog = useCatalogStore()
</script>

<template>
  <header class="summary">
    <div class="summary__top">
      <p class="summary__type">
        {{ catalog.typeLabel(property.type) }}
        <span v-if="property.condition">· {{ catalog.conditionLabel(property.condition) }}</span>
      </p>
      <ShareButton :title="title" :text="property.summary" compact />
    </div>
    <h1 class="summary__title">{{ title }}</h1>
    <p class="summary__place"><i class="fa-solid fa-location-dot"></i> {{ place }}</p>
    <div class="summary__mobile">
      <PropertyPriceBlock :property="property" />
      <WhatsAppButton :href="whatsappHref" block />
    </div>
  </header>
</template>

<style scoped lang="scss">
.summary {
  @include flex(column, stretch, flex-start, 0.5rem);

  &__top {
    @include flex(row, center, space-between, 1rem);
  }

  &__type {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 600);
    max-width: 30ch;
  }

  &__place {
    font-size: $text-base;
    color: $ink-soft;

    i {
      color: $brand-orange;
      font-size: 0.85em;
      margin-right: 0.25rem;
    }
  }

  &__mobile {
    @include flex(column, stretch, flex-start, 1rem);
    margin-top: 0.8rem;
    padding-top: 1rem;
    border-top: 1px solid $line;

    @include from('lg') {
      display: none;
    }
  }
}
</style>
