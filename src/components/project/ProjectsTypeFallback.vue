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
  @include flex(column, stretch, flex-start, 1.25rem);
  margin-top: 1.5rem;

  &__note {
    @include flex(row, center, flex-start, 0.5rem);
    align-self: flex-start;
    font-size: $text-sm;
    color: $ink-soft;
    background: $sand;
    padding: 0.55rem 0.9rem;
    border-radius: $radius-pill;

    i {
      color: $brand-blue;
    }
  }

  &__head {
    @include flex(row, flex-end, space-between, 1rem);
    flex-wrap: wrap;
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__text {
    color: $ink-soft;
    margin-top: 0.3rem;
  }

  &__all {
    @include flex(row, center, flex-start, 0.45rem);
    font-weight: 600;
    font-size: $text-sm;
    color: $ink;
    border-bottom: 1px solid $brand-orange;
    padding-bottom: 0.15rem;

    i {
      font-size: 0.75rem;
      transition: transform 0.3s $ease;
    }

    &:hover i {
      transform: translateX(3px);
    }
  }

  &__list {
    @include flex-cards(290px, 1.5rem);
  }
}
</style>
