<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminPropertyForm } from '@/composables/useAdminPropertyForm'
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
import PropertyBasicsSection from '@/components/admin/property/PropertyBasicsSection.vue'
import PropertyMediaSection from '@/components/admin/property/PropertyMediaSection.vue'
import PropertyDetailsSection from '@/components/admin/property/PropertyDetailsSection.vue'
import PropertyPriceSection from '@/components/admin/property/PropertyPriceSection.vue'

const route = useRoute()
const catalog = useAdminCatalogStore()
const { form, errors, loading, saving, failed, isNew, dirty, isLand, init, submit } = useAdminPropertyForm()

// Estado tal como quedó guardado: decide si la vista previa es pública.
const savedStatus = ref('draft')

const sections = [
  { id: 'datos', label: 'Datos' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'fotos', label: 'Fotos' },
  { id: 'detalles', label: 'Detalles' },
  { id: 'amenidades', label: 'Características' },
  { id: 'precio', label: 'Precio' },
  { id: 'publicacion', label: 'Publicación' },
]

const title = computed(() => (isNew.value ? 'Nueva propiedad' : form.value.title || 'Editar propiedad'))

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
    <AdminPageHeader :title="title" :back="{ name: 'AdminProperties' }" back-label="Propiedades">
      <AdminStatusBadge v-if="!isNew" :status="savedStatus" group="property" />
    </AdminPageHeader>

    <p v-if="loading" class="edit__loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando…</p>
    <p v-else-if="failed" class="edit__loading">{{ adminCopy.form.loadError }}</p>

    <form v-else class="edit__form" novalidate @submit.prevent="save">
      <AdminFormNav :sections="sections" />

      <PropertyBasicsSection :form="form" :errors="errors" :step="1" />
      <AdminLocationSection :form="form" :errors="errors" :step="2" />
      <PropertyMediaSection :form="form" :errors="errors" :step="3" />
      <PropertyDetailsSection :form="form" :is-land="isLand" :step="4" />

      <AdminSection id="amenidades" :step="5" title="Características y amenidades" :text="adminCopy.help.amenities">
        <AdminAmenityPicker v-model="form.amenities" scope="property" />
      </AdminSection>

      <PropertyPriceSection :form="form" :errors="errors" :step="6" />
      <AdminPublishSection :form="form" kind="property" :step="7" :saved-status="savedStatus" />

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
