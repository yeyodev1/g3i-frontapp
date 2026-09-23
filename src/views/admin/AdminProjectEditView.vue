<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminProjectForm } from '@/composables/useAdminProjectForm'
import { useAdminUnsaved } from '@/composables/useAdminUnsaved'
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import { adminCopy } from '@/config/copy.admin'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminFormNav from '@/components/admin/AdminFormNav.vue'
import AdminSaveBar from '@/components/admin/AdminSaveBar.vue'
import AdminSection from '@/components/admin/AdminSection.vue'
import AdminAmenityPicker from '@/components/admin/AdminAmenityPicker.vue'
import AdminLocationSection from '@/components/admin/AdminLocationSection.vue'
import AdminPublishSection from '@/components/admin/AdminPublishSection.vue'
import AdminStatusBadge from '@/components/admin/AdminStatusBadge.vue'
import ProjectBasicsSection from '@/components/admin/project/ProjectBasicsSection.vue'
import ProjectDetailsSection from '@/components/admin/project/ProjectDetailsSection.vue'
import ProjectMediaSection from '@/components/admin/project/ProjectMediaSection.vue'

const route = useRoute()
const catalog = useAdminCatalogStore()
const { form, errors, loading, saving, failed, isNew, dirty, init, submit } = useAdminProjectForm()

const savedStatus = ref('draft')

const sections = [
  { id: 'datos', label: 'Datos' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'fotos', label: 'Renders' },
  { id: 'detalles', label: 'Detalles' },
  { id: 'amenidades', label: 'Amenidades' },
  { id: 'publicacion', label: 'Publicación' },
]

const title = computed(() => (isNew.value ? 'Nuevo proyecto' : form.value.title || 'Editar proyecto'))

async function save() {
  if (await submit()) savedStatus.value = form.value.status
}

watch(
  () => route.params.id as string | undefined,
  async (id) => {
    catalog.load()
    await init(id)
    savedStatus.value = form.value.status
  },
  { immediate: true },
)

useAdminUnsaved(dirty)
</script>

<template>
  <div class="edit">
    <AdminPageHeader :title="title" :back="{ name: 'AdminProjects' }" back-label="Proyectos">
      <AdminStatusBadge v-if="!isNew" :status="savedStatus" group="project" />
      <RouterLink v-if="form._id" :to="{ name: 'AdminUnits', params: { id: form._id } }" class="btn btn--dark">
        <i class="fa-solid fa-table-list"></i> Inventario
      </RouterLink>
    </AdminPageHeader>

    <p v-if="loading" class="edit__loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando…</p>
    <p v-else-if="failed" class="edit__loading">{{ adminCopy.form.loadError }}</p>

    <form v-else class="edit__form" novalidate @submit.prevent="save">
      <AdminFormNav :sections="sections" />

      <ProjectBasicsSection :form="form" :errors="errors" :step="1" />
      <AdminLocationSection :form="form" :errors="errors" :step="2" />
      <ProjectMediaSection :form="form" :errors="errors" :step="3" />
      <ProjectDetailsSection :form="form" :step="4" />

      <AdminSection id="amenidades" :step="5" title="Amenidades del proyecto" :text="adminCopy.help.amenities">
        <AdminAmenityPicker v-model="form.amenities" scope="project" />
      </AdminSection>

      <AdminPublishSection :form="form" kind="project" :step="6" :saved-status="savedStatus" />

      <AdminSaveBar :dirty="dirty" :saving="saving" :is-new="isNew" @save="save" />
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
