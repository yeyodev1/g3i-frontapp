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
  @include flex-cards(220px, 0.6rem 1.2rem);

  &__item {
    @include flex(row, center, flex-start, 0.75rem);
    font-size: $text-sm;
    color: $ink;
    padding-block: 0.4rem;
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: $sand;
    color: $brand-blue;
    font-size: 0.9rem;
  }
}
</style>
