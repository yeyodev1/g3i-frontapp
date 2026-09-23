<script setup lang="ts">
import { computed } from 'vue'
import type { PropertyCard } from '@/types'
import SpecList from '@/components/common/SpecList.vue'
import { useCatalogStore } from '@/stores/catalog'
import { cardSpecs } from '@/utils/specs'
import { formatPrice, sentenceCase } from '@/utils/format'
import { copy } from '@/config/copy.public'

const props = defineProps<{ property: PropertyCard; compact?: boolean }>()
const catalog = useCatalogStore()

const specs = computed(() => cardSpecs(props.property))
const title = computed(() => sentenceCase(props.property.title))
</script>

<template>
  <article class="pcard" :class="{ 'pcard--compact': compact }">
    <RouterLink :to="`/propiedades/${property.slug}`" class="pcard__link">
      <div class="pcard__media">
        <img v-if="property.cover" :src="property.cover" :alt="title" loading="lazy" />
        <div v-else class="pcard__placeholder"><i class="fa-regular fa-image"></i></div>
        <span class="pcard__type">{{ catalog.typeLabel(property.type) }}</span>
        <span v-if="property.imagesCount > 1" class="pcard__count">
          <i class="fa-regular fa-images"></i> {{ property.imagesCount }}
          <span class="visually-hidden">{{ copy.common.photos }}</span>
        </span>
      </div>
      <div class="pcard__body">
        <p class="pcard__price">{{ property.price ? formatPrice(property.price) : copy.common.priceOnRequest }}</p>
        <h3 class="pcard__title">{{ title }}</h3>
        <p class="pcard__place">
          <i class="fa-solid fa-location-dot"></i> {{ catalog.sectorLabel(property.sector) }} · {{ copy.common.city }}
        </p>
        <p v-if="property.summary && !compact" class="pcard__summary">{{ property.summary }}</p>
        <SpecList v-if="specs.length" :specs="specs" class="pcard__specs" />
      </div>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
.pcard {
  @include card;
  overflow: hidden;
  @include transition;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);

    img {
      transform: scale(1.03);
    }
  }

  &__link {
    @include flex(column, stretch, flex-start);
    height: 100%;
  }

  &__media {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s $ease;
    }
  }

  &__placeholder {
    @include flex(row, center, center);
    height: 100%;
    color: $ink-muted;
    font-size: 1.8rem;
  }

  &__type,
  &__count {
    position: absolute;
    font-size: $text-xs;
    font-weight: 600;
    border-radius: $radius-pill;
    padding: 0.3rem 0.7rem;
  }

  &__type {
    top: 0.75rem;
    left: 0.75rem;
    background: rgba($surface, 0.94);
    color: $ink;
  }

  &__count {
    bottom: 0.75rem;
    right: 0.75rem;
    background: rgba($ink, 0.7);
    color: $surface;
    @include flex(row, center, center, 0.35rem);
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.35rem);
    flex: 1;
    padding: 1rem 1.1rem 1.15rem;
  }

  &__price {
    @include display($text-lg, 700);
    letter-spacing: -0.01em;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-base;
    font-weight: 600;
    line-height: 1.3;
    color: $ink;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__place {
    font-size: $text-sm;
    color: $ink-muted;

    i {
      color: $brand-orange;
      font-size: 0.8em;
      margin-right: 0.2rem;
    }
  }

  &__summary {
    font-size: $text-sm;
    color: $ink-soft;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__specs {
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid $line;
  }

  &--compact &__body {
    padding: 0.8rem 0.9rem 0.9rem;
  }
}
</style>
