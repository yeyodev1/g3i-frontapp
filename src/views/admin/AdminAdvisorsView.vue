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
import type { Advisor } from '@/types'
import type { AdvisorForm } from '@/types/admin'

const crud = useAdminCrud<Advisor, AdvisorForm>('advisors', {
  noun: 'al asesor',
  empty: () => ({ name: '', role: '', photo: null, bio: '', phone: '', email: '', order: 0, isActive: true }),
  validate: (f) => {
    const e: Record<string, string> = {}
    if (!f.name.trim()) e.name = 'Escribe el nombre.'
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Ese correo no parece válido.'
    return e
  },
  describe: (f) => f.name,
})

onMounted(crud.load)
</script>

<template>
  <div class="page">
    <AdminPageHeader title="Asesores" subtitle="El equipo que aparece en Conócenos. Puedes agregar los que necesites.">
      <button class="btn btn--primary" @click="crud.openNew()"><i class="fa-solid fa-plus"></i> Nuevo asesor</button>
    </AdminPageHeader>

    <AdminCrudList
      :items="crud.sorted.value"
      :loading="crud.loading.value"
      :empty-text="adminCopy.empty.list"
      add-label="Agregar asesor"
      @add="crud.openNew()"
      @edit="crud.openEdit"
      @remove="crud.remove"
      @move="crud.move"
    >
      <template #item="{ item }">
        <AdminItemSummary :title="item.name" :text="item.role" :image="item.photo?.url ?? ''" round :inactive="!item.isActive" />
      </template>
    </AdminCrudList>

    <AdminModal
      :open="crud.modalOpen.value"
      :title="crud.editing.value._id ? 'Editar asesor' : 'Nuevo asesor'"
      :saving="crud.saving.value"
      @close="crud.modalOpen.value = false"
      @save="crud.save()"
    >
      <AdminField label="Foto">
        <AdminImageField v-model="crud.editing.value.photo" folder="team" shape="square" button-label="Subir foto" />
      </AdminField>
      <AdminField label="Nombre" for-id="adv-name" :error="crud.errors.value.name" required>
        <input id="adv-name" v-model="crud.editing.value.name" maxlength="100" />
      </AdminField>
      <AdminField label="Cargo" for-id="adv-role" help="Ej. Asesora inmobiliaria">
        <input id="adv-role" v-model="crud.editing.value.role" maxlength="100" />
      </AdminField>
      <AdminField label="Cuéntanos algo de ti" for-id="adv-bio" help="Una reseña personal corta y cercana.">
        <textarea id="adv-bio" v-model="crud.editing.value.bio" rows="5" maxlength="800"></textarea>
      </AdminField>
      <div class="row">
        <AdminField label="Teléfono / WhatsApp" for-id="adv-phone">
          <input id="adv-phone" v-model="crud.editing.value.phone" type="tel" inputmode="tel" />
        </AdminField>
        <AdminField label="Correo" for-id="adv-email" :error="crud.errors.value.email">
          <input id="adv-email" v-model="crud.editing.value.email" type="email" />
        </AdminField>
      </div>
      <AdminSwitch v-model="crud.editing.value.isActive" label="Mostrar en el sitio" />
    </AdminModal>
  </div>
</template>

<style scoped lang="scss">
.page {
  max-width: 860px;
}

.row {
  @include flex-cards(200px, 1rem);
}
</style>
