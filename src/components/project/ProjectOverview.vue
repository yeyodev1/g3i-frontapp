<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import { useCatalogStore } from '@/stores/catalog'
import { formatPrice } from '@/utils/format'
import { copy } from '@/config/copy.public'

const props = defineProps<{ project: Project }>()
const catalog = useCatalogStore()

// Solo se pintan los datos que existen: nada de "—" vacíos.
const items = computed(() => {
  const p = props.project
  const t = copy.project
  const out: { icon: string; label: string; value: string }[] = []
  if (p.deliveryDate) out.push({ icon: 'fa-regular fa-calendar', label: t.delivery, value: p.deliveryDate })
  if (p.propertyTypes.length)
    out.push({ icon: 'fa-solid fa-house', label: t.sells, value: p.propertyTypes.map((k) => catalog.typeLabel(k)).join(', ') })
  out.push({
    icon: 'fa-solid fa-location-dot',
    label: t.location,
    value: `${catalog.sectorLabel(p.sector)} · ${p.city || copy.common.city}`,
  })
  if (p.priceFrom) out.push({ icon: 'fa-solid fa-tag', label: t.priceFrom, value: formatPrice(p.priceFrom) })
  if (p.developer) out.push({ icon: 'fa-solid fa-helmet-safety', label: t.developer, value: p.developer })
  if (p.totalUnits) out.push({ icon: 'fa-solid fa-building', label: t.totalUnits, value: String(p.totalUnits) })
  return out
})
</script>

<template>
  <ul class="overview">
    <li v-for="item in items" :key="item.label" class="overview__item">
      <i :class="item.icon" aria-hidden="true"></i>
      <span class="overview__label">{{ item.label }}</span>
      <span class="overview__value">{{ item.value }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.overview {
  list-style: none;
  @include flex-cards(150px, 0.75rem);

  &__item {
    @include flex(column, flex-start, flex-start, 0.15rem);
    padding: 1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;

    i {
      color: $brand-blue;
      margin-bottom: 0.45rem;
    }
  }

  &__label {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__value {
    @include display($text-base, 600);
    letter-spacing: -0.005em;
    line-height: 1.3;
  }
}
</style>
