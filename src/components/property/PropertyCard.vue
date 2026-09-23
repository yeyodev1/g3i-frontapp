<script setup lang="ts">
import { computed } from 'vue'
import type { PropertyCard } from '@/types'
import FavoriteButton from './FavoriteButton.vue'
import { useCatalogStore } from '@/stores/catalog'
import { cardSpecs } from '@/utils/specs'
import { formatPrice, sentenceCase } from '@/utils/format'
import { copy } from '@/config/copy.public'
import { copyProperties } from '@/config/copy.properties'

const props = defineProps<{ property: PropertyCard; compact?: boolean; eager?: boolean }>()
const catalog = useCatalogStore()

const specs = computed(() => cardSpecs(props.property))
const title = computed(() => sentenceCase(props.property.title))
// «TUMBACO · AUKI PLAZA»: sector y, si existe, la subzona.
const place = computed(() =>
  [catalog.sectorLabel(props.property.sector), props.property.locality].filter(Boolean).join(' · '),
)
</script>

<template>
  <article class="pcard" :class="{ 'pcard--compact': compact }">
    <RouterLink :to="`/propiedades/${property.slug}`" class="pcard__link">
      <div class="pcard__media">
        <img v-if="property.cover" :src="property.cover" :alt="title" :loading="eager ? 'eager' : 'lazy'" />
        <div v-else class="pcard__placeholder"><i class="fa-regular fa-image"></i></div>
        <div class="pcard__badges">
          <span class="pcard__badge pcard__badge--sale">{{ copyProperties.sale }}</span>
          <span v-if="property.badge" class="pcard__badge pcard__badge--accent">{{ property.badge }}</span>
        </div>
      </div>

      <div class="pcard__body">
        <p class="pcard__place">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          <span>{{ place }}</span>
        </p>
        <h3 class="pcard__title">{{ title }}</h3>
        <ul v-if="specs.length" class="pcard__specs">
          <li v-for="spec in specs" :key="spec.key" :title="spec.label">
            <i :class="spec.icon" aria-hidden="true"></i>
            {{ [spec.value, spec.short].filter(Boolean).join(' ') }}
            <span class="visually-hidden"> {{ spec.label }}</span>
          </li>
        </ul>
        <div class="pcard__foot">
          <p class="pcard__price">{{ property.price ? formatPrice(property.price) : copy.common.priceOnRequest }}</p>
          <span class="pcard__more" aria-hidden="true">{{ copyProperties.seeMore }} →</span>
        </div>
      </div>
    </RouterLink>

    <FavoriteButton :id="property._id" class="pcard__fav" />
  </article>
</template>

<style scoped lang="scss">
.pcard {
  position: relative;
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-sm;
  overflow: hidden;
  transition: box-shadow 0.45s $ease;

  &:hover {
    box-shadow: $shadow-md;
  }

  &__link {
    @include flex(column, stretch, flex-start);
    height: 100%;
    color: inherit;

    &:focus-visible {
      outline-offset: -3px;
    }
  }

  &__media {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: $gray-200;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.9s $ease;
    }
  }

  &:hover &__media img {
    transform: scale(1.04);
  }

  &__placeholder {
    @include flex(row, center, center);
    height: 100%;
    color: $ink-muted;
    font-size: 1.8rem;
  }

  &__badges {
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 4rem;
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__badge {
    @include flex(row, center, center);
    height: 24px;
    padding-inline: 0.625rem;
    border-radius: $radius-sm;
    @include caps(0.625rem, 0.22em);
    color: $surface;
    white-space: nowrap;

    &--sale {
      background: $navy-900;
    }

    &--accent {
      background: $ember-500;
    }
  }

  &__fav {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
  }

  &__body {
    @include flex(column, stretch, flex-start);
    flex: 1;
    padding: 1.25rem 1.25rem 1.2rem;

    @include from('md') {
      padding: 1.5rem 1.5rem 1.375rem;
    }
  }

  &__place {
    @include flex(row, center, flex-start, 0.4rem);
    @include caps(0.6875rem, 0.28em);
    color: $ember-600;

    i {
      font-size: 0.8em;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__title {
    margin-top: 0.625rem;
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 1.15;
    color: $ink;
    text-wrap: pretty;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 1rem;

    @include from('md') {
      font-size: 1.625rem;
    }
  }

  &__specs {
    list-style: none;
    @include flex(row, center, flex-start, 0.4rem 1.1rem);
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
    font-size: $text-sm;
    font-weight: 300;
    color: $ink-soft;

    li {
      @include flex(row, center, flex-start, 0.4rem);
    }

    i {
      font-size: 0.8em;
      color: $ink-muted;
    }
  }

  &__foot {
    @include flex(row, baseline, space-between, 1rem);
    margin-top: auto;
    padding-top: 1.1rem;
    // La fila final queda al fondo aunque la tarjeta vecina tenga más texto.
    border-top: 1px solid $line;
  }

  &__price {
    font-family: $font-display;
    font-size: 1.75rem;
    font-weight: 500;
    line-height: 1;
    color: $navy-900;
  }

  &__more {
    @include caps(0.6875rem, 0.28em);
    color: $ink-muted;
    white-space: nowrap;
    @include transition(color);
  }

  &:hover &__more {
    color: $ember-500;
  }

  &--compact &__body {
    padding: 1rem 1rem 1rem;
  }

  &--compact &__title {
    font-size: 1.35rem;
  }

  @include reduced-motion {
    &__media img {
      transition: none;
    }

    &:hover &__media img {
      transform: none;
    }
  }
}
</style>
