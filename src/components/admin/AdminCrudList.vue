<script setup lang="ts" generic="T extends { _id: string }">
defineProps<{ items: T[]; loading: boolean; emptyText: string; addLabel: string }>()
const emit = defineEmits<{ add: []; edit: [item: T]; remove: [item: T]; move: [item: T, direction: -1 | 1] }>()
</script>

<template>
  <p v-if="loading && !items.length" class="crud__loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando…</p>

  <div v-else-if="!items.length" class="crud__empty">
    <i class="fa-regular fa-folder-open"></i>
    <p>{{ emptyText }}</p>
    <button class="btn btn--dark" @click="emit('add')">{{ addLabel }}</button>
  </div>

  <ul v-else class="crud">
    <li v-for="(item, i) in items" :key="item._id" class="crud__item">
      <div class="crud__order">
        <button :disabled="i === 0" aria-label="Subir" @click="emit('move', item, -1)">
          <i class="fa-solid fa-chevron-up"></i>
        </button>
        <button :disabled="i === items.length - 1" aria-label="Bajar" @click="emit('move', item, 1)">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      </div>
      <button class="crud__body" @click="emit('edit', item)">
        <slot name="item" :item="item" />
      </button>
      <div class="crud__actions">
        <button aria-label="Editar" @click="emit('edit', item)"><i class="fa-solid fa-pen"></i></button>
        <button class="crud__del" aria-label="Eliminar" @click="emit('remove', item)"><i class="fa-solid fa-trash"></i></button>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.crud {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.6rem);

  &__loading {
    color: $ink-soft;
    padding: 2rem 0;
  }

  &__empty {
    @include card;
    @include flex(column, center, center, 0.8rem);
    text-align: center;
    padding: 2.5rem 1rem;
    border-style: dashed;
    color: $ink-soft;

    i {
      font-size: 1.8rem;
      color: $ink-muted;
    }
  }

  &__item {
    @include card;
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.7rem;
  }

  &__order {
    @include flex(column, center, center, 0.15rem);

    button {
      width: 34px;
      height: 30px;
      border-radius: 8px;
      color: $ink-soft;

      &:disabled {
        opacity: 0.3;
      }

      &:hover {
        background: $sand;
      }
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    text-align: left;
    @include flex(row, center, flex-start, 0.8rem);
  }

  &__actions {
    @include flex(row, center, flex-end, 0.2rem);

    button {
      width: 44px;
      height: 44px;
      border-radius: 50%;

      &:hover {
        background: $sand;
      }
    }
  }

  &__del {
    color: $danger;
  }
}
</style>
