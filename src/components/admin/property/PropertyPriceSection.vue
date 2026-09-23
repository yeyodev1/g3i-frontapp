<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'
import type { PropertyForm } from '@/types/admin'
import type { FormErrors } from '@/composables/useAdminEditor'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'
import AdminNumber from '../AdminNumber.vue'
import AdminSwitch from '../AdminSwitch.vue'

const props = defineProps<{ form: PropertyForm; errors: FormErrors; step: number }>()

// El precio nunca es null en el modelo: vacío se guarda como 0.
function setPrice(value: number | null) {
  props.form.price = value ?? 0
}

function setHoa(value: number | null) {
  props.form.hoa.amount = value ?? 0
}
</script>

<template>
  <AdminSection id="precio" :step="step" title="Precio">
    <AdminField label="Precio de venta" for-id="pr-price" :help="adminCopy.help.price" :error="errors.price">
      <AdminNumber id="pr-price" :model-value="form.price || null" suffix="USD" :step="1" @update:model-value="setPrice" />
    </AdminField>

    <AdminSwitch v-model="form.hoa.enabled" label="Tiene alícuota" help="Apágalo si el inmueble no paga alícuota." />

    <AdminField v-if="form.hoa.enabled" label="Alícuota mensual" for-id="pr-hoa" :help="adminCopy.help.hoa" :error="errors.hoa">
      <AdminNumber id="pr-hoa" :model-value="form.hoa.amount || null" suffix="USD" @update:model-value="setHoa" />
    </AdminField>
    <p v-else class="note"><i class="fa-solid fa-circle-info"></i> Se mostrará como "Sin alícuota".</p>
  </AdminSection>
</template>

<style scoped lang="scss">
.note {
  font-size: 0.85rem;
  color: $ink-soft;
}
</style>
