<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'
import { MAX_PHOTOS, MIN_PHOTOS } from '@/composables/useAdminPropertyForm'
import type { PropertyForm } from '@/types/admin'
import type { FormErrors } from '@/composables/useAdminEditor'
import AdminSection from '../AdminSection.vue'
import AdminField from '../AdminField.vue'
import AdminMediaGallery from '../AdminMediaGallery.vue'
import AdminVideoList from '../AdminVideoList.vue'

defineProps<{ form: PropertyForm; errors: FormErrors; step: number }>()
</script>

<template>
  <AdminSection id="fotos" :step="step" title="Fotos, videos y planos" text="Las fotos se suben apenas las eliges; recuerda guardar al final.">
    <AdminField label="Fotos" :help="adminCopy.help.photos" :error="errors.images">
      <AdminMediaGallery v-model="form.images" folder="properties" :max="MAX_PHOTOS" :min="MIN_PHOTOS" />
    </AdminField>

    <AdminField label="Videos" :help="adminCopy.help.videos">
      <AdminVideoList v-model="form.videos" folder="properties" />
    </AdminField>

    <AdminField label="Planos" :help="adminCopy.help.floorPlans">
      <AdminMediaGallery
        v-model="form.floorPlans"
        folder="properties"
        :max="10"
        :with-main="false"
        drop-text="Arrastra aquí los planos o toca para elegirlos"
      />
    </AdminField>
  </AdminSection>
</template>
