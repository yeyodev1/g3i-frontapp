<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Testimonial } from '@/types'
import { copyHome } from '@/config/copy.home'

const props = defineProps<{ testimonials: Testimonial[] }>()
const t = copyHome.testimonials
const index = ref(0)

const current = computed(() => props.testimonials[index.value] ?? props.testimonials[0])
const total = computed(() => props.testimonials.length)

function move(dir: 1 | -1) {
  index.value = (index.value + dir + total.value) % total.value
}
</script>

<template>
  <section v-if="current" class="testimonials" data-reveal>
    <div class="testimonials__inner">
      <p class="testimonials__eyebrow">{{ t.eyebrow }}</p>
      <!-- aria-live: al cambiar de testimonio el lector de pantalla lo anuncia. -->
      <div class="testimonials__stage" aria-live="polite">
        <Transition name="quote" mode="out-in">
          <figure :key="current._id" class="quote">
            <blockquote class="quote__text">“{{ current.text }}”</blockquote>
            <figcaption class="quote__who">
              {{ current.name
              }}<span v-if="current.context" class="quote__role"> · {{ current.context }}</span>
            </figcaption>
          </figure>
        </Transition>
      </div>
      <div v-if="total > 1" class="testimonials__nav">
        <button type="button" :aria-label="t.prev" @click="move(-1)">
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
        <span class="testimonials__count">{{ index + 1 }} / {{ total }}</span>
        <button type="button" :aria-label="t.next" @click="move(1)">
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.testimonials {
  border-block: 1px solid $line;
  padding-block: clamp(4.5rem, 10vw, 7rem);

  &__inner {
    @include container(900px);
    text-align: center;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__stage {
    min-height: 16rem;
    @include flex(column, center, center);

    @include from('md') {
      min-height: 15rem;
    }
  }

  &__nav {
    @include flex(row, center, center, 1rem);
    margin-top: 2.25rem;

    button {
      width: 2.75rem;
      height: 2.75rem;
      border: 1px solid $line;
      border-radius: $radius-sm;
      color: $navy-900;
      font-size: 0.75rem;
      @include flex(row, center, center);
      @include transition;

      &:hover {
        border-color: $navy-900;
      }
    }
  }

  &__count {
    width: 3rem;
    font-size: $text-xs;
    letter-spacing: 0.1em;
    color: $ink-muted;
  }
}

.quote {
  margin-top: 1.75rem;

  &__text {
    font-family: $font-display;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(1.6rem, 1.2rem + 1.6vw, 2.25rem);
    line-height: 1.3;
    color: $ink;
    text-wrap: pretty;
  }

  &__who {
    margin-top: 1.5rem;
    @include caps(0.75rem, 0.22em);
    color: $navy-900;
  }

  &__role {
    color: $ink-muted;
  }
}

.quote-enter-active,
.quote-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s $ease;
}
.quote-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.quote-leave-to {
  opacity: 0;
}
</style>
