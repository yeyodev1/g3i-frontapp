<script setup lang="ts">
import { computed } from 'vue'
import type { Image } from '@/types'
import ImageLightbox from '@/components/common/ImageLightbox.vue'
import { useGallery } from '@/composables/useGallery'
import { copyProjects } from '@/config/copy.projects'

const props = defineProps<{ images: Image[]; title: string }>()
const total = computed(() => props.images.length)
const gallery = useGallery(total)
</script>

<template>
  <div class="mosaic">
    <p v-if="!images.length" class="mosaic__empty">{{ copyProjects.noImages }}</p>
    <div v-else class="mosaic__tiles">
      <button
        v-for="(img, i) in images"
        :key="img.url"
        type="button"
        class="mosaic__item"
        :class="{ 'mosaic__item--hero': i === 0 }"
        :aria-label="`${copyProjects.galleryOpen} ${i + 1}`"
        @click="gallery.show(i)"
      >
        <img :src="img.url" :alt="img.alt || title" :loading="i < 3 ? 'eager' : 'lazy'" />
      </button>
    </div>
    <ImageLightbox :images="images" :gallery="gallery" :title="title" />
  </div>
</template>

<style scoped lang="scss">
.mosaic {
  &__empty {
    padding: 2rem;
    text-align: center;
    color: $ink-muted;
    background: $sand;
    border-radius: $radius-md;
  }

  // Todas las imágenes visibles, en filas con flex-wrap que se reparten el ancho.
  &__tiles {
    @include flex(row, stretch, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__item {
    flex: 1 1 45%;
    height: 130px;
    overflow: hidden;
    border-radius: $radius-sm;
    background: $sand;

    @include from('md') {
      flex-basis: 22%;
      height: 180px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s $ease;
    }

    &:hover img {
      transform: scale(1.04);
    }

    &--hero {
      flex-basis: 100%;
      height: 240px;

      @include from('md') {
        flex-basis: 100%;
        height: 440px;
      }
    }
  }
}
</style>
