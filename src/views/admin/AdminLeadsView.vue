<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useAdminListing } from '@/composables/useAdminListing'
import { useAdminConfirm } from '@/composables/useAdminConfirm'
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import LeadCard from '@/components/admin/leads/LeadCard.vue'
import type { ApiError } from '@/types'
import type { AdminLead } from '@/types/admin'

const catalog = useAdminCatalogStore()
const toast = useToastStore()
const { confirm } = useAdminConfirm()
const { query, items, total, pages, loading, loaded, load, replace, removeLocal } = useAdminListing<AdminLead>((q) =>
  adminService.listLeads({ kind: q.kind, status: q.status, page: q.page, limit: q.limit }),
)

const retrying = ref('')
const kinds = Object.entries(adminCopy.leadKinds)
const statuses = Object.entries(adminCopy.status.lead)

async function setStatus(lead: AdminLead, status: AdminLead['status']) {
  try {
    await adminService.setLeadStatus(lead._id, status)
    replace({ ...lead, status })
    toast.success(`Marcado como ${adminCopy.status.lead[status].toLowerCase()}.`)
  } catch (e) {
    toast.error((e as ApiError).message)
  }
}

async function retry(lead: AdminLead) {
  retrying.value = lead._id
  try {
    const updated = await adminService.retryLeadCrm(lead._id)
    replace({ ...lead, crm: updated?.crm ?? lead.crm })
    if (updated?.crm?.status === 'sent') toast.success('Enviado al CRM.')
    else toast.error(updated?.crm?.error || 'El CRM todavía no lo recibió. Intenta más tarde.')
  } catch (e) {
    toast.error((e as ApiError).message)
  } finally {
    retrying.value = ''
  }
}

async function remove(lead: AdminLead) {
  const ok = await confirm({
    title: '¿Eliminar este formulario?',
    message: `De ${lead.name}. ${adminCopy.delete.generic}`,
    confirmLabel: adminCopy.delete.confirm,
    danger: true,
  })
  if (!ok) return
  try {
    await adminService.deleteLead(lead._id)
    removeLocal(lead._id)
    toast.success(adminCopy.delete.done)
  } catch (e) {
    toast.error((e as ApiError).message)
  }
}

onMounted(() => {
  catalog.load()
  load()
})
</script>

<template>
  <div>
    <AdminPageHeader
      title="Formularios recibidos"
      :subtitle="`${total} en total. Aquí llega todo lo que la gente envía desde el sitio.`"
    />

    <div class="filters">
      <select v-model="query.kind" aria-label="Filtrar por tipo">
        <option value="">Todos los tipos</option>
        <option v-for="[key, label] in kinds" :key="key" :value="key">{{ label }}</option>
      </select>
      <select v-model="query.status" aria-label="Filtrar por estado">
        <option value="">Todos los estados</option>
        <option v-for="[key, label] in statuses" :key="key" :value="key">{{ label }}</option>
      </select>
    </div>

    <p v-if="loading && !loaded" class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando…</p>
    <AdminEmpty v-else-if="!items.length" :text="adminCopy.empty.leads" icon="fa-solid fa-inbox" />
    <div v-else class="list" :class="{ 'list--busy': loading }">
      <LeadCard
        v-for="lead in items"
        :key="lead._id"
        :lead="lead"
        :retrying="retrying === lead._id"
        @status="setStatus(lead, $event)"
        @retry="retry(lead)"
        @remove="remove(lead)"
      />
    </div>

    <AdminPagination :page="query.page || 1" :pages="pages" @change="query.page = $event" />
  </div>
</template>

<style scoped lang="scss">
.filters {
  @include flex(row, center, flex-start, 0.6rem);
  flex-wrap: wrap;
  margin-bottom: 1.2rem;

  select {
    flex: 1 1 160px;
    min-height: 48px;

    @include from('md') {
      flex: 0 0 220px;
    }
  }
}

.list {
  @include flex-cards(320px, 0.8rem);
  transition: opacity 0.2s ease;

  &--busy {
    opacity: 0.55;
  }
}

.loading {
  color: $ink-soft;
  padding: 2rem 0;
}
</style>
