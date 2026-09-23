<script setup lang="ts">
import { site } from '@/config/site'

withDefaults(defineProps<{ href: string; label?: string; block?: boolean }>(), {
  label: site.detail.whatsappCta,
})
</script>

<template>
  <a :href="href" target="_blank" rel="noopener" class="wa-btn" :class="{ 'wa-btn--block': block }">
    <i class="fa-brands fa-whatsapp"></i>
    <span>{{ label }}</span>
  </a>
</template>

<style scoped lang="scss">
.wa-btn {
  @include flex(row, center, center, 0.55rem);
  min-height: 2.9rem;
  padding: 0.75rem 1.4rem;
  border-radius: $radius-pill;
  border: 1px solid $ink;
  color: $ink;
  font-size: $text-sm;
  font-weight: 600;
  @include transition;

  i {
    font-size: 1.15rem;
    color: #25d366;
  }

  &:hover {
    background: $ink;
    color: $surface;
  }

  &--block {
    width: 100%;
  }
}
</style>
