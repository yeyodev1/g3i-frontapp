<script setup lang="ts">
import { ref } from 'vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import type { Testimonial } from '@/types'
import { site } from '@/config/site'
import { copyHome } from '@/config/copy.home'

defineProps<{ testimonials: Testimonial[] }>()
const track = ref<HTMLElement | null>(null)

// Carrusel nativo: scroll-snap hace el trabajo, los botones solo desplazan.
function move(dir: 1 | -1) {
  const el = track.value
  if (!el) return
  const card = el.querySelector<HTMLElement>('.quote')
  const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8
  el.scrollBy({ left: dir * step, behavior: 'smooth' })
}
</script>

<template>
  <section v-if="testimonials.length" class="testimonials">
    <div class="testimonials__inner">
      <div class="testimonials__head">
        <SectionHeading :eyebrow="site.home.testimonialsEyebrow" :title="site.home.testimonialsTitle" />
        <div v-if="testimonials.length > 1" class="testimonials__nav">
          <button type="button" :aria-label="copyHome.testimonialPrev" @click="move(-1)"><i class="fa-solid fa-arrow-left"></i></button>
          <button type="button" :aria-label="copyHome.testimonialNext" @click="move(1)"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
      <div ref="track" class="testimonials__track">
        <figure v-for="t in testimonials" :key="t._id" class="quote">
          <div v-if="t.photo" class="quote__media"><img :src="t.photo.url" :alt="t.name" loading="lazy" /></div>
          <div class="quote__body">
            <p v-if="t.rating" class="quote__stars" :aria-label="`${t.rating} de 5`">
              <i v-for="n in 5" :key="n" :class="n <= t.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
            </p>
            <blockquote class="quote__text">{{ t.text }}</blockquote>
            <figcaption class="quote__who">
              <strong>{{ t.name }}</strong>
              <span v-if="t.context">{{ t.context }}</span>
            </figcaption>
          </div>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.testimonials {
  padding-block: $space-section;

  &__inner {
    @include container;
  }

  &__head {
    @include flex(row, flex-end, space-between, 1rem);

    :deep(.heading) {
      flex: 1;
    }
  }

  &__nav {
    display: none;
    gap: 0.5rem;
    margin-bottom: $space-lg;

    @include from('md') {
      display: flex;
    }

    button {
      width: 2.8rem;
      height: 2.8rem;
      border-radius: 50%;
      border: 1px solid $line;
      @include transition;

      &:hover {
        border-color: $ink;
      }
    }
  }

  &__track {
    @include flex(row, stretch, flex-start, 1rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding-bottom: 0.5rem;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.quote {
  flex: 0 0 86%;
  scroll-snap-align: start;
  @include card;
  overflow: hidden;
  @include flex(column, stretch, flex-start);

  @include from('md') {
    flex-basis: calc(50% - 0.5rem);
    flex-direction: row;
  }

  @include from('lg') {
    flex-basis: calc(40% - 0.5rem);
  }

  &__media {
    flex: 0 0 auto;
    aspect-ratio: 4 / 3;
    background: $sand;

    @include from('md') {
      flex-basis: 40%;
      aspect-ratio: auto;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.8rem);
    padding: 1.4rem;
    flex: 1;
  }

  &__stars {
    color: $brand-orange;
    font-size: 0.75rem;
    @include flex(row, center, flex-start, 0.15rem);
  }

  &__text {
    color: $ink;
    font-size: $text-base;
    line-height: 1.6;
  }

  &__who {
    margin-top: auto;
    @include flex(column, flex-start, flex-start);
    font-size: $text-sm;

    span {
      color: $ink-muted;
    }
  }
}
</style>
