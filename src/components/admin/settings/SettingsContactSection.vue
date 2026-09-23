<script setup lang="ts">
import type { Settings } from '@/types'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'

defineProps<{ form: Settings }>()
</script>

<template>
  <AdminSection id="contacto" title="Contacto y redes" text="Aparecen en el pie de página, en Contacto y en el botón de WhatsApp.">
    <div class="row">
      <AdminField label="WhatsApp" for-id="c-wa" help="Con código de país y sin espacios, ej. 593995806119.">
        <input id="c-wa" v-model="form.contact.whatsapp" inputmode="tel" />
      </AdminField>
      <AdminField label="Teléfono" for-id="c-phone" help="Como quieras que se lea, ej. 099 580 6119.">
        <input id="c-phone" v-model="form.contact.phone" inputmode="tel" />
      </AdminField>
    </div>
    <AdminField label="Correo" for-id="c-email">
      <input id="c-email" v-model="form.contact.email" type="email" />
    </AdminField>
    <div class="row">
      <AdminField label="Instagram" for-id="c-ig" help="Enlace completo al perfil.">
        <input id="c-ig" v-model="form.contact.instagram" type="url" placeholder="https://instagram.com/…" />
      </AdminField>
      <AdminField label="Facebook" for-id="c-fb" help="Enlace completo a la página.">
        <input id="c-fb" v-model="form.contact.facebook" type="url" placeholder="https://facebook.com/…" />
      </AdminField>
    </div>
    <AdminField label="Dirección de la oficina" for-id="c-addr">
      <input id="c-addr" v-model="form.contact.address" maxlength="200" />
    </AdminField>
  </AdminSection>
</template>

<style scoped lang="scss">
.row {
  @include flex-cards(220px, 1rem);
}
</style>
