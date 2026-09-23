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
import type { Partner } from '@/types'
import type { PartnerForm } from '@/types/admin'

const crud = useAdminCrud<Partner, PartnerForm>('partners', {
  noun: 'el socio',
  empty: () => ({ name: '', logo: null, url: '', order: 0, isActive: true }),
  validate: (f) => {
    const e: Record<string, string> = {}
    if (!f.name.trim()) e.name = 'Escribe el nombre.'
    if (f.url && !/^https?:\/\//.test(f.url)) e.url = 'El enlace debe empezar con https://'
    return e
  },
  describe: (f) => f.name,
})

onMounted(crud.load)
</script>

<template>
  <div class="page">
    <AdminPageHeader title="Socios comerciales" subtitle="Logos de las empresas que confían en G3i.">
      <button class="btn btn--primary" @click="crud.openNew()"><i class="fa-solid fa-plus"></i> Nuevo socio</button>
    </AdminPageHeader>

    <AdminCrudList
      :items="crud.sorted.value"
      :loading="crud.loading.value"
      :empty-text="adminCopy.empty.list"
      add-label="Agregar socio"
      @add="crud.openNew()"
      @edit="crud.openEdit"
      @remove="crud.remove"
      @move="crud.move"
    >
      <template #item="{ item }">
        <AdminItemSummary :title="item.name" :text="item.url" :image="item.logo?.url ?? ''" :inactive="!item.isActive" />
      </template>
    </AdminCrudList>

    <AdminModal
      :open="crud.modalOpen.value"
      :title="crud.editing.value._id ? 'Editar socio' : 'Nuevo socio'"
      :saving="crud.saving.value"
      @close="crud.modalOpen.value = false"
      @save="crud.save()"
    >
      <AdminField label="Logo" help="Mejor un PNG con fondo transparente.">
        <AdminImageField v-model="crud.editing.value.logo" folder="partners" shape="logo" button-label="Subir logo" />
      </AdminField>
      <AdminField label="Nombre" for-id="pa-name" :error="crud.errors.value.name" required>
        <input id="pa-name" v-model="crud.editing.value.name" maxlength="100" />
      </AdminField>
      <AdminField label="Sitio web" for-id="pa-url" help="Opcional." :error="crud.errors.value.url">
        <input id="pa-url" v-model="crud.editing.value.url" type="url" placeholder="https://" />
      </AdminField>
      <AdminSwitch v-model="crud.editing.value.isActive" label="Mostrar en el sitio" />
    </AdminModal>
  </div>
</template>

<style scoped lang="scss">
.page {
  max-width: 860px;
}
</style>
