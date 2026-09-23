<script setup lang="ts">
import type { Property } from '@/types'
import PropertyPriceBlock from './PropertyPriceBlock.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import LeadForm from '@/components/forms/LeadForm.vue'
import { copyProperties } from '@/config/copy.properties'

defineProps<{ property: Property; whatsappHref: string; message: string }>()
</script>

<template>
  <div class="sidebar">
    <PropertyPriceBlock :property="property" class="sidebar__price" />
    <LeadForm
      :key="property._id"
      kind="property"
      bare
      :title="copyProperties.contactTitle"
      text=""
      :submit-label="copyProperties.schedule"
      :message="message"
      :refs="{ property: property._id, refCode: property.code }"
    />
    <WhatsAppButton :href="whatsappHref" block class="sidebar__wa" />
  </div>
</template>

<style scoped lang="scss">
// Bloque de contacto: tarjeta blanca con sombra, fija al hacer scroll en desktop.
.sidebar {
  @include flex(column, stretch, flex-start);
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-sm;
  box-shadow: $shadow-md;
  padding: 1.75rem 1.25rem;

  @include from('md') {
    padding: 2.25rem;
  }

  @include from('lg') {
    position: sticky;
    top: 110px;
  }

  // En móvil el precio ya aparece junto al título.
  &__price {
    display: none;

    @include from('lg') {
      display: flex;
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid $line;
    }
  }

  &__wa {
    margin-top: 0.75rem;
  }
}
</style>
