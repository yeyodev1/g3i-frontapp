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
  gap: 0.45rem;
  height: 24px;
  padding: 0 0.6rem;
  border-radius: $radius-sm;
  @include caps(0.625rem, 0.2em);
  white-space: nowrap;

  &::before {
    content: '';
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: currentColor;
  }

  &--available {
    color: $success;
    background: $success-bg;
  }

  &--reserved {
    color: $ember-700;
    background: $ember-100;
  }
}
</style>
