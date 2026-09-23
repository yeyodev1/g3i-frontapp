<script setup lang="ts">
import { useWhatsAppContext } from '@/composables/useWhatsAppContext'
import { copy } from '@/config/copy.public'

// En fichas el mensaje lleva título y código; en el resto, el genérico.
const { href } = useWhatsAppContext()
</script>

<template>
  <a :href="href" class="wa-float" target="_blank" rel="noopener" :aria-label="copy.whatsappFloat" :title="copy.whatsappFloat">
    <i class="fa-brands fa-whatsapp"></i>
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
  box-shadow: 0 8px 24px rgba($ink, 0.22);
  @include transition(transform);

  &:hover {
    transform: scale(1.06);
  }

  @include from('md') {
    right: 1.5rem;
    bottom: 1.5rem;
  }
}
</style>
