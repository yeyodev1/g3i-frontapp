<script setup lang="ts">
// Buscador + selects de filtro. Los selects llegan por slot para que cada
// listado decida cuáles tiene.
defineProps<{ placeholder?: string }>()
const q = defineModel<string>('q', { default: '' })
</script>

<template>
  <div class="filters">
    <div class="filters__search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input v-model="q" type="search" :placeholder="placeholder || 'Buscar…'" aria-label="Buscar" />
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.filters {
  @include flex(row, center, flex-start, 0.6rem);
  flex-wrap: wrap;
  margin-bottom: 1.2rem;

  > :deep(select) {
    flex: 1 1 150px;
    min-height: 48px;

    @include from('md') {
      flex: 0 0 200px;
    }
  }

  &__search {
    position: relative;
    flex: 1 1 100%;

    @include from('md') {
      flex: 1 1 260px;
    }

    i {
      position: absolute;
      left: 0.95rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
    }

    input {
      padding-left: 2.6rem;
      min-height: 48px;
    }
  }
}
</style>
