<script setup lang="ts">
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import { priceRangeKey, priceRangeLabel } from '@/utils/priceRanges'
import type { PopularSearch, Settings } from '@/types'
import AdminSection from '../AdminSection.vue'

const props = defineProps<{ form: Settings }>()
const catalog = useAdminCatalogStore()

// El precio del acceso rápido se elige entre los rangos de «Rangos de precio».
function rangeOf(item: PopularSearch) {
  return priceRangeKey({
    min: Number(item.query.minPrice) || null,
    max: Number(item.query.maxPrice) || null,
  })
}
function setRange(item: PopularSearch, key: string) {
  const range = props.form.priceRanges.find((r) => priceRangeKey(r) === key)
  item.query.minPrice = range?.min ? String(range.min) : ''
  item.query.maxPrice = range?.max ? String(range.max) : ''
}

// Si el texto queda vacío se arma con lo elegido: «Casa · Cumbayá».
function autoLabel(item: PopularSearch) {
  if (item.label.trim()) return
  const q = item.query
  item.label = [
    catalog.propertyTypes.find((t) => t.key === q.type)?.label,
    catalog.sectors.find((s) => s.key === q.sector)?.label,
  ]
    .filter(Boolean)
    .join(' · ')
}

function add() {
  props.form.popularSearches.push({
    label: '',
    query: { type: '', sector: '', condition: '', minPrice: '', maxPrice: '' },
  })
}

function remove(index: number) {
  props.form.popularSearches.splice(index, 1)
}

function move(index: number, dir: -1 | 1) {
  const list = props.form.popularSearches
  const to = index + dir
  if (to < 0 || to >= list.length) return
  list.splice(to, 0, ...list.splice(index, 1))
}
</script>

<template>
  <AdminSection
    id="buscadas"
    title="Más buscadas (botones bajo el buscador)"
    text="Los botones que salen debajo del buscador de Inicio, en el orden de esta lista. Tú eliges cuáles van: agrega, quita, cambia el texto o súbelos con la flecha. Ej. «Casas en Cumbayá»: tipo Casa y sector Cumbayá."
  >
    <ul v-if="form.popularSearches.length" class="chips">
      <li v-for="(item, i) in form.popularSearches" :key="i" class="chip">
        <div class="chip__head">
          <input
            v-model="item.label"
            placeholder="Texto del botón, ej. Casas en Cumbayá"
            aria-label="Texto del botón"
          />
          <button type="button" :disabled="i === 0" aria-label="Subir" @click="move(i, -1)">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button type="button" class="chip__del" aria-label="Quitar" @click="remove(i)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="chip__filters">
          <select v-model="item.query.type" aria-label="Tipo" @change="autoLabel(item)">
            <option value="">Cualquier tipo</option>
            <option v-for="t in catalog.propertyTypes" :key="t.key" :value="t.key">
              {{ t.label }}
            </option>
          </select>
          <select v-model="item.query.sector" aria-label="Sector" @change="autoLabel(item)">
            <option value="">Cualquier sector</option>
            <option v-for="s in catalog.sectors" :key="s.key" :value="s.key">{{ s.label }}</option>
          </select>
          <select v-model="item.query.condition" aria-label="Etapa">
            <option value="">Cualquier etapa</option>
            <option v-for="c in catalog.conditions" :key="c.key" :value="c.key">
              {{ c.label }}
            </option>
          </select>
          <select
            :value="rangeOf(item)"
            aria-label="Precio"
            @change="setRange(item, ($event.target as HTMLSelectElement).value)"
          >
            <option value="-">Cualquier precio</option>
            <option v-for="r in form.priceRanges" :key="priceRangeKey(r)" :value="priceRangeKey(r)">
              {{ priceRangeLabel(r) }}
            </option>
          </select>
        </div>
      </li>
    </ul>
    <button type="button" class="btn btn--ghost add" @click="add">
      <i class="fa-solid fa-plus"></i> Agregar búsqueda
    </button>
  </AdminSection>
</template>

<style scoped lang="scss">
.chips {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.7rem);
}

.chip {
  @include flex(column, stretch, flex-start, 0.5rem);
  padding: 0.8rem;
  background: $sand;
  border-radius: $radius-sm;

  &__head {
    @include flex(row, center, flex-start, 0.35rem);

    button {
      flex: none;
      width: 42px;
      height: 42px;
      border-radius: $radius-sm;
      background: $surface;
      border: 1px solid $line;

      &:disabled {
        opacity: 0.35;
      }
    }
  }

  &__del {
    color: $danger;
  }

  &__filters {
    @include flex-cards(150px, 0.5rem);
  }
}

.add {
  align-self: flex-start;
}
</style>
