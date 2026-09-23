<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { copyHome } from '@/config/copy.home'
import type { PopularSearch } from '@/types'

defineProps<{ popular: PopularSearch[] }>()

const router = useRouter()
const catalog = useCatalogStore()
const t = copyHome.search
const uid = useId()

const sector = ref('')
const type = ref('')
const price = ref('')

// Solo sectores con inmuebles publicados: nunca llevar a una búsqueda vacía.
const fields = computed(() => [
  {
    id: `${uid}-sector`,
    label: t.sector,
    placeholder: t.sectorAll,
    model: sector,
    options: catalog.activeSectors.map((s) => ({ key: s.key, label: s.label })),
  },
  {
    id: `${uid}-type`,
    label: t.type,
    placeholder: t.typeAll,
    model: type,
    options: catalog.propertyTypes.map((p) => ({ key: p.key, label: p.label })),
  },
  {
    id: `${uid}-price`,
    label: t.price,
    placeholder: t.priceAll,
    model: price,
    options: t.priceRanges.map((r) => ({ key: r.key, label: r.label })),
  },
])

function search() {
  const query: Record<string, string> = {}
  if (sector.value) query.sector = sector.value
  if (type.value) query.type = type.value
  const range = t.priceRanges.find((r) => r.key === price.value)
  if (range?.min) query.minPrice = range.min
  if (range?.max) query.maxPrice = range.max
  router.push({ path: '/propiedades', query })
}

onMounted(() => catalog.ensureBasics())
</script>

<template>
  <div class="finder">
    <form class="search" role="search" :aria-label="t.label" @submit.prevent="search">
      <div v-for="f in fields" :key="f.id" class="search__field">
        <label :for="f.id" class="search__label">{{ f.label }}</label>
        <div class="search__select">
          <select :id="f.id" v-model="f.model.value">
            <option value="">{{ f.placeholder }}</option>
            <option v-for="o in f.options" :key="o.key" :value="o.key">{{ o.label }}</option>
          </select>
          <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
        </div>
      </div>
      <button type="submit" class="btn btn--primary btn--lg search__btn">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> {{ t.button }}
      </button>
    </form>

    <div v-if="popular.length" class="popular">
      <span class="popular__label">{{ t.popular }}</span>
      <RouterLink
        v-for="item in popular"
        :key="item.label"
        :to="{ path: '/propiedades', query: item.query }"
        class="popular__chip"
      >
        {{ item.label }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search {
  @include flex(column, stretch, flex-start, 1.25rem);
  background: $paper;
  box-shadow: $shadow-lg;
  border-radius: $radius-sm;
  padding: 1.75rem 1.5rem;

  @include from('md') {
    flex-direction: row;
    align-items: flex-end;
    gap: 2rem;
    padding: 2rem 2.25rem;
  }

  &__field {
    flex: 1 1 0;
    min-width: 0;
  }

  &__label {
    @include caps(0.6875rem, 0.24em);
    color: $ink-soft;
    margin-bottom: 0.5rem;

    @include from('md') {
      margin-bottom: 0.9rem;
    }
  }

  // Selector de línea inferior, sin caja, como el ejemplo aprobado.
  &__select {
    position: relative;

    select {
      appearance: none;
      width: 100%;
      border: none;
      border-bottom: 1px solid $gray-300;
      border-radius: 0;
      background: transparent;
      padding: 0.35rem 2rem 0.8rem 0;
      font-size: 1rem;
      font-weight: 400;
      color: $ink;
      cursor: pointer;
      text-overflow: ellipsis;

      &:focus {
        border-color: $navy-900;
        box-shadow: 0 1px 0 0 $navy-900;
      }

      &:focus-visible {
        outline: 2px solid $navy-900;
        outline-offset: 4px;
      }
    }

    i {
      position: absolute;
      right: 0.25rem;
      top: 0.7rem;
      font-size: 0.7rem;
      color: $ink;
      pointer-events: none;
    }
  }

  &__btn {
    flex-shrink: 0;
    margin-top: 0.25rem;

    @include from('md') {
      margin-top: 0;
    }
  }
}

// Atajos discretos bajo el buscador.
.popular {
  @include flex(row, center, flex-start, 0.5rem 0.6rem);
  flex-wrap: wrap;
  margin-top: 1.25rem;

  @include from('md') {
    justify-content: center;
  }

  &__label {
    @include caps(0.6875rem, 0.22em);
    color: $ink-muted;
    margin-right: 0.4rem;
  }

  &__chip {
    font-size: $text-sm;
    font-weight: 300;
    padding: 0.35rem 0.85rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    color: $ink-body;
    @include transition;

    &:hover {
      border-color: $navy-900;
      color: $navy-900;
    }
  }
}
</style>
