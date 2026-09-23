<script setup lang="ts">
import { useCatalogStore } from '@/stores/catalog'

defineProps<{ keys: string[] }>()
const catalog = useCatalogStore()
</script>

<template>
  <ul v-if="keys.length" class="amenities">
    <li v-for="key in keys" :key="key" class="amenities__item">
      <span class="amenities__icon"><i :class="catalog.amenity(key).icon" aria-hidden="true"></i></span>
      {{ catalog.amenity(key).label }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
.amenities {
  list-style: none;
  @include flex-cards(220px, 0.25rem 2rem);

  &__item {
    @include flex(row, center, flex-start, 0.85rem);
    font-size: 0.95rem;
    font-weight: 300;
    color: $ink-body;
    padding-block: 0.7rem;
    border-bottom: 1px solid $gray-200;
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 1.5rem;
    color: $blue-600;
    font-size: 0.95rem;
  }
}
</style>
