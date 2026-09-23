<script setup lang="ts">
import type { Property } from '@/types'
import { formatPrice } from '@/utils/format'
import { copy } from '@/config/copy.public'
import { copyProperties } from '@/config/copy.properties'

defineProps<{ property: Property }>()
</script>

<template>
  <div class="price">
    <p class="price__label">{{ copyProperties.salePrice }}</p>
    <p class="price__value">{{ property.price ? formatPrice(property.price) : copy.common.priceOnRequest }}</p>
    <p v-if="property.hoa.enabled && property.hoa.amount > 0" class="price__hoa">
      {{ copy.specs.hoa }} {{ formatPrice(property.hoa.amount) }}
    </p>
    <p v-if="property.code" class="price__code">{{ copy.property.code }} {{ property.code }}</p>
  </div>
</template>

<style scoped lang="scss">
.price {
  @include flex(column, flex-start, flex-start, 0.3rem);

  &__label {
    @include caps(0.6875rem, 0.28em);
    color: $ink-muted;
  }

  &__value {
    font-family: $font-display;
    font-size: clamp(2.25rem, 1.9rem + 1.2vw, 2.75rem);
    font-weight: 500;
    line-height: 1.1;
    color: $navy-900;
  }

  &__hoa {
    font-size: $text-sm;
    font-weight: 300;
    color: $ink-soft;
  }

  &__code {
    @include caps(0.625rem, 0.2em);
    color: $ink-muted;
  }
}
</style>
