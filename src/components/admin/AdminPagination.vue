<script setup lang="ts">
defineProps<{ page: number; pages: number }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button class="btn btn--ghost" :disabled="page <= 1" @click="emit('change', page - 1)">
      <i class="fa-solid fa-chevron-left"></i> Anterior
    </button>
    <span class="pager__info">Página {{ page }} de {{ pages }}</span>
    <button class="btn btn--ghost" :disabled="page >= pages" @click="emit('change', page + 1)">
      Siguiente <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, center, 0.8rem);
  flex-wrap: wrap;
  margin-top: 1.5rem;

  .btn {
    padding: 0.7rem 1.1rem;
  }

  &__info {
    font-size: 0.85rem;
    color: $ink-soft;
  }
}
</style>
