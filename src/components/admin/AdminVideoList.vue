<script setup lang="ts">
import { ref } from 'vue'
import { useAdminUpload } from '@/composables/useAdminUpload'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import type { Video } from '@/types'
import type { UploadFolder } from '@/types/admin'

const props = defineProps<{ modelValue: Video[]; folder: UploadFolder }>()
const emit = defineEmits<{ 'update:modelValue': [value: Video[]] }>()

const toast = useToastStore()
const { unavailable, uploadOne } = useAdminUpload()
const input = ref<HTMLInputElement | null>(null)
const link = ref('')
const progress = ref<number | null>(null)

function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return match?.[1] ?? null
}

function addLink() {
  const url = link.value.trim()
  if (!youtubeId(url)) return toast.error('Ese enlace no parece de YouTube. Cópialo desde el botón "Compartir".')
  emit('update:modelValue', [...props.modelValue, { url, publicId: '' }])
  link.value = ''
}

async function onPick(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  if (!file) return
  progress.value = 0
  const result = await uploadOne(file, props.folder, 'video', (r) => (progress.value = Math.round(r * 100)))
  progress.value = null
  if (result) emit('update:modelValue', [...props.modelValue, { url: result.url, publicId: result.publicId }])
}

function remove(index: number) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}
</script>

<template>
  <div class="videos">
    <ul v-if="modelValue.length" class="videos__list">
      <li v-for="(video, i) in modelValue" :key="video.url" class="videos__item">
        <img v-if="youtubeId(video.url)" :src="`https://i.ytimg.com/vi/${youtubeId(video.url)}/mqdefault.jpg`" alt="" />
        <video v-else :src="video.url" preload="metadata" muted></video>
        <span class="videos__tag">
          <i :class="youtubeId(video.url) ? 'fa-brands fa-youtube' : 'fa-solid fa-film'"></i>
          {{ youtubeId(video.url) ? 'YouTube' : 'Video' }}
        </span>
        <button type="button" class="videos__del" aria-label="Quitar video" @click="remove(i)">
          <i class="fa-solid fa-trash"></i>
        </button>
      </li>
    </ul>

    <div class="videos__add">
      <button type="button" class="btn btn--ghost" :disabled="progress !== null" @click="input?.click()">
        <i :class="progress !== null ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-video'"></i>
        {{ progress !== null ? `Subiendo ${progress}%` : 'Subir video' }}
      </button>
      <div class="videos__link">
        <input v-model="link" type="url" placeholder="O pega un enlace de YouTube" @keydown.enter.prevent="addLink" />
        <button type="button" class="btn btn--dark" :disabled="!link" @click="addLink">Agregar</button>
      </div>
    </div>
    <p v-if="unavailable" class="videos__alert">{{ adminCopy.upload.unavailable }}</p>
    <input ref="input" type="file" accept="video/*" class="visually-hidden" @change="onPick" />
  </div>
</template>

<style scoped lang="scss">
.videos {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__list {
    list-style: none;
    @include flex(row, stretch, flex-start, 0.7rem);
    flex-wrap: wrap;
  }

  &__item {
    position: relative;
    flex: 0 0 calc(50% - 0.35rem);
    aspect-ratio: 16 / 9;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $ink;

    @include from('md') {
      flex-basis: calc(33.333% - 0.47rem);
    }

    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__tag {
    position: absolute;
    left: 0.4rem;
    top: 0.4rem;
    font-size: 0.7rem;
    font-weight: 600;
    background: rgba($surface, 0.92);
    padding: 0.15rem 0.5rem;
    border-radius: $radius-pill;
  }

  &__del {
    position: absolute;
    right: 0.4rem;
    bottom: 0.4rem;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba($surface, 0.92);
    color: $danger;
  }

  &__add {
    @include flex(column, stretch, flex-start, 0.6rem);

    @include from('md') {
      flex-direction: row;
      align-items: center;
    }
  }

  &__link {
    flex: 1;
    @include flex(row, center, flex-start, 0.5rem);

    .btn {
      flex: none;
      padding: 0.75rem 1.1rem;
    }
  }

  &__alert {
    font-size: 0.8rem;
    color: darken($warning, 25%);
    background: $warning-bg;
    padding: 0.6rem 0.8rem;
    border-radius: $radius-sm;
  }
}
</style>
