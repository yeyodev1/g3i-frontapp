<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminSettings } from '@/composables/useAdminSettings'
import { useAdminUnsaved } from '@/composables/useAdminUnsaved'
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminFormNav from '@/components/admin/AdminFormNav.vue'
import AdminSaveBar from '@/components/admin/AdminSaveBar.vue'
import SettingsHeroSection from '@/components/admin/settings/SettingsHeroSection.vue'
import SettingsPopularSection from '@/components/admin/settings/SettingsPopularSection.vue'
import SettingsAboutSection from '@/components/admin/settings/SettingsAboutSection.vue'
import SettingsContactSection from '@/components/admin/settings/SettingsContactSection.vue'
import SettingsPriceRangesSection from '@/components/admin/settings/SettingsPriceRangesSection.vue'
import SettingsSellStatsSection from '@/components/admin/settings/SettingsSellStatsSection.vue'

const catalog = useAdminCatalogStore()
const { form, loading, saving, dirty, load, save } = useAdminSettings()

const sections = [
  { id: 'portada', label: 'Portada' },
  { id: 'buscadas', label: 'Más buscadas' },
  { id: 'precios', label: 'Rangos de precio' },
  { id: 'conocenos', label: 'Conócenos' },
  { id: 'contacto', label: 'Contacto' },
  { id: 'vender', label: 'Vender' },
  { id: 'cifras', label: 'Cifras de Inicio' },
  { id: 'terrenos', label: 'Usos de terreno' },
]

onMounted(() => {
  catalog.load()
  load()
})

useAdminUnsaved(dirty)
</script>

<template>
  <div class="settings">
    <AdminPageHeader
      title="Ajustes del sitio"
      subtitle="Textos, imagen de portada y datos de contacto."
    />

    <p v-if="loading" class="settings__loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
    </p>

    <form v-else class="settings__form" novalidate @submit.prevent="save">
      <AdminFormNav :sections="sections" />
      <SettingsHeroSection :form="form" />
      <SettingsPopularSection :form="form" />
      <SettingsPriceRangesSection :form="form" />
      <SettingsAboutSection :form="form" />
      <SettingsContactSection :form="form" />
      <SettingsSellStatsSection :form="form" />
      <AdminSaveBar :dirty="dirty" :saving="saving" @save="save" />
    </form>
  </div>
</template>

<style scoped lang="scss">
.settings {
  max-width: 880px;

  &__form {
    @include flex(column, stretch, flex-start, 1.2rem);
  }

  &__loading {
    color: $ink-soft;
    padding: 2rem 0;
  }
}
</style>
