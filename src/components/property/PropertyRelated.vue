<script setup lang="ts">
import type { PropertyCard as Card } from '@/types'
import PropertyCard from './PropertyCard.vue'
import { copyProperties } from '@/config/copy.properties'

defineProps<{ items: Card[] }>()
</script>

<template>
  <section class="related" :aria-labelledby="'related-title'">
    <div class="related__head">
      <h2 id="related-title" class="related__title">{{ copyProperties.related }}</h2>
      <RouterLink to="/propiedades" class="link-caps">{{ copyProperties.seeAll }} →</RouterLink>
    </div>
    <div class="related__grid">
      <PropertyCard v-for="item in items" :key="item._id" :property="item" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.related {
  @include container;
  padding-block: 1rem $space-section;

  &__head {
    @include flex(row, flex-end, space-between, 1rem);
    margin-bottom: 2.5rem;
  }

  &__title {
    @include eyebrow;
    @include title-rule;
  }

  &__grid {
    @include flex-cards(290px, 1.75rem);

    > * {
      @include from('lg') {
        max-width: calc(33.333% - 1.17rem);
      }
    }
  }
}
</style>
