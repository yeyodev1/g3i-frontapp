<script setup lang="ts">
import type { Settings } from '@/types'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'
import AdminImageField from '../AdminImageField.vue'

defineProps<{ form: Settings }>()
</script>

<template>
  <AdminSection id="conocenos" title="Conócenos" text="La historia de G3i en la página Conócenos.">
    <AdminField label="Título" for-id="a-title">
      <input id="a-title" v-model="form.about.title" maxlength="120" />
    </AdminField>
    <AdminField label="Texto" for-id="a-text" help="Deja una línea en blanco para separar párrafos.">
      <textarea id="a-text" v-model="form.about.text" rows="8"></textarea>
    </AdminField>
    <AdminField label="Imagen">
      <AdminImageField v-model="form.about.image" folder="site" />
    </AdminField>
  </AdminSection>
</template>
