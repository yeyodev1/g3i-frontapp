<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { site } from '@/config/site'

const catalog = useCatalogStore()

// Si la inmobiliaria cargó sus propias cifras se usan; si no, conteos reales.
const stats = computed(() => {
  const custom = catalog.site?.settings.stats ?? []
  if (custom.length) return custom
  const counts = catalog.site?.counts
  if (!counts) return []
  const labels = site.home.statsLabels
  return [
    { label: labels.properties, value: String(counts.properties) },
    { label: labels.projects, value: String(counts.projects) },
    { label: labels.sectors, value: String(counts.sectors) },
  ].filter((s) => s.value !== '0')
})
</script>

<template>
  <section v-if="stats.length" class="stats" aria-label="Cifras">
    <div class="stats__inner">
      <div v-for="stat in stats" :key="stat.label" class="stats__item">
        <span class="stats__value">{{ stat.value }}</span>
        <span class="stats__label">{{ stat.label }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.stats {
  border-bottom: 1px solid $line;

  &__inner {
    @include container;
    @include flex(row, stretch, flex-start);
    flex-wrap: wrap;
  }

  &__item {
    flex: 1 1 33%;
    min-width: 0;
    @include flex(column, flex-start, center, 0.2rem);
    padding: 1.6rem 0.75rem;
    border-left: 1px solid $line;

    &:first-child {
      border-left: none;
      padding-left: 0;
    }

    @include from('md') {
      padding: 2.2rem 2rem;
    }
  }

  &__value {
    @include display($display-sm, 600);
  }

  &__label {
    font-size: $text-xs;
    color: $ink-muted;
    line-height: 1.3;
  }
}
</style>
