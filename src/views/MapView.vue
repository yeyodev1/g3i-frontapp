<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ValleyZones from '@/components/map/ValleyZones.vue'
import ValleyFilters from '@/components/map/ValleyFilters.vue'
import ValleyPinList from '@/components/map/ValleyPinList.vue'
import { useValleyMapData } from '@/composables/useValleyMapData'
import { useValleyMap } from '@/composables/useValleyMap'
import { useCatalogStore } from '@/stores/catalog'
import { useSeo } from '@/composables/useSeo'
import { copyPages } from '@/config/copy.pages'
import type { BaseLayerKey } from '@/composables/useLeafletMap'

const c = copyPages.valley
const router = useRouter()
const catalog = useCatalogStore()
const el = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const selected = ref<string | null>(null)

const d = useValleyMapData()
const { kind, type, stage, price, active, zones, list } = d

const { ready, base, setPins, setActive: focusZone, select, setBase } = useValleyMap(el, {
  onZoneClick: d.setActive,
  onNavigate: (path) => router.push(path),
  onSelect: (id) => (selected.value = id),
  typeLabel: (key) => catalog.typeLabel(key),
})

watch([ready, d.pins], () => ready.value && setPins(d.pins.value, d.zoneName))

let first = true
watch(
  [ready, active],
  () => {
    if (!ready.value) return
    // Al entrar con ?zona= se encuadra sin animación; después, vuelo suave.
    focusZone(active.value, !first)
    first = false
  },
  { immediate: true },
)

const zoneOptions = computed(() => zones.value.map((z) => ({ key: z.key, label: z.name })))
const listLabel = computed(() => c.listLabel(active.value ? d.zoneName(active.value) : c.allZones))
const emptyText = computed(() => (active.value ? c.empty(d.zoneName(active.value)) : c.emptyAll))

function show(id: string) {
  // En móvil la lista queda debajo del mapa: se sube hasta él antes de abrir el pin.
  if (stageEl.value && stageEl.value.getBoundingClientRect().top < 0) {
    stageEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  select(id)
}

useSeo({ title: c.eyebrow, description: c.description })
</script>

<template>
  <div class="valley">
    <header class="valley__head">
      <p class="valley__eyebrow">{{ c.eyebrow }}</p>
      <h1 class="valley__title">{{ c.title }}</h1>
      <p class="valley__text">{{ c.text }}</p>
    </header>

    <div class="valley__body">
      <aside class="valley__panel">
        <ValleyFilters
          :kind="kind"
          :zone="active"
          :type="type"
          :stage="stage"
          :price="price"
          :active-count="d.activeFilters.value"
          :zone-options="zoneOptions"
          :type-options="d.typeOptions.value"
          :stage-options="d.stageOptions.value"
          @filter="d.setFilter"
          @zone="d.selectZone"
          @clear="d.clear"
        />
        <ValleyZones :zones="zones" :active="active" :kind="kind" @pick="d.setActive" />
      </aside>

      <div ref="stageEl" class="valley__stage">
        <div ref="el" class="valley__map" role="region" :aria-label="c.mapLabel"></div>
        <div class="valley__layers" role="group" :aria-label="c.layersLabel">
          <button
            v-for="l in c.layers"
            :key="l.key"
            type="button"
            :class="{ 'is-on': base === l.key }"
            :aria-pressed="base === l.key"
            @click="setBase(l.key as BaseLayerKey)"
          >
            {{ l.label }}
          </button>
        </div>
        <div v-if="d.error.value" class="valley__error" role="alert">
          {{ c.error }}
          <button type="button" class="link-caps" @click="d.load">{{ c.retry }}</button>
        </div>
      </div>
    </div>

    <ValleyPinList
      v-if="!d.loading.value"
      class="valley__list"
      :pins="list"
      :selected="selected"
      :label="listLabel"
      :empty-text="emptyText"
      @show="show"
    />
  </div>
</template>

<style scoped lang="scss" src="./MapView.scss"></style>
