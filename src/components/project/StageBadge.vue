<script setup lang="ts">
import { useCatalogStore } from '@/stores/catalog'

defineProps<{ stage: string }>()
const catalog = useCatalogStore()
</script>

<template>
  <span class="stage" :class="`stage--${stage}`">
    <span class="stage__dot" aria-hidden="true"></span>
    {{ catalog.stageLabel(stage) }}
  </span>
</template>

<style scoped lang="scss">
.stage {
  @include flex(row, center, flex-start, 0.4rem);
  display: inline-flex;
  font-size: $text-xs;
  font-weight: 600;
  padding: 0.3rem 0.7rem;
  border-radius: $radius-pill;
  background: rgba($surface, 0.94);
  color: $ink;

  &__dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: $ink-muted;
  }

  &--en-planos &__dot {
    background: $brand-blue;
  }

  &--en-construccion &__dot {
    background: $brand-orange;
  }

  &--por-estrenar &__dot {
    background: $success;
  }
}
</style>
