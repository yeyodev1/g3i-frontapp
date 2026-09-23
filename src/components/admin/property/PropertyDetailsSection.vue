<script setup lang="ts">
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import { adminCopy } from '@/config/copy.admin'
import type { PropertyForm } from '@/types/admin'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'
import AdminNumber from '../AdminNumber.vue'
import AdminSwitch from '../AdminSwitch.vue'

defineProps<{ form: PropertyForm; isLand: boolean; step: number }>()

const catalog = useAdminCatalogStore()
</script>

<template>
  <AdminSection
    id="detalles"
    :step="step"
    title="Superficies y detalles"
    text="Deja vacío lo que no aplique: en el sitio solo se muestra lo que tenga un valor."
  >
    <template v-if="isLand">
      <div class="row">
        <AdminField label="Metros del terreno" for-id="d-total">
          <AdminNumber id="d-total" v-model="form.totalM2" suffix="m²" />
        </AdminField>
        <AdminField label="Metros de frente" for-id="d-front">
          <AdminNumber id="d-front" v-model="form.frontMeters" suffix="m" />
        </AdminField>
        <AdminField label="Metros de fondo" for-id="d-depth">
          <AdminNumber id="d-depth" v-model="form.depthMeters" suffix="m" />
        </AdminField>
        <AdminField label="Pisos construibles" for-id="d-bfloors">
          <AdminNumber id="d-bfloors" v-model="form.buildableFloors" :step="1" />
        </AdminField>
      </div>
    </template>

    <template v-else>
      <div class="row">
        <AdminField label="Metros totales / terreno" for-id="d-total">
          <AdminNumber id="d-total" v-model="form.totalM2" suffix="m²" />
        </AdminField>
        <AdminField label="Metros construidos" for-id="d-built">
          <AdminNumber id="d-built" v-model="form.builtM2" suffix="m²" />
        </AdminField>
        <AdminField label="Jardín / área exterior" for-id="d-garden">
          <AdminNumber id="d-garden" v-model="form.gardenM2" suffix="m²" />
        </AdminField>
      </div>

      <div class="row">
        <AdminField label="Estado del inmueble" for-id="d-cond">
          <select id="d-cond" v-model="form.condition">
            <option v-for="c in catalog.conditions" :key="c.key" :value="c.key">{{ c.label }}</option>
          </select>
        </AdminField>
        <AdminField label="Años del inmueble" for-id="d-age" :help="adminCopy.help.ageYears">
          <AdminNumber id="d-age" v-model="form.ageYears" suffix="años" :step="1" />
        </AdminField>
      </div>

      <div class="row row--small">
        <AdminField label="Habitaciones" for-id="d-bed">
          <AdminNumber id="d-bed" v-model="form.bedrooms" :step="1" />
        </AdminField>
        <AdminField label="Baños completos" for-id="d-bath">
          <AdminNumber id="d-bath" v-model="form.bathrooms" :step="1" />
        </AdminField>
        <AdminField label="Medios baños" for-id="d-half">
          <AdminNumber id="d-half" v-model="form.halfBathrooms" :step="1" />
        </AdminField>
        <AdminField label="Estacionamientos" for-id="d-park">
          <AdminNumber id="d-park" v-model="form.parking" :step="1" />
        </AdminField>
        <AdminField label="Bodegas" for-id="d-storage">
          <AdminNumber id="d-storage" v-model="form.storageRooms" :step="1" />
        </AdminField>
        <AdminField label="Ascensores" for-id="d-elev">
          <AdminNumber id="d-elev" v-model="form.elevators" :step="1" />
        </AdminField>
        <AdminField label="Número de pisos" for-id="d-floors">
          <AdminNumber id="d-floors" v-model="form.floors" :step="1" />
        </AdminField>
      </div>

      <AdminSwitch v-model="form.serviceBathroom" label="Tiene baño de servicio" />
    </template>
  </AdminSection>
</template>

<style scoped lang="scss">
.row {
  @include flex-cards(200px, 1rem);

  &--small {
    @include flex-cards(140px, 1rem);
  }
}
</style>
