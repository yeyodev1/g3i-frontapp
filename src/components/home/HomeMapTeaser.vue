<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useLeafletMap } from '@/composables/useLeafletMap'
import { mapService } from '@/services/map.service'
import { useCatalogStore } from '@/stores/catalog'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import type { MapPin } from '@/types'

const router = useRouter()
const catalog = useCatalogStore()
const el = ref<HTMLElement | null>(null)
const pins = ref<MapPin[]>([])
const { ready, setPins } = useLeafletMap(el, {
  zoom: 12,
  interactive: false,
  onNavigate: (path) => router.push(path),
})

onMounted(async () => {
  try {
    const data = await mapService.getPins()
    pins.value = [...data.properties, ...data.projects]
  } catch {
    pins.value = []
  }
})

watch([ready, pins], () => {
  if (ready.value) setPins(pins.value, catalog.sectorLabel)
})
</script>

<template>
  <section class="teaser">
    <div class="teaser__inner">
      <div class="teaser__copy">
        <SectionHeading :eyebrow="site.home.mapEyebrow" :title="site.home.mapTitle" :text="site.home.mapText" />
        <RouterLink to="/mapa" class="btn btn--primary">
          <i class="fa-regular fa-map"></i> {{ copy.map.openMap }}
        </RouterLink>
      </div>
      <RouterLink to="/mapa" class="teaser__map-link" :aria-label="copy.map.openMap">
        <div ref="el" class="teaser__map"></div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.teaser {
  background: $sand;
  padding-block: $space-section;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
    }
  }

  &__copy {
    flex: 1 1 0;

    :deep(.heading) {
      margin-bottom: 1.5rem;
    }
  }

  &__map-link {
    flex: 1.4 1 0;
    display: block;
  }

  &__map {
    height: 300px;
    border-radius: $radius-md;
    overflow: hidden;
    border: 1px solid $line;
    box-shadow: $shadow-md;
    z-index: 0;

    @include from('md') {
      height: 420px;
    }
  }
}
</style>
