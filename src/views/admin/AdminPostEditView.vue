<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminPostForm } from '@/composables/useAdminPostForm'
import { useAdminUnsaved } from '@/composables/useAdminUnsaved'
import { adminCopy } from '@/config/copy.admin'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSection from '@/components/admin/AdminSection.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminImageField from '@/components/admin/AdminImageField.vue'
import AdminChoiceChips from '@/components/admin/AdminChoiceChips.vue'
import AdminSaveBar from '@/components/admin/AdminSaveBar.vue'
import PostContentEditor from '@/components/admin/blog/PostContentEditor.vue'

const route = useRoute()
const { form, errors, loading, saving, failed, isNew, dirty, init, submit } = useAdminPostForm()

const statuses = [
  { key: 'draft', label: 'Borrador', help: 'Solo tú la ves.' },
  { key: 'published', label: 'Publicada', help: 'Visible en el blog del sitio.' },
]

const title = computed(() => (isNew.value ? 'Nueva entrada' : form.value.title || 'Editar entrada'))

watch(
  () => route.params.id as string | undefined,
  (id) => init(id),
  { immediate: true },
)

useAdminUnsaved(dirty)
</script>

<template>
  <div class="edit">
    <AdminPageHeader :title="title" :back="{ name: 'AdminPosts' }" back-label="Blog" />

    <p v-if="loading" class="edit__loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando…</p>
    <p v-else-if="failed" class="edit__loading">{{ adminCopy.form.loadError }}</p>

    <form v-else class="edit__form" novalidate @submit.prevent="submit">
      <AdminSection title="Entrada">
        <AdminField label="Título" for-id="post-title" :error="errors.title" required>
          <input id="post-title" v-model="form.title" maxlength="160" />
        </AdminField>
        <AdminField label="Extracto" for-id="post-excerpt" help="Una o dos frases que se ven en el listado del blog.">
          <textarea id="post-excerpt" v-model="form.excerpt" rows="3" maxlength="300"></textarea>
        </AdminField>
        <AdminField label="Portada" help="Imagen horizontal que encabeza la entrada.">
          <AdminImageField v-model="form.cover" folder="posts" button-label="Subir portada" />
        </AdminField>
      </AdminSection>

      <AdminSection title="Contenido">
        <AdminField :error="errors.content">
          <PostContentEditor v-model="form.content" />
        </AdminField>
      </AdminSection>

      <AdminSection title="Publicación">
        <AdminChoiceChips v-model="form.status" :options="statuses" />
      </AdminSection>

      <AdminSaveBar :dirty="dirty" :saving="saving" :is-new="isNew" @save="submit" />
    </form>
  </div>
</template>

<style scoped lang="scss">
.edit {
  max-width: 880px;

  &__form {
    @include flex(column, stretch, flex-start, 1.2rem);
  }

  &__loading {
    color: $ink-soft;
    padding: 2rem 0;
  }
}
</style>
