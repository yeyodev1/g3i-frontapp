<script setup lang="ts">
import { computed } from 'vue'
import HomeSearch from './HomeSearch.vue'
import { site } from '@/config/site'
import type { PopularSearch } from '@/types'

const props = defineProps<{
  title?: string
  subtitle?: string
  image?: string
  popular: PopularSearch[]
}>()

// «Sueña, siente, vive tu espacio.» → la segunda idea (tras la última coma) va en cursiva.
const lines = computed(() => {
  const text = (props.title || site.home.heroTitle).trim()
  const cut = text.lastIndexOf(',')
  if (cut <= 0 || cut === text.length - 1) return { first: text, second: '' }
  return { first: text.slice(0, cut + 1), second: text.slice(cut + 1).trim() }
})
</script>

<template>
  <div class="home-hero">
    <section class="hero">
      <div class="hero__media" aria-hidden="true">
        <img v-if="image" :src="image" alt="" fetchpriority="high" />
      </div>
      <div class="hero__inner">
        <p class="hero__eyebrow">{{ site.home.heroEyebrow }}</p>
        <h1 class="hero__title">
          {{ lines.first }}
          <template v-if="lines.second">
            <br />
            <em>{{ lines.second }}</em>
          </template>
        </h1>
        <p class="hero__subtitle">{{ subtitle || site.home.heroSubtitle }}</p>
      </div>
    </section>

    <div class="home-hero__search">
      <HomeSearch :popular="popular" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: $navy-950;
  color: $on-inverse;
  min-height: 600px;
  @include flex(column, stretch, center);

  @include from('lg') {
    min-height: 760px;
  }

  &__media {
    position: absolute;
    inset: 0;
    z-index: -1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation: hero-in 1.6s $ease both;
    }

    // En móvil el texto ocupa todo el ancho: el velo baja de arriba a abajo.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba($navy-950, 0.78) 0%,
        rgba($navy-950, 0.6) 55%,
        rgba($navy-950, 0.82) 100%
      );

      @include from('md') {
        background: linear-gradient(
          90deg,
          rgba($navy-950, 0.92) 0%,
          rgba($navy-950, 0.6) 55%,
          rgba($navy-950, 0.25) 100%
        );
      }
    }
  }

  &__inner {
    @include container;
    // Deja sitio al header flotante arriba y al buscador que monta abajo.
    padding-block: 7.5rem 6.5rem;

    @include from('lg') {
      padding-block: 13.75rem 9rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $ember-300;
  }

  &__title {
    @include display(clamp(3rem, 1.9rem + 4.6vw, 5.5rem));
    line-height: 1;
    color: $on-inverse;
    margin-top: 1.5rem;
    max-width: 760px;

    em {
      font-style: italic;
    }
  }

  &__subtitle {
    margin-top: 1.75rem;
    max-width: 540px;
    font-size: clamp(1.06rem, 1rem + 0.3vw, 1.19rem);
    font-weight: 300;
    line-height: 1.6;
    color: $on-inverse-muted;
  }
}

.home-hero__search {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1104px;
  margin: -4rem auto 0;
  padding-inline: 1.25rem;

  @include from('md') {
    padding-inline: 2rem;
  }

  @include from('lg') {
    margin-top: -5rem;
  }
}

// Entrada lenta de la foto; con movimiento reducido queda quieta.
@keyframes hero-in {
  from {
    transform: scale(1.06);
    opacity: 0.4;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@include reduced-motion {
  .hero__media img {
    animation: none;
  }
}
</style>
