<script setup lang="ts">
import { copyHome } from '@/config/copy.home'
import type { HomeStat } from '@/types'

defineProps<{ stats: HomeStat[] }>()

const t = copyHome.stats
const iconFor = (key: string) =>
  t.icons.find((i) => i.key === key)?.icon ?? 'fa-solid fa-house-chimney'
</script>

<template>
  <!-- Banda de cifras bajo el buscador (pedido de la clienta, 24/9). Se editan en Ajustes → Cifras de Inicio. -->
  <section v-if="stats.length" class="stats" :aria-label="t.label">
    <ul class="stats__list">
      <li v-for="(s, i) in stats" :key="i" class="stats__item">
        <i :class="iconFor(s.icon)" aria-hidden="true"></i>
        <span class="stats__label">{{ s.label }}</span>
        <strong class="stats__value">{{ s.value }}</strong>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.stats {
  @include container;
  padding-block: 2.5rem 3rem;

  @include from('lg') {
    padding-block: 3rem 3.5rem;
  }

  &__list {
    list-style: none;
    @include flex(row, flex-start, center, 1.75rem 1rem);
    flex-wrap: wrap;
  }

  &__item {
    flex: 0 1 11rem;
    @include flex(column, center, flex-start, 0.3rem);
    text-align: center;

    i {
      font-size: 1.6rem;
      color: $navy-900;
      margin-bottom: 0.35rem;
    }
  }

  &__label {
    @include caps(0.66rem, 0.18em);
    color: $ink-soft;
  }

  &__value {
    font: 300 clamp(1.8rem, 1.5rem + 1vw, 2.4rem) / 1 $font-display;
    color: $ink;
  }
}
</style>
