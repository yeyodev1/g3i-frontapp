<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import AdminStatusBadge from './AdminStatusBadge.vue'

defineProps<{
  to: RouteLocationRaw
  cover?: string
  title: string
  code?: string
  meta?: string
  price?: string
  status: string
  group: 'property' | 'project'
  featured?: boolean
}>()
</script>

<template>
  <article class="listing">
    <RouterLink :to="to" class="listing__main">
      <div class="listing__thumb">
        <img v-if="cover" :src="cover" alt="" loading="lazy" />
        <i v-else class="fa-regular fa-image"></i>
      </div>
      <div class="listing__info">
        <div class="listing__top">
          <AdminStatusBadge :status="status" :group="group" />
          <span v-if="featured" class="listing__star"><i class="fa-solid fa-star"></i> Destacada</span>
          <span v-if="code" class="listing__code">{{ code }}</span>
        </div>
        <h3 class="listing__title">{{ title }}</h3>
        <p v-if="meta" class="listing__meta">{{ meta }}</p>
        <p v-if="price" class="listing__price">{{ price }}</p>
      </div>
    </RouterLink>
    <div class="listing__actions">
      <slot />
    </div>
  </article>
</template>

<style scoped lang="scss">
.listing {
  @include card;
  @include flex(column, stretch, flex-start);
  overflow: hidden;

  @include from('lg') {
    flex-direction: row;
    align-items: center;
  }

  &__main {
    @include flex(row, flex-start, flex-start, 0.9rem);
    padding: 0.9rem;
    flex: 1;
    min-width: 0;
  }

  &__thumb {
    flex: none;
    width: 96px;
    height: 76px;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $sand;
    @include flex(row, center, center);
    color: $ink-muted;
    font-size: 1.3rem;

    @include from('md') {
      width: 128px;
      height: 92px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    @include flex(column, flex-start, flex-start, 0.25rem);
    min-width: 0;
  }

  &__top {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__star {
    font-size: 0.74rem;
    font-weight: 600;
    color: $brand-orange;
  }

  &__code {
    font-size: 0.74rem;
    color: $ink-muted;
    font-family: ui-monospace, monospace;
  }

  &__title {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  &__meta {
    font-size: 0.82rem;
    color: $ink-soft;
  }

  &__price {
    font-weight: 700;
    font-size: 0.95rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;
    padding: 0.6rem 0.9rem 0.9rem;
    border-top: 1px solid $line;

    @include from('lg') {
      border-top: none;
      justify-content: flex-end;
      max-width: 50%;
      padding: 0.9rem;
    }

    :deep(button),
    :deep(a) {
      @include flex(row, center, center, 0.4rem);
      min-height: 40px;
      padding: 0.45rem 0.8rem;
      border: 1px solid $line;
      border-radius: $radius-pill;
      font-size: 0.8rem;
      font-weight: 600;
      background: $surface;
      color: $ink;

      &:hover {
        border-color: $ink;
      }
    }

    :deep(.is-danger) {
      color: $danger;
    }

    :deep(.is-on) {
      color: $brand-orange;
    }
  }
}
</style>
