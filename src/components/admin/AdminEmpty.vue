<script setup lang="ts">
defineProps<{ text: string; icon?: string }>()
</script>

<template>
  <div class="empty">
    <i :class="icon || 'fa-regular fa-folder-open'" class="empty__icon"></i>
    <p class="empty__text">{{ text }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include card;
  @include flex(column, center, center, 0.8rem);
  text-align: center;
  padding: 2.5rem 1.2rem;
  border-style: dashed;

  &__icon {
    font-size: 1.8rem;
    color: $ink-muted;
  }

  &__text {
    color: $ink-soft;
    max-width: 36ch;
  }
}
</style>
