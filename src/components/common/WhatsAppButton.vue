<script setup lang="ts">
import { site } from '@/config/site'

withDefaults(defineProps<{ href: string; label?: string; block?: boolean }>(), {
  label: site.detail.whatsappCta,
})
</script>

<template>
  <a :href="href" target="_blank" rel="noopener" class="wa-btn" :class="{ 'wa-btn--block': block }">
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    <span>{{ label }}</span>
  </a>
</template>

<style scoped lang="scss">
.wa-btn {
  @include flex(row, center, center, 0.55rem);
  min-height: 48px;
  padding: 0 1.5rem;
  border-radius: $radius-sm;
  border: 1px solid $navy-900;
  color: $navy-900;
  @include caps(0.75rem, 0.18em);
  @include transition;

  i {
    font-size: 1.15rem;
    color: #25d366;
  }

  &:hover {
    background: $navy-900;
    color: $on-inverse;
  }

  &--block {
    width: 100%;
  }
}
</style>
