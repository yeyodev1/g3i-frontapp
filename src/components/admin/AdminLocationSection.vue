<script setup lang="ts">
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import { adminCopy } from '@/config/copy.admin'
import type { GeoLocation } from '@/types'
import type { FormErrors } from '@/composables/useAdminEditor'
import AdminSection from './AdminSection.vue'
import AdminField from './AdminField.vue'
import AdminSwitch from './AdminSwitch.vue'
import AdminMapPicker from './AdminMapPicker.vue'

// Se muta el formulario del padre directamente: es el mismo objeto reactivo.
defineProps<{
  form: { sector: string; address: string; location: GeoLocation }
  errors: FormErrors
  step: number
}>()

const catalog = useAdminCatalogStore()
const radii = [200, 400, 700, 1000]
</script>

<template>
  <AdminSection id="ubicacion" :step="step" title="Ubicación" text="Dónde está y cómo se muestra en el mapa del sitio.">
    <div class="row">
      <AdminField label="Sector" for-id="loc-sector" :help="adminCopy.help.sector" :error="errors.sector" required>
        <select id="loc-sector" v-model="form.sector">
          <option value="" disabled>Elige un sector</option>
          <option v-for="s in catalog.sectors" :key="s.key" :value="s.key">{{ s.label }}</option>
        </select>
      </AdminField>
      <AdminField label="Ciudad">
        <input value="Quito" disabled />
      </AdminField>
    </div>

    <AdminField label="Dirección referencial" for-id="loc-address" :help="adminCopy.help.address">
      <input id="loc-address" v-model="form.address" maxlength="200" />
    </AdminField>

    <AdminField label="Ubicación en el mapa" :help="adminCopy.help.map">
      <AdminMapPicker v-model="form.location" />
    </AdminField>

    <AdminSwitch v-model="form.location.exact" label="Mostrar ubicación exacta" :help="adminCopy.help.exact" />

    <AdminField v-if="!form.location.exact" label="Tamaño del rango" :help="adminCopy.help.radius">
      <select v-model.number="form.location.radiusMeters">
        <option v-for="r in radii" :key="r" :value="r">{{ r }} metros</option>
      </select>
    </AdminField>
  </AdminSection>
</template>

<style scoped lang="scss">
.row {
  @include flex-cards(220px, 1rem);
}
</style>
