<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'
import type { ProjectForm } from '@/types/admin'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'
import AdminNumber from '../AdminNumber.vue'
import AdminStringList from '../AdminStringList.vue'

defineProps<{ form: ProjectForm; step: number }>()
</script>

<template>
  <AdminSection id="detalles" :step="step" title="Detalles y precio">
    <div class="row">
      <AdminField label="Constructora" for-id="pj-dev" :help="adminCopy.help.developer">
        <input id="pj-dev" v-model="form.developer" maxlength="120" />
      </AdminField>
      <AdminField label="Fecha de entrega" for-id="pj-delivery" :help="adminCopy.help.deliveryDate">
        <input id="pj-delivery" v-model="form.deliveryDate" maxlength="40" placeholder="Febrero 2027" />
      </AdminField>
    </div>

    <div class="row">
      <AdminField label="Total de unidades" for-id="pj-units" :help="adminCopy.help.totalUnits">
        <AdminNumber id="pj-units" v-model="form.totalUnits" :step="1" />
      </AdminField>
      <AdminField label="Precio desde" for-id="pj-from" :help="adminCopy.help.priceFrom">
        <AdminNumber id="pj-from" v-model="form.priceFrom" suffix="USD" :step="1" />
      </AdminField>
    </div>

    <AdminField label="Beneficios destacados" :help="adminCopy.help.highlights">
      <AdminStringList v-model="form.highlights" placeholder="Ej. Ubicación estratégica" />
    </AdminField>
  </AdminSection>
</template>

<style scoped lang="scss">
.row {
  @include flex-cards(220px, 1rem);
}
</style>
