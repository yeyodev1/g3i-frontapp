<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{ title: string; subtitle?: string; back?: RouteLocationRaw; backLabel?: string }>()
</script>

<template>
  <header class="page-head">
    <RouterLink v-if="back" :to="back" class="page-head__back">
      <i class="fa-solid fa-arrow-left"></i> {{ backLabel || 'Volver' }}
    </RouterLink>
    <div class="page-head__row">
      <div class="page-head__text">
        <h1 class="page-head__title">{{ title }}</h1>
        <p v-if="subtitle" class="page-head__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.default" class="page-head__actions">
        <slot />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-head {
  @include flex(column, stretch, flex-start, 0.6rem);
  margin-bottom: 1.5rem;

  &__back {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: 0.88rem;
    font-weight: 600;
    color: $ink-soft;
    align-self: flex-start;
    min-height: 40px;

    &:hover {
      color: $ink;
    }
  }

  &__row {
    @include flex(row, flex-end, space-between, 1rem);
    flex-wrap: wrap;
  }

  &__text {
    flex: 1 1 260px;
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__subtitle {
    color: $ink-soft;
    font-size: 0.92rem;
    margin-top: 0.35rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }
}
</style>
