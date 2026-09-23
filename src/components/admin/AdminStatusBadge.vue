<script setup lang="ts">
import { computed } from 'vue'
import { adminCopy } from '@/config/copy.admin'

const props = defineProps<{
  status: string
  group: 'property' | 'project' | 'unit' | 'lead' | 'crm'
}>()

const label = computed(() => (adminCopy.status[props.group] as Record<string, string>)[props.status] ?? props.status)

// Verde = visible o hecho, ámbar = en espera, gris = fuera del sitio, rojo = problema.
const tone = computed(() => {
  const map: Record<string, string> = {
    published: 'ok',
    available: 'ok',
    sent: 'ok',
    closed: 'muted',
    draft: 'warn',
    reserved: 'warn',
    new: 'info',
    contacted: 'ok',
    pending: 'warn',
    hidden: 'muted',
    skipped: 'muted',
    sold: 'dark',
    'sold-out': 'dark',
    failed: 'danger',
  }
  return map[props.status] ?? 'muted'
})
</script>

<template>
  <span class="badge" :class="`badge--${tone}`">{{ label }}</span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.74rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: $radius-pill;
  white-space: nowrap;

  &--ok {
    background: $success-bg;
    color: darken($success, 12%);
  }

  &--warn {
    background: $warning-bg;
    color: darken($warning, 18%);
  }

  &--info {
    background: rgba($brand-blue, 0.1);
    color: $brand-blue;
  }

  &--muted {
    background: $sand;
    color: $ink-soft;
  }

  &--dark {
    background: $ink;
    color: $surface;
  }

  &--danger {
    background: $danger-bg;
    color: $danger;
  }
}
</style>
