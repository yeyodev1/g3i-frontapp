<script setup lang="ts">
withDefaults(defineProps<{ count?: number; basis?: string }>(), { count: 6, basis: '280px' })
</script>

<template>
  <div class="skeletons" aria-busy="true" aria-live="polite">
    <span class="visually-hidden">Cargando…</span>
    <div v-for="n in count" :key="n" class="skeleton" :style="{ flexBasis: basis }">
      <div class="skeleton__media"></div>
      <div class="skeleton__line skeleton__line--short"></div>
      <div class="skeleton__line"></div>
      <div class="skeleton__line skeleton__line--mid"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeletons {
  @include flex-cards(280px, 1.5rem);
}

.skeleton {
  @include flex(column, stretch, flex-start, 0.7rem);
  flex-grow: 1;

  &__media,
  &__line {
    border-radius: $radius-sm;
    background: linear-gradient(90deg, $sand 0%, darken($sand, 3%) 50%, $sand 100%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  &__media {
    aspect-ratio: 4 / 3;
    border-radius: 14px;
  }

  &__line {
    height: 0.85rem;

    &--short {
      width: 35%;
    }

    &--mid {
      width: 60%;
    }
  }
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
