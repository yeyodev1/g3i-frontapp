<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminUnits } from '@/composables/useAdminUnits'
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import { adminCopy } from '@/config/copy.admin'
import { formatMoney } from '@/utils/format'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import UnitRow from '@/components/admin/units/UnitRow.vue'
import UnitFormModal from '@/components/admin/units/UnitFormModal.vue'

const route = useRoute()
const catalog = useAdminCatalogStore()
const projectId = () => route.params.id as string
const u = useAdminUnits(projectId)

const counts = computed(() => ({
  available: u.units.value.filter((x) => x.status === 'available').length,
  reserved: u.units.value.filter((x) => x.status === 'reserved').length,
  sold: u.units.value.filter((x) => x.status === 'sold').length,
}))

onMounted(async () => {
  catalog.load()
  await u.load()
  // Desde el formulario del proyecto se llega con ?nueva=1: abre directo el alta de unidad.
  if (route.query.nueva) u.openNew()
})
</script>

<template>
  <div class="units">
    <AdminPageHeader
      :title="u.project.value ? `Inventario de ${u.project.value.title}` : 'Inventario'"
      subtitle="Las unidades vendidas dejan de aparecer en el sitio. Las reservadas siguen visibles con su etiqueta."
      :back="{ name: 'AdminProjectEdit', params: { id: projectId() } }"
      back-label="Volver al proyecto"
    >
      <button class="btn btn--primary" @click="u.openNew()"><i class="fa-solid fa-plus"></i> Nueva unidad</button>
    </AdminPageHeader>

    <div class="units__summary">
      <div class="units__stat">
        <span>Precio desde</span>
        <strong>{{ u.project.value?.priceFrom ? formatMoney(u.project.value.priceFrom) : 'Sin definir' }}</strong>
        <small>Se calcula con la unidad disponible más barata.</small>
      </div>
      <div class="units__stat"><span>Disponibles</span><strong>{{ counts.available }}</strong></div>
      <div class="units__stat"><span>Reservadas</span><strong>{{ counts.reserved }}</strong></div>
      <div class="units__stat"><span>Vendidas</span><strong>{{ counts.sold }}</strong></div>
    </div>

    <p v-if="u.loading.value && !u.units.value.length" class="units__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>
    <AdminEmpty v-else-if="!u.units.value.length" :text="adminCopy.empty.units" icon="fa-solid fa-table-list">
      <button class="btn btn--dark" @click="u.openNew()">Agregar unidad</button>
    </AdminEmpty>

    <div v-else class="units__list">
      <UnitRow
        v-for="(unit, i) in u.sorted.value"
        :key="unit._id"
        :unit="unit"
        :first="i === 0"
        :last="i === u.sorted.value.length - 1"
        @edit="u.openEdit(unit)"
        @remove="u.remove(unit)"
        @status="u.setStatus(unit, $event)"
        @move="u.move(unit, $event)"
      />
    </div>

    <UnitFormModal
      :open="u.modalOpen.value"
      :form="u.editing.value"
      :errors="u.errors.value"
      :saving="u.saving.value"
      @close="u.modalOpen.value = false"
      @save="u.save()"
    />
  </div>
</template>

<style scoped lang="scss">
.units {
  max-width: 1000px;

  &__summary {
    @include flex-cards(140px, 0.7rem);
    margin-bottom: 1.2rem;
  }

  &__stat {
    @include card;
    @include flex(column, flex-start, flex-start, 0.15rem);
    padding: 0.9rem 1rem;

    span {
      font-size: 0.78rem;
      color: $ink-muted;
      font-weight: 600;
    }

    strong {
      font-size: $text-lg;
    }

    small {
      font-size: 0.72rem;
      color: $ink-muted;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__loading {
    color: $ink-soft;
    padding: 2rem 0;
  }
}
</style>
