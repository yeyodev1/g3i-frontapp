<script setup lang="ts">
import type { Settings } from '@/types'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'
import AdminImageField from '../AdminImageField.vue'

defineProps<{ form: Settings }>()
</script>

<template>
  <AdminSection
    id="portada"
    title="Portada del sitio"
    text="Lo primero que ve quien entra a la página de inicio."
  >
    <AdminField
      label="Imagen principal"
      help="Horizontal y de buena calidad (mínimo 1920 px de ancho). Puedes cambiarla cuando quieras."
    >
      <AdminImageField v-model="form.hero.image" folder="site" button-label="Subir imagen" />
    </AdminField>
    <AdminField label="Título" for-id="h-title">
      <input id="h-title" v-model="form.hero.title" maxlength="120" />
    </AdminField>
    <AdminField label="Subtítulo" for-id="h-sub">
      <textarea id="h-sub" v-model="form.hero.subtitle" rows="3" maxlength="300"></textarea>
    </AdminField>
  </AdminSection>
</template>
