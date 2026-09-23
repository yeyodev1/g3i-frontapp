<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { copyPages } from '@/config/copy.pages'

type Option = { key: string; label: string }

const props = defineProps<{
  kind: string
  zone: string
  type: string
  stage: string
  price: string
  activeCount: number
  zoneOptions: readonly Option[]
  typeOptions: readonly Option[]
  stageOptions: readonly Option[]
}>()
const emit = defineEmits<{ filter: [key: string, value: string]; zone: [key: string]; clear: [] }>()

const c = copyPages.valley
const id = useId()
// Móvil: el panel arranca plegado para que el mapa tenga el alto útil.
const open = ref(false)

const selects = computed(() => [
  { key: 'zona', label: c.zoneLabel, all: c.allZones, value: props.zone, options: props.zoneOptions },
  { key: 'tipo', label: c.typeLabel, all: c.allTypes, value: props.type, options: props.typeOptions },
  { key: 'etapa', label: c.stageLabel, all: c.allStages, value: props.stage, options: props.stageOptions },
  { key: 'precio', label: c.priceLabel, all: c.allPrices, value: props.price, options: c.priceRanges },
])

function change(key: string, value: string) {
  if (key === 'zona') emit('zone', value)
  else emit('filter', key, value)
}
</script>

<template>
  <section class="vf" :class="{ 'is-open': open }">
    <button type="button" class="vf__toggle" :aria-expanded="open" :aria-controls="`${id}-body`" @click="open = !open">
      <i class="fa-solid fa-sliders" aria-hidden="true"></i>
      {{ c.filtersToggle }}
      <span v-if="activeCount" class="vf__badge">{{ activeCount }}</span>
      <i class="fa-solid fa-chevron-down vf__chev" aria-hidden="true"></i>
    </button>

    <div :id="`${id}-body`" class="vf__body">
      <header class="vf__head">
        <h2 class="vf__title">{{ c.filtersTitle }}</h2>
        <button v-if="activeCount || zone" type="button" class="vf__clear" @click="emit('clear')">{{ c.clear }}</button>
      </header>

      <div class="vf__kinds" role="group" :aria-label="c.kindLabel">
        <button
          v-for="k in c.kinds"
          :key="k.key"
          type="button"
          :class="{ 'is-on': kind === k.key }"
          :aria-pressed="kind === k.key"
          @click="emit('filter', 'ver', k.key)"
        >
          {{ k.label }}
        </button>
      </div>

      <div v-for="s in selects" :key="s.key" class="vf__field">
        <label :for="`${id}-${s.key}`">{{ s.label }}</label>
        <div class="vf__select">
          <select :id="`${id}-${s.key}`" :value="s.value" @change="change(s.key, ($event.target as HTMLSelectElement).value)">
            <option value="">{{ s.all }}</option>
            <option v-for="o in s.options" :key="o.key" :value="o.key">{{ o.label }}</option>
          </select>
          <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss" src="./ValleyFilters.scss"></style>
