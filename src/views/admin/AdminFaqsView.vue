<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { adminCopy } from '@/config/copy.admin'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminCrudList from '@/components/admin/AdminCrudList.vue'
import AdminItemSummary from '@/components/admin/AdminItemSummary.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import type { Faq } from '@/types'
import type { FaqForm } from '@/types/admin'

const crud = useAdminCrud<Faq, FaqForm>('faqs', {
  noun: 'la pregunta',
  empty: () => ({ question: '', answer: '', order: 0, isPublished: true }),
  validate: (f) => ({
    ...(f.question.trim() ? {} : { question: 'Escribe la pregunta.' }),
    ...(f.answer.trim() ? {} : { answer: 'Escribe la respuesta.' }),
  }),
  describe: (f) => f.question,
})

onMounted(crud.load)
</script>

<template>
  <div class="page">
    <AdminPageHeader title="Preguntas frecuentes" subtitle="Se muestran en la página de preguntas frecuentes, en este orden.">
      <button class="btn btn--primary" @click="crud.openNew()"><i class="fa-solid fa-plus"></i> Nueva pregunta</button>
    </AdminPageHeader>

    <AdminCrudList
      :items="crud.sorted.value"
      :loading="crud.loading.value"
      :empty-text="adminCopy.empty.list"
      add-label="Agregar pregunta"
      @add="crud.openNew()"
      @edit="crud.openEdit"
      @remove="crud.remove"
      @move="crud.move"
    >
      <template #item="{ item }">
        <AdminItemSummary :title="item.question" :text="item.answer" :inactive="!item.isPublished" />
      </template>
    </AdminCrudList>

    <AdminModal
      :open="crud.modalOpen.value"
      :title="crud.editing.value._id ? 'Editar pregunta' : 'Nueva pregunta'"
      :saving="crud.saving.value"
      @close="crud.modalOpen.value = false"
      @save="crud.save()"
    >
      <AdminField label="Pregunta" for-id="faq-q" :error="crud.errors.value.question" required>
        <input id="faq-q" v-model="crud.editing.value.question" maxlength="200" />
      </AdminField>
      <AdminField label="Respuesta" for-id="faq-a" :error="crud.errors.value.answer" required>
        <textarea id="faq-a" v-model="crud.editing.value.answer" rows="6"></textarea>
      </AdminField>
      <AdminSwitch v-model="crud.editing.value.isPublished" label="Mostrar en el sitio" />
    </AdminModal>
  </div>
</template>

<style scoped lang="scss">
.page {
  max-width: 860px;
}
</style>
