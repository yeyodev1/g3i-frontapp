<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/config/copy.public'

const props = defineProps<{ page: number; pages: number }>()
const emit = defineEmits<{ go: [page: number] }>()

// Ventana corta de páginas alrededor de la actual; en móvil no cabe más.
const numbers = computed(() => {
  const start = Math.max(1, Math.min(props.page - 2, props.pages - 4))
  const end = Math.min(props.pages, start + 4)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button
      type="button"
      class="pager__btn"
      :disabled="page <= 1"
      :aria-label="copy.common.prev"
      @click="emit('go', page - 1)"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <button
      v-for="n in numbers"
      :key="n"
      type="button"
      class="pager__btn"
      :class="{ 'pager__btn--active': n === page }"
      :aria-current="n === page ? 'page' : undefined"
      @click="emit('go', n)"
    >
      {{ n }}
    </button>
    <button
      type="button"
      class="pager__btn"
      :disabled="page >= pages"
      :aria-label="copy.common.next"
      @click="emit('go', page + 1)"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, center, 0.4rem);
  margin-top: $space-lg;

  &__btn {
    min-width: 2.75rem;
    height: 2.75rem;
    padding-inline: 0.6rem;
    border-radius: $radius-sm;
    border: 1px solid $line;
    font-size: $text-sm;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: $ink-soft;
    @include transition;

    &:hover:not(:disabled) {
      border-color: $navy-900;
      color: $navy-900;
    }

    &--active {
      background: $navy-900;
      border-color: $navy-900;
      color: $on-inverse;
    }

    &:disabled {
      opacity: 0.35;
      cursor: default;
    }
  }
}
</style>
