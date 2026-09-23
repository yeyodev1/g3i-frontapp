<script setup lang="ts">
import { computed } from 'vue'
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import { adminCopy } from '@/config/copy.admin'
import { formatDate } from '@/utils/format'
import type { AdminLead, LeadRef } from '@/types/admin'
import AdminStatusBadge from '../AdminStatusBadge.vue'

const props = defineProps<{ lead: AdminLead; retrying: boolean }>()
const emit = defineEmits<{ status: [status: AdminLead['status']]; retry: []; remove: [] }>()

const catalog = useAdminCatalogStore()

function ref(value: AdminLead['property']): LeadRef | null {
  if (!value) return null
  return typeof value === 'string' ? { _id: value } : value
}

const related = computed(() => {
  const property = ref(props.lead.property)
  if (property) {
    const label = property.title || props.lead.refCode || 'Ver propiedad'
    return { label, to: { name: 'AdminPropertyEdit', params: { id: property._id } } }
  }
  const project = ref(props.lead.project)
  if (project) {
    const unit = ref(props.lead.unit)
    const label = [project.title || 'Ver proyecto', unit?.name].filter(Boolean).join(' · ')
    return { label, to: { name: 'AdminProjectEdit', params: { id: project._id } } }
  }
  return null
})

// Los formularios llegan con 09… ; WhatsApp necesita el código de país.
const whatsapp = computed(() => {
  const digits = props.lead.phone.replace(/\D/g, '')
  if (!digits) return ''
  const full = digits.startsWith('593') ? digits : digits.startsWith('0') ? `593${digits.slice(1)}` : digits
  const text = encodeURIComponent(`Hola ${props.lead.name}, te escribimos de G3i Inmobiliaria.`)
  return `https://wa.me/${full}?text=${text}`
})

const statuses = Object.entries(adminCopy.status.lead)
</script>

<template>
  <article class="lead" :class="{ 'lead--new': lead.status === 'new' }">
    <header class="lead__head">
      <span class="lead__kind">{{ adminCopy.leadKinds[lead.kind] || lead.kind }}</span>
      <AdminStatusBadge :status="lead.status" group="lead" />
      <time class="lead__date">{{ formatDate(lead.createdAt) }}</time>
    </header>

    <h3 class="lead__name">{{ lead.name }}</h3>
    <p class="lead__contact">
      <a :href="`tel:${lead.phone}`"><i class="fa-solid fa-phone"></i> {{ lead.phone }}</a>
      <a v-if="lead.email" :href="`mailto:${lead.email}`"><i class="fa-solid fa-envelope"></i> {{ lead.email }}</a>
    </p>

    <p v-if="lead.message" class="lead__message">{{ lead.message }}</p>
    <p v-if="lead.kind === 'sell'" class="lead__meta">
      Quiere vender: {{ catalog.label('propertyTypes', lead.sellPropertyType || '') || '—' }}
      en {{ catalog.label('sectors', lead.sellSector || '') || '—' }}
    </p>
    <RouterLink v-if="related" :to="related.to" class="lead__related">
      <i class="fa-solid fa-link"></i> {{ related.label }}
    </RouterLink>

    <div class="lead__crm">
      <AdminStatusBadge :status="lead.crm?.status || 'pending'" group="crm" />
      <small v-if="lead.crm?.status === 'failed' && lead.crm.error">{{ lead.crm.error }}</small>
      <button v-if="lead.crm?.status === 'failed' || lead.crm?.status === 'pending'" :disabled="retrying" @click="emit('retry')">
        <i :class="retrying ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-rotate'"></i> Reintentar envío al CRM
      </button>
    </div>

    <footer class="lead__actions">
      <a v-if="whatsapp" :href="whatsapp" target="_blank" rel="noopener" class="lead__wa">
        <i class="fa-brands fa-whatsapp"></i> WhatsApp
      </a>
      <select
        :value="lead.status"
        aria-label="Cambiar estado"
        @change="emit('status', ($event.target as HTMLSelectElement).value as AdminLead['status'])"
      >
        <option v-for="[key, label] in statuses" :key="key" :value="key">{{ label }}</option>
      </select>
      <button class="lead__del" aria-label="Eliminar formulario" @click="emit('remove')">
        <i class="fa-solid fa-trash"></i>
      </button>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.lead {
  @include card;
  @include flex(column, stretch, flex-start, 0.5rem);
  padding: 1rem;

  &--new {
    border-left: 3px solid $brand-blue;
  }

  &__head {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__kind {
    @include eyebrow;
    font-size: 0.62rem;
  }

  &__date {
    margin-left: auto;
    font-size: 0.78rem;
    color: $ink-muted;
  }

  &__name {
    font-size: 1.05rem;
    font-weight: 700;
  }

  &__contact {
    @include flex(row, center, flex-start, 0.4rem 1rem);
    flex-wrap: wrap;
    font-size: 0.88rem;

    a {
      @include flex(row, center, flex-start, 0.4rem);
      min-height: 36px;
      overflow-wrap: anywhere;
    }

    i {
      color: $ink-muted;
    }
  }

  &__message {
    font-size: 0.9rem;
    color: $ink-soft;
    background: $sand;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    white-space: pre-line;
  }

  &__meta {
    font-size: 0.85rem;
  }

  &__related {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: 0.88rem;
    font-weight: 600;
    color: $brand-blue;
  }

  &__crm {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;

    small {
      font-size: 0.75rem;
      color: $danger;
    }

    button {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.4rem 0.7rem;
      border: 1px solid $line;
      border-radius: $radius-pill;
      min-height: 36px;
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    border-top: 1px solid $line;
    padding-top: 0.7rem;
    margin-top: 0.2rem;

    select {
      flex: 1;
      min-height: 44px;
      max-width: 200px;
    }
  }

  &__wa {
    @include flex(row, center, center, 0.45rem);
    min-height: 44px;
    padding: 0 1rem;
    border-radius: $radius-pill;
    background: #1faa59;
    color: $surface;
    font-weight: 600;
    font-size: 0.88rem;
  }

  &__del {
    margin-left: auto;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: $danger;

    &:hover {
      background: $danger-bg;
    }
  }
}
</style>
