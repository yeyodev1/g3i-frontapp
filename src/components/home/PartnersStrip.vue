<script setup lang="ts">
import type { Partner } from '@/types'
import { site } from '@/config/site'

defineProps<{ partners: Partner[] }>()
</script>

<template>
  <section v-if="partners.length" class="partners">
    <div class="partners__inner">
      <h2 class="partners__title">{{ site.home.partnersTitle }}</h2>
      <ul class="partners__list">
        <li v-for="p in partners" :key="p._id" class="partners__item">
          <component :is="p.url ? 'a' : 'span'" :href="p.url || undefined" target="_blank" rel="noopener" class="partners__logo">
            <img v-if="p.logo" :src="p.logo.url" :alt="p.name" loading="lazy" />
            <span v-else>{{ p.name }}</span>
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.partners {
  padding-block: $space-xl;
  border-top: 1px solid $line;

  &__inner {
    @include container;
  }

  &__title {
    font-family: $font-principal;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-muted;
    text-align: center;
    margin-bottom: 1.8rem;
  }

  &__list {
    list-style: none;
    @include flex(row, center, center, 1.5rem 2.8rem);
    flex-wrap: wrap;
  }

  &__logo {
    @include flex(row, center, center);
    height: 48px;
    font-family: $font-display;
    font-weight: 600;
    color: $ink-soft;

    img {
      max-height: 100%;
      max-width: 140px;
      object-fit: contain;
      filter: grayscale(1);
      opacity: 0.7;
      @include transition;
    }

    &:hover img {
      filter: none;
      opacity: 1;
    }
  }
}
</style>
