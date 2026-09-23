<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { formatMoney } from '@/utils/format'
import { adminCopy } from '@/config/copy.admin'
import type { Unit } from '@/types'
import AdminSection from '../AdminSection.vue'

// El inventario vive en su propia pantalla, pero la clienta no lo encontraba desde el
// formulario del proyecto: esta sección lo resume y lleva ahí con un botón visible.
const props = defineProps<{ projectId?: string; step: number }>()

const units = ref<Unit[]>([])
const loading = ref(false)

const counts = computed(() => ({
  available: units.value.filter((u) => u.status === 'available').length,
  reserved: units.value.filter((u) => u.status === 'reserved').length,
  sold: units.value.filter((u) => u.status === 'sold').length,
}))

const statusLabel: Record<Unit['status'], string> = {
  available: 'Disponible',
  reserved: 'Reservada',
  sold: 'Vendida',
}

watch(
  () => props.projectId,
  async (id) => {
    if (!id) return
    loading.value = true
    try {
      units.value = await adminService.listUnits(id)
    } catch {
      units.value = []
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <AdminSection id="unidades" :step="step" :title="adminCopy.projectUnits.title" :text="adminCopy.projectUnits.text">
    <p v-if="!projectId" class="units__note">
      <i class="fa-solid fa-circle-info"></i> {{ adminCopy.projectUnits.saveFirst }}
    </p>

    <template v-else>
      <p v-if="loading" class="units__note"><i class="fa-solid fa-spinner fa-spin"></i> Cargando unidades…</p>

      <template v-else>
        <p class="units__summary">
          <span><b>{{ counts.available }}</b> disponibles</span>
          <span><b>{{ counts.reserved }}</b> reservadas</span>
          <span><b>{{ counts.sold }}</b> vendidas</span>
        </p>

        <ul v-if="units.length" class="units__list">
          <li v-for="u in units" :key="u._id" class="units__row">
            <span class="units__name">{{ u.name }}</span>
            <span class="units__price">{{ formatMoney(u.price) }}</span>
            <span class="units__status" :class="`units__status--${u.status}`">{{ statusLabel[u.status] }}</span>
          </li>
        </ul>
        <p v-else class="units__note">{{ adminCopy.projectUnits.empty }}</p>

        <div class="units__actions">
          <RouterLink :to="{ name: 'AdminUnits', params: { id: projectId }, query: { nueva: '1' } }" class="btn btn--primary">
            <i class="fa-solid fa-plus"></i> {{ adminCopy.projectUnits.add }}
          </RouterLink>
          <RouterLink v-if="units.length" :to="{ name: 'AdminUnits', params: { id: projectId } }" class="btn btn--ghost">
            <i class="fa-solid fa-table-list"></i> {{ adminCopy.projectUnits.manage }}
          </RouterLink>
        </div>
      </template>
    </template>
  </AdminSection>
</template>

<style scoped lang="scss">
.units {
  &__note {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $ink-soft;
    background: $sand;
    padding: 0.8rem 1rem;
    border-radius: $radius-md;

    i {
      color: $brand-blue;
    }
  }

  &__summary {
    @include flex(row, center, flex-start, 1.25rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;

    b {
      color: $ink;
      font-size: 1.05rem;
    }
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start);
    border: 1px solid $line;
    border-radius: $radius-md;
  }

  &__row {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
    padding: 0.7rem 0.9rem;
    border-bottom: 1px solid $line;

    &:last-child {
      border-bottom: 0;
    }
  }

  &__name {
    flex: 1 1 140px;
    font-weight: 500;
  }

  &__price {
    font-variant-numeric: tabular-nums;
    color: $ink-soft;
  }

  &__status {
    font-size: $text-xs;
    font-weight: 600;
    padding: 0.2rem 0.6rem;
    border-radius: $radius-pill;

    &--available {
      color: $success;
      background: $success-bg;
    }

    &--reserved {
      color: $warning;
      background: $warning-bg;
    }

    &--sold {
      color: $ink-soft;
      background: $sand;
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }
}
</style>
