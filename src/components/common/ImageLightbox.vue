<script setup lang="ts">
import type { Image } from '@/types'
import type { useGallery } from '@/composables/useGallery'
import { copy } from '@/config/copy.public'

defineProps<{ images: Image[]; gallery: ReturnType<typeof useGallery>; title?: string }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="gallery.open.value && images.length"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Galería'"
        @touchstart.passive="gallery.onTouchStart"
        @touchend.passive="gallery.onTouchEnd"
        @click.self="gallery.close()"
      >
        <header class="lightbox__bar">
          <span class="lightbox__count">{{ gallery.index.value + 1 }} / {{ images.length }}</span>
          <button type="button" class="lightbox__close" :aria-label="copy.common.close" @click="gallery.close()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </header>

        <img
          :key="images[gallery.index.value]?.url"
          class="lightbox__img"
          :src="images[gallery.index.value]?.url"
          :alt="images[gallery.index.value]?.alt || title || ''"
          @click.stop
        />

        <template v-if="gallery.hasMany.value">
          <button type="button" class="lightbox__nav lightbox__nav--prev" :aria-label="copy.common.prev" @click.stop="gallery.prev()">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button type="button" class="lightbox__nav lightbox__nav--next" :aria-label="copy.common.next" @click.stop="gallery.next()">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba($navy-950, 0.96);
  @include flex(row, center, center);
  padding: 3.5rem 0.5rem;

  @include from('md') {
    padding: 4rem 5rem;
  }

  &__bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    @include flex(row, center, space-between);
    padding: 0.8rem 1rem;
    color: $on-inverse-muted;
    @include caps(0.72rem, 0.22em);
  }

  &__close {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    color: #fff;
    font-size: 1.3rem;

    &:hover {
      background: rgba(#fff, 0.1);
    }
  }

  &__img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: $radius-sm;
    user-select: none;
  }

  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    border: 1px solid rgba(#fff, 0.35);
    background: rgba(#fff, 0.06);
    color: #fff;
    @include transition(background);

    &:hover {
      background: rgba(#fff, 0.25);
    }

    &--prev {
      left: 0.6rem;
    }

    &--next {
      right: 0.6rem;
    }

    @include until('md') {
      top: auto;
      bottom: 0.8rem;
      transform: none;
    }
  }
}
</style>
