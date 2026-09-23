<script setup lang="ts">
import { onMounted } from 'vue'
import { adminService } from '@/services/admin.service'
import { useAdminListing } from '@/composables/useAdminListing'
import { useAdminListingActions } from '@/composables/useAdminListingActions'
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import { adminCopy } from '@/config/copy.admin'
import { formatMoney } from '@/utils/format'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminFilterBar from '@/components/admin/AdminFilterBar.vue'
import AdminListingCard from '@/components/admin/AdminListingCard.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import type { AdminPropertyRow } from '@/types/admin'

const catalog = useAdminCatalogStore()
const { query, items, total, pages, loading, loaded, load, replace, removeLocal } = useAdminListing<AdminPropertyRow>(
  (q) => adminService.listProperties(q),
)
const actions = useAdminListingActions<AdminPropertyRow>('property', { replace, removeLocal })

const statuses = Object.entries(adminCopy.status.property)

function meta(p: AdminPropertyRow) {
  return [catalog.label('propertyTypes', p.type), catalog.label('sectors', p.sector)].filter(Boolean).join(' · ')
}

onMounted(() => {
  catalog.load()
  load()
})
</script>

<template>
  <div>
    <AdminPageHeader title="Propiedades" :subtitle="`${total} en total`">
      <RouterLink :to="{ name: 'AdminPropertyNew' }" class="btn btn--primary">
        <i class="fa-solid fa-plus"></i> Nueva propiedad
      </RouterLink>
    </AdminPageHeader>

    <AdminFilterBar v-model:q="query.q" placeholder="Buscar por título o código">
      <select v-model="query.status" aria-label="Filtrar por estado">
        <option value="">Todos los estados</option>
        <option v-for="[key, label] in statuses" :key="key" :value="key">{{ label }}</option>
      </select>
      <select v-model="query.type" aria-label="Filtrar por tipo">
        <option value="">Todos los tipos</option>
        <option v-for="t in catalog.propertyTypes" :key="t.key" :value="t.key">{{ t.label }}</option>
      </select>
    </AdminFilterBar>

    <p v-if="loading && !loaded" class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando…</p>
    <AdminEmpty v-else-if="!items.length" :text="adminCopy.empty.properties" icon="fa-solid fa-house-chimney">
      <RouterLink :to="{ name: 'AdminPropertyNew' }" class="btn btn--dark">Agregar una propiedad</RouterLink>
    </AdminEmpty>

    <div v-else class="list" :class="{ 'list--busy': loading }">
      <AdminListingCard
        v-for="p in items"
        :key="p._id"
        :to="{ name: 'AdminPropertyEdit', params: { id: p._id } }"
        :cover="p.cover"
        :title="p.title"
        :code="p.code"
        :meta="meta(p)"
        :price="p.price ? formatMoney(p.price) : 'Sin precio'"
        :status="p.status"
        group="property"
        :featured="p.isFeatured"
      >
        <button v-if="p.status !== 'published'" @click="actions.setStatus(p, 'published')">
          <i class="fa-solid fa-eye"></i> Publicar
        </button>
        <button v-else @click="actions.setStatus(p, 'hidden')"><i class="fa-solid fa-eye-slash"></i> Ocultar</button>
        <button v-if="p.status !== 'sold'" @click="actions.markSold(p)">
          <i class="fa-solid fa-handshake"></i> Vendida
        </button>
        <button :class="{ 'is-on': p.isFeatured }" @click="actions.toggleFeatured(p)">
          <i :class="p.isFeatured ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
          {{ p.isFeatured ? 'Quitar destacada' : 'Destacar' }}
        </button>
        <button v-if="p.status === 'published'" @click="actions.viewOnSite(p)">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver en el sitio
        </button>
        <RouterLink :to="{ name: 'AdminPropertyEdit', params: { id: p._id } }">
          <i class="fa-solid fa-pen"></i> Editar
        </RouterLink>
        <button class="is-danger" @click="actions.remove(p)"><i class="fa-solid fa-trash"></i> Eliminar</button>
      </AdminListingCard>
    </div>

    <AdminPagination :page="query.page || 1" :pages="pages" @change="query.page = $event" />
  </div>
</template>

<style scoped lang="scss">
.list {
  @include flex(column, stretch, flex-start, 0.8rem);
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
