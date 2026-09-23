<script setup lang="ts">
import { computed } from 'vue'
import type { Image, Video } from '@/types'
import VideoEmbed from '@/components/common/VideoEmbed.vue'
import ImageLightbox from '@/components/common/ImageLightbox.vue'
import { useGallery } from '@/composables/useGallery'
import { copy } from '@/config/copy.public'

const props = defineProps<{ videos: Video[]; floorPlans: Image[]; title: string }>()
const plans = useGallery(computed(() => props.floorPlans.length))
</script>

<template>
  <div class="media">
    <section v-if="videos.length" class="media__block">
      <h2 class="media__title">{{ copy.property.videos }}</h2>
      <div class="media__videos">
        <VideoEmbed v-for="video in videos" :key="video.url" :url="video.url" :title="title" />
      </div>
    </section>

    <section v-if="floorPlans.length" class="media__block">
      <h2 class="media__title">{{ copy.property.floorPlans }}</h2>
      <div class="media__plans">
        <button v-for="(plan, i) in floorPlans" :key="plan.url" type="button" class="media__plan" @click="plans.show(i)">
          <img :src="plan.url" :alt="plan.alt || `${copy.property.floorPlans} ${i + 1}`" loading="lazy" />
          <span><i class="fa-solid fa-magnifying-glass-plus"></i></span>
        </button>
      </div>
      <ImageLightbox :images="floorPlans" :gallery="plans" :title="`${copy.property.floorPlans} · ${title}`" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.media {
  @include flex(column, stretch, flex-start, $space-lg);

  &:empty {
    display: none;
  }

  // Mismo encabezado que las demás secciones de la ficha (estilo pestaña).
  &__title {
    @include caps(0.75rem, 0.22em);
    color: $ink;
    padding-bottom: 0.875rem;
    margin-bottom: 1.75rem;
    border-bottom: 1px solid $line;
    background: linear-gradient($ember-500, $ember-500) left bottom / 3rem 1px no-repeat;
  }

  &__videos {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__plans {
    @include flex-cards(220px, 0.8rem);
  }

  &__plan {
    position: relative;
    aspect-ratio: 4 / 3;
    border: 1px solid $line;
    border-radius: $radius-sm;
    @include transition(box-shadow);

    &:hover {
      box-shadow: $shadow-md;
    }

    overflow: hidden;
    background: $surface;
    cursor: zoom-in;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 0.5rem;
    }

    span {
      position: absolute;
      right: 0.5rem;
      bottom: 0.5rem;
      @include flex(row, center, center);
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: rgba($navy-900, 0.8);
      color: $surface;
      font-size: 0.8rem;
    }
  }
}
</style>
