<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import AdminSection from './AdminSection.vue'
import AdminField from './AdminField.vue'
import AdminSwitch from './AdminSwitch.vue'
import AdminChoiceChips from './AdminChoiceChips.vue'

const props = defineProps<{
  form: { status: string; isFeatured: boolean; slug?: string; _id?: string }
  kind: 'property' | 'project'
  step: number
  /** Estado guardado: la vista previa depende de lo guardado, no de lo editado. */
  savedStatus: string
}>()

const router = useRouter()
const toast = useToastStore()

const options = computed(() =>
  Object.entries(adminCopy.status[props.kind]).map(([key, label]) => ({
    key,
    label,
    help: adminCopy.statusHelp[key],
  })),
)

const isDraft = computed(() => props.savedStatus !== 'published')

function preview() {
  if (!props.form.slug) return toast.info(adminCopy.form.previewNeedsSave)
  if (isDraft.value) toast.info(adminCopy.form.previewDraft)
  const name = props.kind === 'property' ? 'PropertyDetail' : 'ProjectDetail'
  window.open(router.resolve({ name, params: { slug: props.form.slug } }).href, '_blank')
}
</script>

<template>
  <AdminSection id="publicacion" :step="step" title="Publicación" text="Decide si el público la ve y si aparece destacada.">
    <AdminField label="Estado">
      <AdminChoiceChips v-model="form.status" :options="options" />
    </AdminField>

    <AdminSwitch v-model="form.isFeatured" label="Destacar en la página de inicio" :help="adminCopy.help.featured" />

    <div class="preview">
      <button type="button" class="btn btn--ghost" @click="preview">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> {{ adminCopy.form.preview }}
      </button>
      <p v-if="form.slug && isDraft" class="preview__note">
        <i class="fa-solid fa-eye-slash"></i> {{ adminCopy.form.previewDraft }}
      </p>
    </div>
  </AdminSection>
</template>

<style scoped lang="scss">
.preview {
  @include flex(column, flex-start, flex-start, 0.5rem);

  &__note {
    font-size: 0.8rem;
    color: darken($warning, 22%);
    background: $warning-bg;
    padding: 0.6rem 0.8rem;
    border-radius: $radius-sm;
  }
}
</style>
