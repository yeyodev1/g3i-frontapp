<script setup lang="ts">
import { ref } from 'vue'
import { useAdminGalleryQueue } from '@/composables/useAdminGalleryQueue'
import { adminCopy } from '@/config/copy.admin'
import type { Image } from '@/types'
import type { UploadFolder } from '@/types/admin'

const props = withDefaults(
  defineProps<{
    modelValue: Image[]
    folder: UploadFolder
    max?: number
    min?: number
    /** Si es false no hay "principal" (planos, por ejemplo). */
    withMain?: boolean
    dropText?: string
  }>(),
  { max: 25, min: 0, withMain: true, dropText: '' },
)

const emit = defineEmits<{ 'update:modelValue': [value: Image[]] }>()

const { pending, room, unavailable, addFiles } = useAdminGalleryQueue({
  images: () => props.modelValue,
  folder: () => props.folder,
  max: () => props.max,
  onAdd: (next) => emit('update:modelValue', next),
})

const over = ref(false)
const dragIndex = ref<number | null>(null)
const input = ref<HTMLInputElement | null>(null)

function onPick(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) addFiles(target.files)
  target.value = ''
}

function onDrop(event: DragEvent) {
  over.value = false
  if (event.dataTransfer?.files?.length) addFiles(event.dataTransfer.files)
}

function move(from: number, to: number) {
  if (to < 0 || to >= props.modelValue.length || from === to) return
  const next = [...props.modelValue]
  next.splice(to, 0, ...next.splice(from, 1))
  emit('update:modelValue', next)
}

function remove(index: number) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}

function onItemDrop(index: number) {
  if (dragIndex.value !== null) move(dragIndex.value, index)
  dragIndex.value = null
}
</script>

<template>
  <div class="gallery">
    <p v-if="unavailable" class="gallery__alert" role="alert">
      <i class="fa-solid fa-triangle-exclamation"></i> {{ adminCopy.upload.unavailable }}
    </p>

    <button
      type="button"
      class="gallery__drop"
      :class="{ 'gallery__drop--over': over }"
      :disabled="room <= 0"
      @click="input?.click()"
      @dragover.prevent="over = true"
      @dragleave.prevent="over = false"
      @drop.prevent="onDrop"
    >
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <strong>{{ room > 0 ? dropText || adminCopy.upload.drop : adminCopy.upload.maxReached }}</strong>
      <span>{{ adminCopy.upload.dropHint }}</span>
    </button>
    <input ref="input" type="file" accept="image/*" multiple class="visually-hidden" @change="onPick" />

    <p class="gallery__count">
      {{ modelValue.length }} de {{ max }}
      <span v-if="min && modelValue.length < min" class="gallery__warn">· {{ adminCopy.upload.minRecommended }}</span>
    </p>

    <ul v-if="modelValue.length || pending.length" class="gallery__list">
      <li
        v-for="(img, i) in modelValue"
        :key="img.publicId || img.url"
        class="gallery__item"
        draggable="true"
        @dragstart="dragIndex = i"
        @dragover.prevent
        @drop.prevent="onItemDrop(i)"
      >
        <img :src="img.url" :alt="`Foto ${i + 1}`" loading="lazy" />
        <span v-if="withMain && i === 0" class="gallery__main"><i class="fa-solid fa-star"></i> {{ adminCopy.upload.main }}</span>
        <div class="gallery__tools">
          <button type="button" :disabled="i === 0" aria-label="Mover antes" @click="move(i, i - 1)">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button" :disabled="i === modelValue.length - 1" aria-label="Mover después" @click="move(i, i + 1)">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button v-if="withMain && i > 0" type="button" :title="adminCopy.upload.makeMain" :aria-label="adminCopy.upload.makeMain" @click="move(i, 0)">
            <i class="fa-regular fa-star"></i>
          </button>
          <button type="button" class="gallery__del" aria-label="Eliminar foto" @click="remove(i)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </li>
      <li v-for="p in pending" :key="p.id" class="gallery__item gallery__item--pending">
        <img :src="p.preview" :alt="p.name" />
        <div class="gallery__progress"><span :style="{ width: `${p.progress}%` }"></span></div>
        <span class="gallery__pct">{{ p.progress }}%</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.gallery {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__alert {
    @include flex(row, flex-start, flex-start, 0.6rem);
    background: $warning-bg;
    color: darken($warning, 25%);
    font-size: 0.85rem;
    padding: 0.8rem 1rem;
    border-radius: $radius-sm;
  }

  &__drop {
    @include flex(column, center, center, 0.35rem);
    text-align: center;
    padding: 1.6rem 1rem;
    border: 2px dashed $line;
    border-radius: $radius-md;
    background: $sand;
    @include transition(border-color);

    i {
      font-size: 1.8rem;
      color: $brand-blue;
    }

    span {
      font-size: 0.8rem;
      color: $ink-muted;
    }

    &:hover,
    &--over {
      border-color: $ink;
    }
  }

  &__count {
    font-size: 0.82rem;
    color: $ink-soft;
  }

  &__warn {
    color: darken($warning, 18%);
  }

  &__list {
    list-style: none;
    @include flex(row, stretch, flex-start, 0.7rem);
    flex-wrap: wrap;
  }

  &__item {
    position: relative;
    flex: 0 0 calc(50% - 0.35rem);
    aspect-ratio: 4 / 3;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $sand;
    cursor: grab;

    @include from('sm') {
      flex-basis: calc(33.333% - 0.47rem);
    }

    @include from('lg') {
      flex-basis: calc(25% - 0.53rem);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--pending img {
      opacity: 0.45;
    }
  }

  &__main {
    position: absolute;
    top: 0.4rem;
    left: 0.4rem;
    background: $ink;
    color: $surface;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: $radius-pill;
  }

  &__tools {
    position: absolute;
    inset: auto 0 0 0;
    @include flex(row, center, space-between, 0.2rem);
    padding: 0.3rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));

    button {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba($surface, 0.92);
      color: $ink;
      font-size: 0.78rem;

      &:disabled {
        opacity: 0.35;
      }
    }
  }

  &__del {
    color: $danger !important;
  }

  &__progress {
    position: absolute;
    left: 0.6rem;
    right: 0.6rem;
    bottom: 0.7rem;
    height: 6px;
    background: rgba($surface, 0.7);
    border-radius: $radius-pill;
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      background: $brand-blue;
      transition: width 0.2s linear;
    }
  }

  &__pct {
    position: absolute;
    inset: 0;
    @include flex(row, center, center);
    font-weight: 700;
    color: $ink;
  }
}
</style>
