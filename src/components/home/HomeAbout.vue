<script setup lang="ts">
import { computed } from 'vue'
import { copyHome } from '@/config/copy.home'
import type { Image } from '@/types'

const props = defineProps<{ title?: string; text?: string; image?: Image | null }>()
const t = copyHome.about

// El texto del panel viene con párrafos separados por una línea en blanco.
const paragraphs = computed(() =>
  (props.text || t.text)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean),
)
</script>

<template>
  <section class="about" data-reveal>
    <div class="about__inner">
      <div class="about__media">
        <img v-if="image" :src="image.url" :alt="image.alt || t.imageAlt" loading="lazy" />
      </div>
      <div class="about__copy">
        <p class="about__eyebrow">{{ t.eyebrow }}</p>
        <h2 class="about__title">{{ title || t.title }}</h2>
        <p v-for="(p, i) in paragraphs" :key="i" class="about__text">{{ p }}</p>
        <ul class="about__traits">
          <li v-for="trait in t.traits" :key="trait.label" class="about__trait">
            <i :class="trait.icon" aria-hidden="true"></i>
            <span>{{ trait.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about {
  padding-bottom: $space-section;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 5rem;
    }
  }

  &__media {
    flex: 1 1 0;
    aspect-ratio: 4 / 5;
    max-height: 70vh;
    overflow: hidden;
    background: $gray-100;

    @include from('lg') {
      max-height: none;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__copy {
    flex: 1 1 0;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(2.2rem, 1.7rem + 2vw, 3rem));
    @include title-rule;
    color: $ink;
    margin-top: 0.9rem;
  }

  &__text {
    margin-top: 1.5rem;
    font-size: 1.0625rem;
    font-weight: 300;
    line-height: 1.75;
    color: $ink-body;

    & + & {
      margin-top: 1rem;
    }
  }

  &__traits {
    list-style: none;
    @include flex(row, flex-start, flex-start, 1.5rem);
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid $line;
  }

  &__trait {
    flex: 1 1 0;
    @include flex(column, flex-start, flex-start, 0.6rem);
    color: $navy-900;

    i {
      font-size: 1.35rem;
    }

    span {
      font-family: $font-display;
      font-size: 1.5rem;
      font-weight: 400;
      color: $ink;
    }
  }
}
</style>
