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
import AdminImageField from '@/components/admin/AdminImageField.vue'
import type { Testimonial } from '@/types'
import type { TestimonialForm } from '@/types/admin'

const crud = useAdminCrud<Testimonial, TestimonialForm>('testimonials', {
  noun: 'el testimonio',
  empty: () => ({ name: '', text: '', photo: null, rating: 5, context: '', order: 0, isActive: true }),
  validate: (f) => ({
    ...(f.name.trim() ? {} : { name: 'Escribe el nombre.' }),
    ...(f.text.trim() ? {} : { text: 'Escribe el testimonio.' }),
  }),
  describe: (f) => f.name,
})

const stars = [1, 2, 3, 4, 5]

onMounted(crud.load)
</script>

<template>
  <div class="page">
    <AdminPageHeader title="Testimonios" subtitle="Lo que dicen los clientes. Se muestran en la página de inicio.">
      <button class="btn btn--primary" @click="crud.openNew()"><i class="fa-solid fa-plus"></i> Nuevo testimonio</button>
    </AdminPageHeader>

    <AdminCrudList
      :items="crud.sorted.value"
      :loading="crud.loading.value"
      :empty-text="adminCopy.empty.list"
      add-label="Agregar testimonio"
      @add="crud.openNew()"
      @edit="crud.openEdit"
      @remove="crud.remove"
      @move="crud.move"
    >
      <template #item="{ item }">
        <AdminItemSummary
          :title="`${item.name} · ${item.rating}/5`"
          :text="item.text"
          :image="item.photo?.url ?? ''"
          round
          :inactive="!item.isActive"
        />
      </template>
    </AdminCrudList>

    <AdminModal
      :open="crud.modalOpen.value"
      :title="crud.editing.value._id ? 'Editar testimonio' : 'Nuevo testimonio'"
      :saving="crud.saving.value"
      @close="crud.modalOpen.value = false"
      @save="crud.save()"
    >
      <AdminField label="Foto" help="Opcional.">
        <AdminImageField v-model="crud.editing.value.photo" folder="testimonials" shape="square" button-label="Subir foto" />
      </AdminField>
      <AdminField label="Nombre" for-id="t-name" :error="crud.errors.value.name" required>
        <input id="t-name" v-model="crud.editing.value.name" maxlength="100" />
      </AdminField>
      <AdminField label="Testimonio" for-id="t-text" :error="crud.errors.value.text" required>
        <textarea id="t-text" v-model="crud.editing.value.text" rows="5" maxlength="1000"></textarea>
      </AdminField>
      <AdminField label="Contexto" for-id="t-ctx" help='Ej. "Compró en Cumbayá"'>
        <input id="t-ctx" v-model="crud.editing.value.context" maxlength="100" />
      </AdminField>
      <AdminField label="Calificación">
        <div class="stars" role="radiogroup" aria-label="Calificación">
          <button
            v-for="n in stars"
            :key="n"
            type="button"
            role="radio"
            :aria-checked="crud.editing.value.rating === n"
            :aria-label="`${n} estrellas`"
            @click="crud.editing.value.rating = n"
          >
            <i :class="n <= crud.editing.value.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
          </button>
        </div>
      </AdminField>
      <AdminSwitch v-model="crud.editing.value.isActive" label="Mostrar en el sitio" />
    </AdminModal>
  </div>
</template>

<style scoped lang="scss">
.page {
  max-width: 860px;
}

.stars {
  @include flex(row, center, flex-start, 0.2rem);

  button {
    width: 44px;
    height: 44px;
    font-size: 1.4rem;
    color: $warning;
  }
}
</style>
