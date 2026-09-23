<script setup lang="ts">
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import { adminCopy } from '@/config/copy.admin'
import type { ProjectForm } from '@/types/admin'
import type { FormErrors } from '@/composables/useAdminEditor'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'
import AdminChoiceChips from '../AdminChoiceChips.vue'

defineProps<{ form: ProjectForm; errors: FormErrors; step: number }>()

const catalog = useAdminCatalogStore()
</script>

<template>
  <AdminSection id="datos" :step="step" title="Datos del proyecto" text="Nombre, etapa y qué se vende.">
    <div class="row">
      <AdminField label="Nombre del proyecto" for-id="pj-title" :error="errors.title" required>
        <input id="pj-title" v-model="form.title" maxlength="120" placeholder="Ej. Edificio Alameda" />
      </AdminField>
      <AdminField label="Código interno" for-id="pj-code" :help="adminCopy.help.code" :error="errors.code">
        <input id="pj-code" v-model="form.code" maxlength="20" autocapitalize="characters" />
      </AdminField>
    </div>

    <AdminField label="Etapa" :error="errors.stage" required>
      <AdminChoiceChips v-model="form.stage" :options="catalog.projectStages" />
    </AdminField>

    <AdminField label="¿Qué se vende?" help="Marca todos los tipos que tiene el proyecto." :error="errors.propertyTypes" required>
      <AdminChoiceChips v-model="form.propertyTypes" :options="catalog.propertyTypes" multiple />
    </AdminField>

    <AdminField label="Resumen corto" for-id="pj-summary" :help="`${adminCopy.help.summary} · ${form.summary.length}/220`" :error="errors.summary">
      <textarea id="pj-summary" v-model="form.summary" rows="3" maxlength="240"></textarea>
    </AdminField>

    <AdminField label="Descripción completa" for-id="pj-desc" :help="adminCopy.help.description">
      <textarea id="pj-desc" v-model="form.description" rows="10"></textarea>
    </AdminField>
  </AdminSection>
</template>

<style scoped lang="scss">
.row {
  @include flex-cards(220px, 1rem);
}
</style>
