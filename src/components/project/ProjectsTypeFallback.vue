<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PropertyCard from '@/components/property/PropertyCard.vue'
import { propertyService } from '@/services/property.service'
import { copyProjects } from '@/config/copy.projects'
import type { Paginated, PropertyCard as Card } from '@/types'

const props = defineProps<{ type: string; sector?: string }>()
// Avisa al padre cuántas encontró (0 si falla) para que decida si muestra su estado vacío.
const emit = defineEmits<{ resolved: [total: number] }>()

const result = ref<Paginated<Card> | null>(null)
const plural = computed(() => copyProjects.typePlural[props.type] ?? 'propiedades')
const allLink = computed(() => ({
  path: '/propiedades',
  query: { type: props.type, ...(props.sector ? { sector: props.sector } : {}) },
}))

watch(
  () => [props.type, props.sector],
  async () => {
    result.value = null
    try {
      result.value = await propertyService.list({ type: props.type, sector: props.sector, limit: 6 })
    } catch {
      // Sin respaldo la vista muestra su estado vacío normal.
    }
    emit('resolved', result.value?.total ?? 0)
  },
  { immediate: true },
)
</script>

<template>
  <section v-if="result?.total" class="fallback" aria-live="polite">
    <p class="fallback__note">
      <i class="fa-solid fa-circle-info"></i> {{ copyProjects.noProjectsOfType(plural) }}
    </p>
    <div class="fallback__head">
      <div>
        <h2 class="fallback__title">{{ copyProjects.fallbackTitle(result.total, plural) }}</h2>
        <p class="fallback__text">{{ copyProjects.fallbackText }}</p>
      </div>
      <RouterLink :to="allLink" class="fallback__all">
        {{ copyProjects.fallbackAll(plural) }} <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </div>
    <div class="fallback__list">
      <PropertyCard v-for="p in result.items" :key="p._id" :property="p" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.fallback {
  @include flex(column, stretch, flex-start, 1.5rem);
  margin-top: 2rem;

  @include from('lg') {
    margin-top: 3rem;
  }

  &__note {
    @include flex(row, center, flex-start, 0.6rem);
    align-self: flex-start;
    font-size: $text-sm;
    font-weight: 300;
    color: $ink-body;
    background: $blue-100;
    padding: 0.7rem 1rem;
    border-left: 2px solid $navy-900;

    i {
      color: $navy-900;
    }
  }

  &__head {
    @include flex(row, flex-end, space-between, 1.25rem 2rem);
    flex-wrap: wrap;
    padding-top: 0.5rem;
  }

  &__title {
    @include display($display-sm, 300);
    color: $ink;
    @include title-rule;
  }

  &__text {
    color: $ink-soft;
    font-weight: 300;
    margin-top: 1rem;
  }

  &__all {
    @include flex(row, center, flex-start, 0.5rem);
    @include caps(0.72rem, 0.22em);
    color: $navy-900;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid $navy-900;
    @include transition;

    i {
      font-size: 0.7rem;
      transition: transform 0.3s $ease;
    }

    &:hover {
      color: $ember-600;
      border-color: $ember-600;

      i {
        transform: translateX(3px);
      }
    }
  }

  &__list {
    @include flex-cards(300px, 1.5rem);

    @include from('lg') {
      gap: 2rem;
    }

    > * {
      max-width: 560px;

      @include from('xl') {
        max-width: calc((100% - 4rem) / 3);
      }
    }
  }
}
</style>
