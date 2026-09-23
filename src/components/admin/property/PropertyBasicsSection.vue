<script setup lang="ts">
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import { adminCopy } from '@/config/copy.admin'
import type { PropertyForm } from '@/types/admin'
import type { FormErrors } from '@/composables/useAdminEditor'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'
import AdminChoiceChips from '../AdminChoiceChips.vue'

defineProps<{ form: PropertyForm; errors: FormErrors; step: number }>()

const catalog = useAdminCatalogStore()
const typeIcons: Record<string, string> = {
  casa: 'fa-solid fa-house',
  departamento: 'fa-solid fa-building',
  terreno: 'fa-solid fa-mountain-sun',
  suite: 'fa-solid fa-bed',
  local: 'fa-solid fa-store',
  oficina: 'fa-solid fa-briefcase',
}
</script>

<template>
  <AdminSection id="datos" :step="step" title="Datos básicos" text="Lo primero que ve el público.">
    <AdminField label="Tipo de inmueble" :error="errors.type" required>
      <AdminChoiceChips
        v-model="form.type"
        :options="catalog.propertyTypes.map((t) => ({ ...t, icon: typeIcons[t.key] }))"
      />
    </AdminField>

    <div class="row">
      <AdminField label="Transacción" help="G3i solo publica ventas.">
        <input value="Venta" disabled />
      </AdminField>
      <AdminField label="Código interno" for-id="p-code" :help="adminCopy.help.code" :error="errors.code">
        <input id="p-code" v-model="form.code" maxlength="20" placeholder="Ej. G3I-0123" autocapitalize="characters" />
      </AdminField>
    </div>

    <AdminField
      label="Título"
      for-id="p-title"
      help="Escríbelo normal, sin todo en mayúsculas. Ej. Casa con jardín en Cumbayá"
      :error="errors.title"
      required
    >
      <input id="p-title" v-model="form.title" maxlength="120" />
    </AdminField>

    <AdminField label="Resumen corto" for-id="p-summary" :help="`${adminCopy.help.summary} · ${form.summary.length}/220`" :error="errors.summary">
      <textarea id="p-summary" v-model="form.summary" rows="3" maxlength="240"></textarea>
    </AdminField>

    <AdminField label="Descripción completa" for-id="p-desc" :help="adminCopy.help.description">
      <textarea id="p-desc" v-model="form.description" rows="10"></textarea>
    </AdminField>
  </AdminSection>
</template>

<style scoped lang="scss">
.row {
  @include flex-cards(220px, 1rem);
}
</style>
