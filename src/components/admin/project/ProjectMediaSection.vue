<script setup lang="ts">
import { ref } from 'vue'
import { useAdminUpload } from '@/composables/useAdminUpload'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import type { ProjectForm } from '@/types/admin'
import type { FormErrors } from '@/composables/useAdminEditor'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'
import AdminMediaGallery from '../AdminMediaGallery.vue'
import AdminVideoList from '../AdminVideoList.vue'

const props = defineProps<{ form: ProjectForm; errors: FormErrors; step: number }>()

const toast = useToastStore()
const { uploadOne } = useAdminUpload()
const input = ref<HTMLInputElement | null>(null)
const progress = ref<number | null>(null)

async function onPick(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  if (!file) return
  if (file.type !== 'application/pdf') return toast.error('El brochure debe ser un archivo PDF.')
  progress.value = 0
  const result = await uploadOne(file, 'brochures', 'raw', (r) => (progress.value = Math.round(r * 100)))
  progress.value = null
  if (result) props.form.brochure = { url: result.url, publicId: result.publicId, name: file.name }
}
</script>

<template>
  <AdminSection id="fotos" :step="step" title="Renders, videos y brochure" text="Los archivos se suben apenas los eliges; recuerda guardar al final.">
    <AdminField label="Renders y fotos" :help="adminCopy.help.renders" :error="errors.images">
      <AdminMediaGallery v-model="form.images" folder="projects" :max="25" :min="3" />
    </AdminField>

    <AdminField label="Videos" :help="adminCopy.help.videos">
      <AdminVideoList v-model="form.videos" folder="projects" />
    </AdminField>

    <AdminField label="Brochure (PDF)" :help="adminCopy.help.brochure">
      <div v-if="form.brochure" class="brochure">
        <i class="fa-solid fa-file-pdf brochure__icon"></i>
        <a :href="form.brochure.url" target="_blank" rel="noopener" class="brochure__name">
          {{ form.brochure.name || 'Brochure.pdf' }}
        </a>
        <button type="button" class="brochure__remove" @click="form.brochure = null">
          <i class="fa-solid fa-trash"></i> Quitar
        </button>
      </div>
      <button type="button" class="btn btn--ghost brochure__btn" :disabled="progress !== null" @click="input?.click()">
        <i :class="progress !== null ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-file-arrow-up'"></i>
        {{ progress !== null ? `Subiendo ${progress}%` : form.brochure ? 'Reemplazar brochure' : 'Subir brochure' }}
      </button>
      <input ref="input" type="file" accept="application/pdf" class="visually-hidden" @change="onPick" />
    </AdminField>
  </AdminSection>
</template>

<style scoped lang="scss">
.brochure {
  @include flex(row, center, flex-start, 0.7rem);
  flex-wrap: wrap;
  padding: 0.8rem 1rem;
  background: $sand;
  border-radius: $radius-sm;
  margin-bottom: 0.4rem;

  &__icon {
    color: $danger;
    font-size: 1.3rem;
  }

  &__name {
    flex: 1;
    font-weight: 600;
    text-decoration: underline;
    overflow-wrap: anywhere;
  }

  &__remove {
    color: $danger;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.4rem;
  }

  &__btn {
    align-self: flex-start;
  }
}
</style>
