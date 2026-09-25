<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import ProjectBlockHead from './ProjectBlockHead.vue'
import { useCatalogStore } from '@/stores/catalog'
import { formatPrice } from '@/utils/format'
import { copy } from '@/config/copy.public'
import { copyProjects } from '@/config/copy.projects'

const props = defineProps<{ project: Project }>()
const catalog = useCatalogStore()

const heading = computed(() => {
  const types = props.project.propertyTypes.map(
    (k) => copyProjects.typePlural[k] ?? catalog.typeLabel(k),
  )
  const text = types.join(' y ')
  return copyProjects.overviewTitle(
    text.charAt(0).toUpperCase() + text.slice(1),
    catalog.sectorLabel(props.project.sector),
  )
})

// Solo se pintan los datos que existen: nada de "—" vacíos.
const items = computed(() => {
  const p = props.project
  const t = copy.project
  const out: { icon: string; label: string; value: string }[] = []
  if (p.deliveryDate)
    out.push({ icon: 'fa-regular fa-calendar', label: t.delivery, value: p.deliveryDate })
  if (p.propertyTypes.length)
    out.push({
      icon: 'fa-regular fa-building',
      label: t.sells,
      value: p.propertyTypes.map((k) => catalog.typeLabel(k)).join(', '),
    })
  out.push({
    icon: 'fa-regular fa-map',
    label: t.location,
    value: `${p.city || copy.common.city} · ${catalog.sectorLabel(p.sector)}`,
  })
  if (p.priceFrom)
    out.push({ icon: 'fa-regular fa-gem', label: t.priceFrom, value: formatPrice(p.priceFrom) })
  if (p.developer)
    out.push({ icon: 'fa-regular fa-handshake', label: t.developer, value: p.developer })
  if (p.totalUnits)
    out.push({ icon: 'fa-regular fa-clone', label: t.totalUnits, value: String(p.totalUnits) })
  return out
})
</script>

<template>
  <div class="overview">
    <div class="overview__intro">
      <ProjectBlockHead
        :eyebrow="copyProjects.overviewEyebrow"
        :title="heading"
        rule
        class="overview__head"
      />
      <p v-if="project.summary" class="overview__lead">{{ project.summary }}</p>
    </div>

    <ul class="overview__facts">
      <li v-for="item in items" :key="item.label" class="overview__item">
        <i :class="item.icon" aria-hidden="true"></i>
        <span class="overview__label">{{ item.label }}</span>
        <span class="overview__value">{{ item.value }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.overview {
  &__intro {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('lg') {
      flex-direction: row;
      gap: 5rem;
    }
  }

  &__head {
    @include from('lg') {
      flex: 0 0 42%;
    }
  }

  &__lead {
    font-family: $font-display;
    font-weight: 300;
    font-size: clamp(1.3rem, 1.1rem + 0.7vw, 1.6rem);
    line-height: 1.4;
    color: $ink;
    text-wrap: pretty;

    @include from('lg') {
      flex: 1;
      padding-top: 0.2rem;
    }
  }

  &__facts {
    list-style: none;
    @include flex(row, stretch, flex-start);
    flex-wrap: wrap;
    margin-top: 3rem;
    border-top: 1px solid $line;

    @include from('lg') {
      margin-top: 4.5rem;
    }
  }

  &__item {
    @include flex(column, flex-start, flex-start, 0.3rem);
    flex: 1 1 50%;
    min-width: 0;
    padding: 1.6rem 1rem 1.4rem 0;
    border-bottom: 1px solid $line;

    @include from('md') {
      flex: 1 1 0;
      padding: 2.25rem 1.5rem 0;
      border-bottom: 0;

      & + & {
        border-left: 1px solid $line;
      }

      &:first-child {
        padding-left: 0;
      }
    }

    i {
      color: $blue-700;
      font-size: 1.35rem;
      margin-bottom: 0.9rem;
    }
  }

  &__label {
    @include caps(0.6875rem, 0.2em);
    color: $ink-muted;
  }

  &__value {
    font-family: $font-display;
    font-size: clamp(1.15rem, 1rem + 0.5vw, 1.5rem);
    line-height: 1.25;
    color: $ink;
  }
}
</style>
