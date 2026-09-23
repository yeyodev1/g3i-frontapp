<script setup lang="ts">
import type { Property } from '@/types'
import { formatPrice } from '@/utils/format'
import { copy } from '@/config/copy.public'

defineProps<{ property: Property }>()
</script>

<template>
  <div class="price">
    <p class="price__value">{{ property.price ? formatPrice(property.price) : copy.common.priceOnRequest }}</p>
    <p v-if="property.hoa.enabled && property.hoa.amount > 0" class="price__hoa">
      {{ copy.specs.hoa }} {{ formatPrice(property.hoa.amount) }}
    </p>
    <p v-if="property.code" class="price__code">{{ copy.property.code }}: {{ property.code }}</p>
  </div>
</template>

<style scoped lang="scss">
.price {
  @include flex(column, flex-start, flex-start, 0.2rem);

  &__value {
    @include display($display-sm, 700);
    letter-spacing: -0.02em;
  }

  &__hoa {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__code {
    font-size: $text-xs;
    color: $ink-muted;
    letter-spacing: 0.04em;
  }
}
</style>
