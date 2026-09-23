<script setup lang="ts">
import type { Partner } from '@/types'
import { copyHome } from '@/config/copy.home'

defineProps<{ partners: Partner[] }>()
</script>

<template>
  <section v-if="partners.length" class="partners" data-reveal>
    <div class="partners__inner">
      <h2 class="partners__title">{{ copyHome.partnersEyebrow }}</h2>
      <ul class="partners__list">
        <li v-for="p in partners" :key="p._id" class="partners__item">
          <component
            :is="p.url ? 'a' : 'span'"
            :href="p.url || undefined"
            :target="p.url ? '_blank' : undefined"
            :rel="p.url ? 'noopener' : undefined"
            class="partners__logo"
          >
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
  padding-block: clamp(3.5rem, 8vw, 5rem);

  &__inner {
    @include container;
  }

  &__title {
    @include eyebrow;
    text-align: center;
  }

  &__list {
    list-style: none;
    @include flex(row, center, center, 1.5rem 2rem);
    flex-wrap: wrap;
    margin-top: 2.5rem;
  }

  &__item {
    flex: 0 1 calc(50% - 1rem);
    @include flex(row, center, center);

    @include from('md') {
      flex: 1 1 0;
    }
  }

  // En gris y apagados; toman color al pasar el mouse.
  &__logo {
    @include flex(row, center, center);
    height: 88px;
    font-family: $font-display;
    font-size: 1.25rem;
    color: $ink-soft;

    img {
      max-height: 100%;
      max-width: 160px;
      object-fit: contain;
      filter: grayscale(1);
      opacity: 0.7;
      @include transition;
    }

    &:hover img,
    &:focus-visible img {
      filter: none;
      opacity: 1;
    }
  }
}
</style>
