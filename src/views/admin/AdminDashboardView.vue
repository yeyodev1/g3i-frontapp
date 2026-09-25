<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/copy.admin'
import { formatDate } from '@/utils/format'
import AdminStatusBadge from '@/components/admin/AdminStatusBadge.vue'
import type { ApiError, Dashboard } from '@/types'

const userStore = useUserStore()
const toast = useToastStore()
const data = ref<Dashboard | null>(null)
const loading = ref(true)

const firstName = computed(() => (userStore.user?.name || '').split(' ')[0])

const cards = computed(() => {
  const d = data.value
  if (!d) return []
  return [
    {
      label: 'Propiedades publicadas',
      value: d.properties.published ?? 0,
      note: `${d.properties.draft ?? 0} en borrador · ${d.properties.sold ?? 0} vendidas`,
      to: '/admin/propiedades',
      icon: 'fa-solid fa-house-chimney',
    },
    {
      label: 'Proyectos publicados',
      value: d.projects.published ?? 0,
      note: `${d.projects.draft ?? 0} en borrador`,
      to: '/admin/proyectos',
      icon: 'fa-solid fa-building',
    },
    {
      // Unidades = departamentos, suites o casas dentro de los proyectos (no las propiedades sueltas).
      label: 'Unidades de proyectos a la venta',
      value: d.units.available ?? 0,
      note: `Cargadas en ${d.unitProjects ?? 0} de ${d.projects.published ?? 0} proyectos · ${d.units.reserved ?? 0} reservadas · ${d.units.sold ?? 0} vendidas`,
      to: '/admin/proyectos',
      icon: 'fa-solid fa-table-list',
    },
    {
      label: 'Formularios nuevos',
      value: d.leads.new ?? 0,
      note: `${d.leads.last7d ?? 0} en los últimos 7 días`,
      to: '/admin/formularios',
      icon: 'fa-solid fa-inbox',
    },
  ]
})

onMounted(async () => {
  try {
    data.value = await adminService.dashboard()
  } catch (e) {
    toast.error((e as ApiError).message)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="dash">
    <header class="dash__head">
      <h1 class="dash__title">Hola{{ firstName ? `, ${firstName}` : '' }}</h1>
      <p class="dash__sub">¿Qué quieres hacer hoy?</p>
    </header>

    <div class="dash__quick">
      <RouterLink :to="{ name: 'AdminPropertyNew' }" class="quick">
        <i class="fa-solid fa-plus"></i>
        <span><strong>Nueva propiedad</strong><small>Casa, departamento, terreno…</small></span>
      </RouterLink>
      <RouterLink :to="{ name: 'AdminProjectNew' }" class="quick">
        <i class="fa-solid fa-building"></i>
        <span><strong>Nuevo proyecto</strong><small>Con su inventario de unidades</small></span>
      </RouterLink>
      <RouterLink :to="{ name: 'AdminSettings' }" class="quick">
        <i class="fa-solid fa-image"></i>
        <span><strong>Cambiar portada</strong><small>Imagen y textos del inicio</small></span>
      </RouterLink>
    </div>

    <p v-if="loading" class="dash__loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando…</p>

    <template v-else-if="data">
      <div class="dash__cards">
        <RouterLink v-for="c in cards" :key="c.label" :to="c.to" class="stat">
          <i :class="c.icon" class="stat__icon"></i>
          <strong class="stat__value">{{ c.value }}</strong>
          <span class="stat__label">{{ c.label }}</span>
          <small class="stat__note">{{ c.note }}</small>
        </RouterLink>
      </div>

      <section class="dash__leads">
        <header class="dash__leads-head">
          <h2>Últimos formularios</h2>
          <RouterLink to="/admin/formularios">Ver todos <i class="fa-solid fa-arrow-right"></i></RouterLink>
        </header>
        <p v-if="!data.recentLeads.length" class="dash__empty">Todavía no llegan formularios.</p>
        <ul v-else>
          <li v-for="lead in data.recentLeads" :key="lead._id" class="lead">
            <div class="lead__main">
              <strong>{{ lead.name }}</strong>
              <small>{{ adminCopy.leadKinds[lead.kind] || lead.kind }} · {{ formatDate(lead.createdAt) }}</small>
            </div>
            <AdminStatusBadge :status="lead.status" group="lead" />
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.dash {
  max-width: 1040px;
  @include flex(column, stretch, flex-start, 1.5rem);

  &__title {
    @include display($display-sm, 700);
  }

  &__sub {
    color: $ink-soft;
    margin-top: 0.3rem;
  }

  &__quick {
    @include flex-cards(240px, 0.8rem);
  }

  &__cards {
    @include flex-cards(200px, 0.8rem);
  }

  &__loading,
  &__empty {
    color: $ink-soft;
  }

  &__leads {
    @include card;
    padding: 1.2rem;

    ul {
      list-style: none;
    }
  }

  &__leads-head {
    @include flex(row, center, space-between, 1rem);
    margin-bottom: 0.6rem;

    h2 {
      font-size: $text-lg;
      font-weight: 700;
    }

    a {
      font-size: 0.85rem;
      font-weight: 600;
      color: $brand-blue;
    }
  }
}

.quick {
  @include flex(row, center, flex-start, 0.9rem);
  padding: 1.1rem 1.2rem;
  border-radius: $radius-md;
  background: $ink;
  color: $surface;
  min-height: 76px;
  @include transition(transform);

  &:hover {
    transform: translateY(-2px);
  }

  i {
    font-size: 1.2rem;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba($surface, 0.12);
    @include flex(row, center, center);
  }

  span {
    @include flex(column, flex-start, flex-start, 0.1rem);
  }

  small {
    font-size: 0.78rem;
    opacity: 0.7;
  }

  & + & {
    background: $surface;
    color: $ink;
    border: 1px solid $line;

    i {
      background: $sand;
    }
  }
}

.stat {
  @include card;
  @include flex(column, flex-start, flex-start, 0.15rem);
  padding: 1.1rem 1.2rem;
  @include transition(border-color);

  &:hover {
    border-color: $ink;
  }

  &__icon {
    color: $brand-blue;
    margin-bottom: 0.4rem;
  }

  &__value {
    font-family: $font-display;
    font-size: $display-sm;
    line-height: 1;
  }

  &__label {
    font-weight: 600;
    font-size: 0.9rem;
  }

  &__note {
    font-size: 0.78rem;
    color: $ink-muted;
  }
}

.lead {
  @include flex(row, center, space-between, 0.8rem);
  padding: 0.75rem 0;
  border-top: 1px solid $line;

  &__main {
    @include flex(column, flex-start, flex-start, 0.1rem);
    min-width: 0;

    small {
      font-size: 0.8rem;
      color: $ink-muted;
    }
  }
}
</style>
