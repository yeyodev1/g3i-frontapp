<script setup lang="ts">
import { computed } from 'vue'
import type { Image } from '@/types'
import ImageLightbox from '@/components/common/ImageLightbox.vue'
import { useGallery } from '@/composables/useGallery'
import { copyProjects } from '@/config/copy.projects'

// Todas las imágenes visibles: una grande + cuatro a su lado, y el resto en filas debajo.
const props = defineProps<{ images: Image[]; title: string }>()
const gallery = useGallery(computed(() => props.images.length))

const lead = computed(() => props.images[0])
const quad = computed(() => props.images.slice(1, 5))
const rest = computed(() => props.images.slice(5))
</script>

<template>
  <div class="mosaic">
    <p v-if="!lead" class="mosaic__empty">{{ copyProjects.noImages }}</p>
    <template v-else>
      <div class="mosaic__top">
        <button
          type="button"
          class="mosaic__item mosaic__item--lead"
          :aria-label="`${copyProjects.galleryOpen} 1`"
          @click="gallery.show(0)"
        >
          <img :src="lead.url" :alt="lead.alt || title" />
        </button>
        <div v-if="quad.length" class="mosaic__quad">
          <button
            v-for="(img, i) in quad"
            :key="img.url"
            type="button"
            class="mosaic__item"
            :aria-label="`${copyProjects.galleryOpen} ${i + 2}`"
            @click="gallery.show(i + 1)"
          >
            <img :src="img.url" :alt="img.alt || title" loading="lazy" />
          </button>
        </div>
      </div>
      <div v-if="rest.length" class="mosaic__rest">
        <button
          v-for="(img, i) in rest"
          :key="img.url"
          type="button"
          class="mosaic__item"
          :aria-label="`${copyProjects.galleryOpen} ${i + 6}`"
          @click="gallery.show(i + 5)"
        >
          <img :src="img.url" :alt="img.alt || title" loading="lazy" />
        </button>
      </div>
    </template>
    <ImageLightbox :images="images" :gallery="gallery" :title="title" />
  </div>
</template>

<style scoped lang="scss">
$gap: 8px;

.mosaic {
  &__empty {
    padding: 2.5rem;
    text-align: center;
    font-weight: 300;
    color: $ink-soft;
    background: $sand;
  }

  &__top {
    @include flex(column, stretch, flex-start, $gap);

    @include from('md') {
      flex-direction: row;
    }
  }

  &__quad,
  &__rest {
    @include flex(row, stretch, flex-start, $gap);
    flex-wrap: wrap;
  }

  // La columna de cuatro iguala la altura de la grande; con 1 o 3 fotos las filas se estiran.
  &__quad {
    flex: 1 1 50%;
    min-width: 0;

    @include from('md') {
      height: calc(360px + #{$gap});
      align-content: stretch;
    }

    @include from('lg') {
      height: calc(380px + #{$gap});
    }
  }

  &__rest {
    margin-top: $gap;
  }

  &__item {
    flex: 1 1 calc(50% - #{$gap});
    height: 130px;
    overflow: hidden;
    background: $gray-200;
    cursor: zoom-in;

    @include from('md') {
      height: 180px;
    }

    @include from('lg') {
      height: 190px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s $ease;
    }

    &:hover img {
      transform: scale(1.04);
    }

    &--lead {
      flex: 1 1 100%;
      height: 260px;

      @include from('md') {
        flex: 1 1 50%;
        height: calc(360px + #{$gap});
      }

      @include from('lg') {
        height: calc(380px + #{$gap});
      }
    }
  }

  &__quad &__item {
    @include from('md') {
      height: auto;
    }
  }

  &__rest &__item {
    @include from('md') {
      flex-basis: calc(25% - #{$gap});
    }
  }
}
</style>
