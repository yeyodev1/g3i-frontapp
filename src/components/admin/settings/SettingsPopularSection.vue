<script setup lang="ts">
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import type { Settings } from '@/types'
import AdminSection from '../AdminSection.vue'

const props = defineProps<{ form: Settings }>()
const catalog = useAdminCatalogStore()

function add() {
  props.form.popularSearches.push({ label: '', query: { type: '', sector: '', condition: '' } })
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
    title="Más buscadas"
    text='Accesos rápidos bajo el buscador de la portada. Ej. "Casas en Cumbayá": tipo Casa y sector Cumbayá.'
  >
    <ul v-if="form.popularSearches.length" class="chips">
      <li v-for="(item, i) in form.popularSearches" :key="i" class="chip">
        <div class="chip__head">
          <input v-model="item.label" placeholder="Texto del botón, ej. Casas en Cumbayá" aria-label="Texto del botón" />
          <button type="button" :disabled="i === 0" aria-label="Subir" @click="move(i, -1)">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button type="button" class="chip__del" aria-label="Quitar" @click="remove(i)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="chip__filters">
          <select v-model="item.query.type" aria-label="Tipo">
            <option value="">Cualquier tipo</option>
            <option v-for="t in catalog.propertyTypes" :key="t.key" :value="t.key">{{ t.label }}</option>
          </select>
          <select v-model="item.query.sector" aria-label="Sector">
            <option value="">Cualquier sector</option>
            <option v-for="s in catalog.sectors" :key="s.key" :value="s.key">{{ s.label }}</option>
          </select>
          <select v-model="item.query.condition" aria-label="Etapa">
            <option value="">Cualquier etapa</option>
            <option v-for="c in catalog.conditions" :key="c.key" :value="c.key">{{ c.label }}</option>
          </select>
        </div>
      </li>
    </ul>
    <button type="button" class="btn btn--ghost add" @click="add"><i class="fa-solid fa-plus"></i> Agregar búsqueda</button>
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
