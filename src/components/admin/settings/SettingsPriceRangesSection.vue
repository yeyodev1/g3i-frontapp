<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { formatPrice } from '@/utils/format'
import { inPriceRange, priceRangeLabel, suggestPriceRanges } from '@/utils/priceRanges'
import type { Settings } from '@/types'
import AdminSection from '../AdminSection.vue'
import AdminNumber from '../AdminNumber.vue'

const props = defineProps<{ form: Settings }>()

// Precios publicados: para contar cuántas propiedades caen en cada rango y sugerir cortes.
const site = useCatalogStore()
onMounted(() => site.ensureSite())
const prices = computed(() => site.site?.counts.prices ?? [])
const countFor = (i: number) =>
  prices.value.filter((p) => inPriceRange(p, props.form.priceRanges[i]!)).length
const invalid = (i: number) => {
  const { min, max } = props.form.priceRanges[i]!
  return (!min && !max) || (!!min && !!max && min >= max)
}

function add() {
  const last = props.form.priceRanges.at(-1)
  props.form.priceRanges.push({ min: last?.max ?? null, max: null })
}

function suggest() {
  props.form.priceRanges = suggestPriceRanges(prices.value)
}
</script>

<template>
  <AdminSection
    id="precios"
    title="Rangos de precio"
    text="Las opciones de «Precio» en el buscador de Inicio y en el mapa. Deja «Desde» vacío para «Hasta $…» y «Hasta» vacío para «Más de $…». En el sitio solo aparecen los rangos que tienen propiedades publicadas."
  >
    <p v-if="prices.length" class="hint">
      Hoy tus {{ prices.length }} propiedades publicadas van de {{ formatPrice(prices[0]) }} a
      {{ formatPrice(prices.at(-1)) }}.
    </p>

    <ul v-if="form.priceRanges.length" class="ranges">
      <li v-for="(r, i) in form.priceRanges" :key="i" class="ranges__row">
        <AdminNumber
          v-model="r.min"
          suffix="USD"
          placeholder="Desde"
          :min="0"
          :step="10000"
          aria-label="Desde"
        />
        <AdminNumber
          v-model="r.max"
          suffix="USD"
          placeholder="Hasta"
          :min="0"
          :step="10000"
          aria-label="Hasta"
        />
        <span class="ranges__preview" :class="{ 'is-bad': invalid(i) }">
          <template v-if="invalid(i)">Revisa: «Desde» debe ser menor que «Hasta»</template>
          <template v-else>
            {{ priceRangeLabel(r) }}
            <small>{{ countFor(i) }} {{ countFor(i) === 1 ? 'propiedad' : 'propiedades' }}</small>
          </template>
        </span>
        <button type="button" aria-label="Quitar rango" @click="form.priceRanges.splice(i, 1)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    </ul>

    <div class="actions">
      <button type="button" class="btn btn--ghost" @click="add">
        <i class="fa-solid fa-plus"></i> Agregar rango
      </button>
      <button type="button" class="btn btn--ghost" :disabled="prices.length < 3" @click="suggest">
        <i class="fa-solid fa-wand-magic-sparkles"></i> Sugerir según mis propiedades
      </button>
    </div>
  </AdminSection>
</template>

<style scoped lang="scss">
.hint {
  font-size: 0.85rem;
  color: $ink-soft;
}

.ranges {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.5rem);

  &__row {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;

    > :first-child,
    > :nth-child(2) {
      flex: 0 1 11rem;
    }

    button {
      flex: none;
      width: 42px;
      height: 42px;
      color: $danger;
      border: 1px solid $line;
      border-radius: $radius-sm;
    }
  }

  &__preview {
    flex: 1 1 12rem;
    @include flex(column, flex-start, center, 0.1rem);
    font-size: 0.9rem;
    color: $ink;

    small {
      font-size: 0.78rem;
      color: $ink-muted;
    }

    &.is-bad {
      color: $danger;
      font-size: 0.82rem;
    }
  }
}

.actions {
  @include flex(row, center, flex-start, 0.5rem);
  flex-wrap: wrap;
}
</style>
