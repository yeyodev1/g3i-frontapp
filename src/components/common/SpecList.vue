<script setup lang="ts">
import type { Spec } from '@/utils/specs'

withDefaults(defineProps<{ specs: Spec[]; size?: 'sm' | 'lg' }>(), { size: 'sm' })
</script>

<template>
  <ul v-if="specs.length" class="specs" :class="`specs--${size}`">
    <li v-for="spec in specs" :key="spec.key" class="specs__item" :title="spec.label">
      <i :class="spec.icon" aria-hidden="true"></i>
      <template v-if="size === 'lg'">
        <span class="specs__value">{{ spec.value }}</span>
        <span class="specs__label">{{ spec.label }}</span>
      </template>
      <span v-else class="specs__value">
        {{ spec.value }}<span class="visually-hidden"> {{ spec.label }}</span>
      </span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.specs {
  list-style: none;

  &--sm {
    @include flex(row, center, flex-start, 0.4rem 1rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;

    .specs__item {
      @include flex(row, center, flex-start, 0.4rem);
    }

    i {
      color: $ink-muted;
      font-size: 0.85em;
    }
  }

  &--lg {
    @include flex-cards(130px, 0.75rem);

    .specs__item {
      @include flex(column, flex-start, flex-start, 0.15rem);
      padding: 1rem;
      border: 1px solid $line;
      border-radius: $radius-sm;
    }

    i {
      color: $brand-blue;
      font-size: 1.1rem;
      margin-bottom: 0.4rem;
    }

    .specs__value {
      @include display($text-lg, 600);
      letter-spacing: -0.01em;
    }

    .specs__label {
      font-size: $text-xs;
      color: $ink-muted;
    }
  }
}
</style>
