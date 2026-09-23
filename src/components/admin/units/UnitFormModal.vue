<script setup lang="ts">
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import type { UnitForm } from '@/types/admin'
import type { FormErrors } from '@/composables/useAdminEditor'
import AdminModal from '../AdminModal.vue'
import AdminField from '../AdminField.vue'
import AdminNumber from '../AdminNumber.vue'
import AdminImageField from '../AdminImageField.vue'
import AdminMediaGallery from '../AdminMediaGallery.vue'
import AdminChoiceChips from '../AdminChoiceChips.vue'

const props = defineProps<{ open: boolean; form: UnitForm; errors: FormErrors; saving: boolean }>()
const emit = defineEmits<{ close: []; save: [] }>()

const catalog = useAdminCatalogStore()
const statuses = [
  { key: 'available', label: 'Disponible' },
  { key: 'reserved', label: 'Reservada' },
  { key: 'sold', label: 'Vendida' },
]

function setPrice(value: number | null) {
  props.form.price = value ?? 0
}
</script>

<template>
  <AdminModal
    :open="open"
    :title="form._id ? `Editar ${form.name || 'unidad'}` : 'Nueva unidad'"
    :saving="saving"
    @close="emit('close')"
    @save="emit('save')"
  >
    <div class="row">
      <AdminField label="Nombre" for-id="u-name" :error="errors.name" required>
        <input id="u-name" v-model="form.name" placeholder="Unidad 402" maxlength="60" />
      </AdminField>
      <AdminField label="Piso" for-id="u-floor">
        <input id="u-floor" v-model="form.floor" placeholder="4" maxlength="20" />
      </AdminField>
    </div>

    <div class="row">
      <AdminField label="Tipo" for-id="u-type">
        <select id="u-type" v-model="form.type">
          <option v-for="t in catalog.propertyTypes" :key="t.key" :value="t.key">{{ t.label }}</option>
        </select>
      </AdminField>
      <AdminField label="Precio" for-id="u-price" :error="errors.price" required>
        <AdminNumber id="u-price" :model-value="form.price || null" suffix="USD" :step="1" @update:model-value="setPrice" />
      </AdminField>
    </div>

    <AdminField label="Estado">
      <AdminChoiceChips v-model="form.status" :options="statuses" />
    </AdminField>

    <div class="row row--small">
      <AdminField label="Dormitorios"><AdminNumber v-model="form.bedrooms" :step="1" /></AdminField>
      <AdminField label="Baños"><AdminNumber v-model="form.bathrooms" :step="1" /></AdminField>
      <AdminField label="Parqueos"><AdminNumber v-model="form.parking" :step="1" /></AdminField>
      <AdminField label="Bodegas"><AdminNumber v-model="form.storageRooms" :step="1" /></AdminField>
    </div>

    <div class="row row--small">
      <AdminField label="Construidos"><AdminNumber v-model="form.builtM2" suffix="m²" /></AdminField>
      <AdminField label="Balcón"><AdminNumber v-model="form.balconyM2" suffix="m²" /></AdminField>
      <AdminField label="Terraza"><AdminNumber v-model="form.terraceM2" suffix="m²" /></AdminField>
      <AdminField label="Jardín"><AdminNumber v-model="form.gardenM2" suffix="m²" /></AdminField>
    </div>

    <AdminField label="Descripción" for-id="u-desc" help="Opcional. Detalles propios de esta unidad.">
      <textarea id="u-desc" v-model="form.description" rows="4"></textarea>
    </AdminField>

    <AdminField label="Plano" help="Imagen del plano de la unidad.">
      <AdminImageField v-model="form.floorPlan" folder="projects" button-label="Subir plano" />
    </AdminField>

    <AdminField label="Fotos" help="Opcional. La primera es la principal.">
      <AdminMediaGallery v-model="form.images" folder="projects" :max="15" />
    </AdminField>
  </AdminModal>
</template>

<style scoped lang="scss">
.row {
  @include flex-cards(200px, 1rem);

  &--small {
    @include flex-cards(120px, 0.8rem);
  }
}
</style>
