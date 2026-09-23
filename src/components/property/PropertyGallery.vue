<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Image } from '@/types'
import ImageLightbox from '@/components/common/ImageLightbox.vue'
import ShareButton from '@/components/common/ShareButton.vue'
import FavoriteButton from './FavoriteButton.vue'
import { useGallery } from '@/composables/useGallery'
import { copy } from '@/config/copy.public'
import { copyProperties } from '@/config/copy.properties'

const props = defineProps<{ images: Image[]; title: string; id: string; badge?: string; shareText?: string }>()

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
    <div class="gallery__main" @touchstart.passive="gallery.onTouchStart" @touchend.passive="gallery.onTouchEnd">
      <button v-if="current" type="button" class="gallery__open" :aria-label="copy.property.openGallery" @click="gallery.show(gallery.index.value)">
        <img :key="current.url" :src="current.url" :alt="current.alt || title" fetchpriority="high" />
      </button>
      <div v-else class="gallery__empty"><i class="fa-regular fa-image"></i></div>

      <div class="gallery__badges">
        <span class="gallery__badge">{{ copyProperties.sale }}</span>
        <span v-if="badge" class="gallery__badge gallery__badge--accent">{{ badge }}</span>
      </div>

      <div class="gallery__tools">
        <ShareButton :title="title" :text="shareText" compact class="gallery__share" />
        <FavoriteButton :id="id" />
      </div>

      <button v-if="total" type="button" class="gallery__count" @click="gallery.show(gallery.index.value)">
        <i class="fa-regular fa-images" aria-hidden="true"></i> {{ gallery.index.value + 1 }} / {{ total }}
        <span class="gallery__all">· {{ copyProperties.seeAllPhotos }}</span>
      </button>

      <div v-if="gallery.hasMany.value" class="gallery__arrows">
        <button type="button" class="gallery__nav" :aria-label="copy.common.prev" @click="gallery.prev()">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button type="button" class="gallery__nav" :aria-label="copy.common.next" @click="gallery.next()">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
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

<style scoped lang="scss" src="./PropertyGallery.scss"></style>
