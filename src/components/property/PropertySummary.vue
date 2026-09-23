<script setup lang="ts">
import type { Property } from '@/types'
import PropertyPriceBlock from './PropertyPriceBlock.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import { useCatalogStore } from '@/stores/catalog'
import { copyProperties } from '@/config/copy.properties'

defineProps<{ property: Property; title: string; place: string; whatsappHref: string }>()
const catalog = useCatalogStore()
</script>

<template>
  <header class="summary">
    <p class="summary__place">{{ place }}</p>
    <h1 class="summary__title">{{ title }}</h1>
    <p class="summary__type">
      {{ catalog.typeLabel(property.type) }} {{ copyProperties.inSale }}
      <template v-if="property.condition">· {{ catalog.conditionLabel(property.condition) }}</template>
    </p>
    <!-- En móvil el precio y WhatsApp van junto al título; en desktop viven en la columna fija. -->
    <div class="summary__mobile">
      <PropertyPriceBlock :property="property" />
      <WhatsAppButton :href="whatsappHref" block />
    </div>
  </header>
</template>

<style scoped lang="scss">
.summary {
  @include flex(column, stretch, flex-start);

  &__place {
    @include eyebrow;
  }

  &__title {
    margin-top: 0.875rem;
    font-family: $font-display;
    font-size: clamp(2.1rem, 1.5rem + 2.2vw, 3.25rem);
    font-weight: 300;
    line-height: 1.08;
    color: $ink;
    text-wrap: pretty;
    max-width: 22ch;
  }

  &__type {
    margin-top: 0.875rem;
    font-size: $text-sm;
    font-weight: 300;
    color: $ink-soft;
  }

  &__mobile {
    @include flex(column, stretch, flex-start, 1.25rem);
    margin-top: 1.5rem;

    @include from('lg') {
      display: none;
    }
  }
}
</style>
