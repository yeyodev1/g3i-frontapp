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

  // Fila de «highlights» de la ficha: ícono fino, cifra en serif y etiqueta pequeña.
  &--lg {
    @include flex(row, flex-start, flex-start, 1.75rem 2.25rem);
    flex-wrap: wrap;
    padding-block: 1.5rem;
    border-top: 1px solid $line;
    border-bottom: 1px solid $line;

    @include from('md') {
      gap: 1.75rem 3rem;
      padding-block: 1.75rem;
    }

    .specs__item {
      @include flex(column, flex-start, flex-start, 0.2rem);
      min-width: 4.5rem;
    }

    i {
      color: $blue-600;
      font-size: 1.1rem;
      margin-bottom: 0.35rem;
    }

    .specs__value {
      font-family: $font-display;
      font-size: 1.75rem;
      font-weight: 400;
      line-height: 1.1;
      color: $ink;

      @include from('md') {
        font-size: 1.875rem;
      }
    }

    .specs__label {
      font-size: $text-xs;
      font-weight: 300;
      color: $ink-muted;
    }
  }
}
</style>
