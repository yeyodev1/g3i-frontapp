<script setup lang="ts">
import type { MapPin } from '@/types'
import { formatPrice } from '@/utils/format'
import { copyPages } from '@/config/copy.pages'

defineProps<{ pins: MapPin[]; selected: string | null; emptyText: string; label: string }>()
defineEmits<{ show: [id: string] }>()
</script>

<template>
  <section class="pins">
    <h2 class="pins__label">{{ label }} <span>· {{ copyPages.valley.results(pins.length) }}</span></h2>
    <ul v-if="pins.length" class="pins__list">
      <li v-for="pin in pins" :key="pin.id">
        <button type="button" class="pins__item" :class="{ 'is-on': selected === pin.id }" @click="$emit('show', pin.id)">
          <span class="pins__thumb">
            <img v-if="pin.cover" :src="pin.cover" alt="" loading="lazy" />
          </span>
          <span class="pins__text">
            <span v-if="pin.kind === 'project'" class="pins__tag">{{ copyPages.valley.projectTag }}</span>
            <span class="pins__title">{{ pin.title }}</span>
            <span v-if="pin.price" class="pins__price">
              {{ pin.kind === 'project' ? `${copyPages.valley.from} ` : '' }}{{ formatPrice(pin.price) }}
            </span>
          </span>
        </button>
      </li>
    </ul>
    <p v-else class="pins__empty">{{ emptyText }}</p>
  </section>
</template>

<style scoped lang="scss">
.pins {
  &__label {
    @include caps(0.7rem, 0.22em);
    color: $ink;
    padding-bottom: 0.9rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid $line;

    span {
      color: $ink-muted;
    }
  }

  &__list {
    list-style: none;
    @include flex-cards(300px, 10px 24px);
  }

  &__item {
    width: 100%;
    height: 100%;
    @include flex(row, center, flex-start, 14px);
    padding: 6px;
    border: 1px solid transparent;
    text-align: left;
    color: $ink;
    @include transition(border-color);
    @include focus-ring;

    &:hover {
      border-color: $line;
    }

    &.is-on {
      border-color: $navy-900;
    }
  }

  &__thumb {
    flex: none;
    width: 96px;
    height: 72px;
    background: $sand;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__text {
    @include flex(column, flex-start, flex-start, 3px);
    min-width: 0;
  }

  &__tag {
    @include caps(0.6rem, 0.2em);
    color: $ember-600;
  }

  &__title {
    font-size: 0.875rem;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__price {
    font: 400 1.2rem/1.1 $font-display;
    color: $navy-900;
  }

  &__empty {
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.6;
    color: $ink-soft;
    max-width: 60ch;
  }
}
</style>
