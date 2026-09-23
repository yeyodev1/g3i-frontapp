<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Image } from '@/types'
import ImageLightbox from '@/components/common/ImageLightbox.vue'
import { useGallery } from '@/composables/useGallery'
import { copy } from '@/config/copy.public'
import { copyProperties } from '@/config/copy.properties'

const props = defineProps<{ images: Image[]; title: string }>()

const total = computed(() => props.images.length)
const gallery = useGallery(total)
const current = computed(() => props.images[gallery.index.value])
const thumbs = ref<HTMLElement | null>(null)

// La miniatura activa siempre queda a la vista en la tira horizontal.
watch(gallery.index, async (i) => {
  await nextTick()
  const el = thumbs.value?.children[i] as HTMLElement | undefined
  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
})
</script>

<template>
  <section class="gallery" :aria-label="copy.property.gallery">
    <div
      class="gallery__main"
      @touchstart.passive="gallery.onTouchStart"
      @touchend.passive="gallery.onTouchEnd"
    >
      <button v-if="current" type="button" class="gallery__open" :aria-label="copy.property.openGallery" @click="gallery.show(gallery.index.value)">
        <img :src="current.url" :alt="current.alt || title" fetchpriority="high" />
      </button>
      <div v-else class="gallery__empty"><i class="fa-regular fa-image"></i></div>

      <template v-if="gallery.hasMany.value">
        <button type="button" class="gallery__nav gallery__nav--prev" :aria-label="copy.common.prev" @click="gallery.prev()">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button type="button" class="gallery__nav gallery__nav--next" :aria-label="copy.common.next" @click="gallery.next()">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </template>

      <button v-if="total" type="button" class="gallery__count" @click="gallery.show(gallery.index.value)">
        <i class="fa-regular fa-images"></i> {{ gallery.index.value + 1 }} / {{ total }}
      </button>
    </div>

    <div v-if="gallery.hasMany.value" ref="thumbs" class="gallery__thumbs">
      <button
        v-for="(img, i) in images"
        :key="img.url"
        type="button"
        class="gallery__thumb"
        :class="{ 'is-active': i === gallery.index.value }"
        :aria-label="copyProperties.photoOf(i + 1, total)"
        :aria-current="i === gallery.index.value ? 'true' : undefined"
        @click="gallery.go(i)"
      >
        <img :src="img.url" alt="" loading="lazy" />
      </button>
    </div>

    <ImageLightbox :images="images" :gallery="gallery" :title="title" />
  </section>
</template>

<style scoped lang="scss">
.gallery {
  &__main {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: $radius-md;
    overflow: hidden;
    background: $sand;

    @include from('md') {
      aspect-ratio: 16 / 9;
    }
  }

  &__open {
    display: block;
    width: 100%;
    height: 100%;
    cursor: zoom-in;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__empty {
    @include flex(row, center, center);
    height: 100%;
    font-size: 2rem;
    color: $ink-muted;
  }

  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    @include flex(row, center, center);
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    background: rgba($surface, 0.92);
    color: $ink;
    box-shadow: $shadow-sm;
    @include transition(background);

    &:hover {
      background: $surface;
    }

    &--prev {
      left: 0.75rem;
    }

    &--next {
      right: 0.75rem;
    }
  }

  &__count {
    position: absolute;
    right: 0.75rem;
    bottom: 0.75rem;
    @include flex(row, center, center, 0.4rem);
    padding: 0.35rem 0.8rem;
    border-radius: $radius-pill;
    background: rgba($ink, 0.72);
    color: $surface;
    font-size: $text-xs;
    font-weight: 600;
  }

  &__thumbs {
    @include flex(row, stretch, flex-start, 0.5rem);
    margin-top: 0.6rem;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: thin;
    padding-bottom: 0.3rem;
  }

  &__thumb {
    flex: 0 0 5.5rem;
    aspect-ratio: 4 / 3;
    border-radius: 8px;
    overflow: hidden;
    opacity: 0.6;
    scroll-snap-align: start;
    outline: 2px solid transparent;
    outline-offset: -2px;
    @include transition;

    @include from('md') {
      flex-basis: 7rem;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover,
    &.is-active {
      opacity: 1;
    }

    &.is-active {
      outline-color: $ink;
    }
  }
}
</style>
