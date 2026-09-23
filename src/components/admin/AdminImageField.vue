<script setup lang="ts">
import { ref } from 'vue'
import { useAdminUpload } from '@/composables/useAdminUpload'
import { adminCopy } from '@/config/copy.admin'
import type { Image } from '@/types'
import type { UploadFolder } from '@/types/admin'

const props = withDefaults(
  defineProps<{
    modelValue: Image | null
    folder: UploadFolder
    /** wide = portada/hero, square = foto de persona, logo = fondo claro y contain. */
    shape?: 'wide' | 'square' | 'logo'
    buttonLabel?: string
  }>(),
  { shape: 'wide', buttonLabel: 'Subir imagen' },
)

const emit = defineEmits<{ 'update:modelValue': [value: Image | null] }>()

const { unavailable, uploadOne } = useAdminUpload()
const input = ref<HTMLInputElement | null>(null)
const progress = ref<number | null>(null)
const preview = ref('')

async function onPick(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  if (!file) return
  preview.value = URL.createObjectURL(file)
  progress.value = 0
  const result = await uploadOne(file, props.folder, 'image', (r) => (progress.value = Math.round(r * 100)))
  URL.revokeObjectURL(preview.value)
  preview.value = ''
  progress.value = null
  if (result) emit('update:modelValue', { url: result.url, publicId: result.publicId })
}
</script>

<template>
  <div class="imgfield" :class="`imgfield--${shape}`">
    <div class="imgfield__frame">
      <img v-if="preview || modelValue" :src="preview || modelValue?.url" alt="" />
      <i v-else class="fa-regular fa-image imgfield__ph"></i>
      <div v-if="progress !== null" class="imgfield__progress">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
    </div>
    <div class="imgfield__actions">
      <button type="button" class="btn btn--ghost" :disabled="progress !== null" @click="input?.click()">
        <i class="fa-solid fa-upload"></i> {{ modelValue ? 'Cambiar' : buttonLabel }}
      </button>
      <button v-if="modelValue" type="button" class="imgfield__remove" @click="emit('update:modelValue', null)">
        <i class="fa-solid fa-trash"></i> Quitar
      </button>
    </div>
    <p v-if="unavailable" class="imgfield__alert">{{ adminCopy.upload.unavailable }}</p>
    <input ref="input" type="file" accept="image/*" class="visually-hidden" @change="onPick" />
  </div>
</template>

<style scoped lang="scss">
.imgfield {
  @include flex(column, stretch, flex-start, 0.7rem);

  &__frame {
    position: relative;
    background: $sand;
    border: 1px solid $line;
    border-radius: $radius-sm;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    @include flex(row, center, center);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &--square &__frame {
    aspect-ratio: 1;
    max-width: 180px;
    border-radius: 50%;
  }

  &--logo &__frame {
    aspect-ratio: 3 / 2;
    max-width: 240px;
    background: $surface;

    img {
      object-fit: contain;
      padding: 1rem;
    }
  }

  &__ph {
    font-size: 2rem;
    color: $ink-muted;
  }

  &__progress {
    position: absolute;
    left: 10%;
    right: 10%;
    bottom: 12%;
    height: 6px;
    background: rgba($surface, 0.8);
    border-radius: $radius-pill;
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      background: $brand-blue;
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;

    .btn {
      padding: 0.7rem 1.2rem;
    }
  }

  &__remove {
    font-size: 0.85rem;
    font-weight: 600;
    color: $danger;
    padding: 0.6rem 0.8rem;
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
