<script setup lang="ts">
import type { Property } from '@/types'
import PropertyPriceBlock from './PropertyPriceBlock.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import LeadForm from '@/components/forms/LeadForm.vue'

defineProps<{ property: Property; whatsappHref: string; message: string }>()
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__card">
      <PropertyPriceBlock :property="property" />
      <WhatsAppButton :href="whatsappHref" block class="sidebar__wa" />
    </div>
    <LeadForm
      :key="property._id"
      kind="property"
      :message="message"
      :refs="{ property: property._id, refCode: property.code }"
    />
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  @include flex(column, stretch, flex-start, 1rem);

  @include from('lg') {
    position: sticky;
    top: 80px;
  }

  // En móvil el precio ya aparece arriba, junto al título.
  &__card {
    display: none;

    @include from('lg') {
      @include card;
      @include flex(column, stretch, flex-start, 1rem);
      padding: 1.5rem;
    }
  }

  &__wa {
    margin-top: 0.2rem;
  }
}
</style>
