<script setup lang="ts">
import { useWhatsAppContext } from '@/composables/useWhatsAppContext'
import { copy } from '@/config/copy.public'

// En fichas el mensaje lleva título y código; en el resto, el genérico.
const { href } = useWhatsAppContext()
</script>

<template>
  <a
    :href="href"
    class="wa-float"
    target="_blank"
    rel="noopener"
    :aria-label="copy.whatsappFloat"
    :title="copy.whatsappFloat"
  >
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
  </a>
</template>

<style scoped lang="scss">
.wa-float {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 600;
  @include flex(row, center, center);
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  background: #25d366;
  color: #fff;
  font-size: 1.75rem;
  box-shadow:
    0 12px 28px -8px rgba($navy-950, 0.45),
    0 2px 6px rgba($navy-950, 0.18);
  @include transition(transform);
  @include focus-ring($navy-900);

  &:hover {
    transform: translateY(-2px);
  }

  @include from('md') {
    right: 1.5rem;
    bottom: 1.5rem;
  }
}
</style>
