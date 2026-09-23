<script setup lang="ts">
import type { UnitStatus } from '@/types'
import { copy } from '@/config/copy.public'

defineProps<{ status: UnitStatus }>()
</script>

<template>
  <span class="ustatus" :class="`ustatus--${status}`">
    {{ status === 'reserved' ? copy.project.reserved : copy.project.available }}
  </span>
</template>

<style scoped lang="scss">
.ustatus {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: $text-xs;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: $radius-pill;
  white-space: nowrap;

  &::before {
    content: '';
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: currentColor;
  }

  &--available {
    color: darken($success, 12%);
    background: $success-bg;
  }

  &--reserved {
    color: darken($brand-orange, 8%);
    background: rgba($brand-orange, 0.1);
  }
}
</style>
