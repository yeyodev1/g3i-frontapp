<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ modelValue: string[]; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const draft = ref('')

function add() {
  const text = draft.value.trim()
  if (!text) return
  emit('update:modelValue', [...props.modelValue, text])
  draft.value = ''
}

function update(index: number, value: string) {
  emit('update:modelValue', props.modelValue.map((v, i) => (i === index ? value : v)))
}

function remove(index: number) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}

function move(index: number, dir: -1 | 1) {
  const to = index + dir
  if (to < 0 || to >= props.modelValue.length) return
  const next = [...props.modelValue]
  next.splice(to, 0, ...next.splice(index, 1))
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="strlist">
    <ul v-if="modelValue.length" class="strlist__list">
      <li v-for="(item, i) in modelValue" :key="i" class="strlist__item">
        <input :value="item" @input="update(i, ($event.target as HTMLInputElement).value)" />
        <button type="button" :disabled="i === 0" aria-label="Subir" @click="move(i, -1)">
          <i class="fa-solid fa-arrow-up"></i>
        </button>
        <button type="button" class="strlist__del" aria-label="Quitar" @click="remove(i)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    </ul>
    <div class="strlist__add">
      <input v-model="draft" :placeholder="placeholder || 'Escribe y presiona Agregar'" @keydown.enter.prevent="add" />
      <button type="button" class="btn btn--dark" :disabled="!draft.trim()" @click="add">
        <i class="fa-solid fa-plus"></i> Agregar
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.strlist {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.45rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.35rem);

    button {
      flex: none;
      width: 42px;
      height: 42px;
      border-radius: $radius-sm;
      border: 1px solid $line;

      &:disabled {
        opacity: 0.35;
      }
    }
  }

  &__del {
    color: $danger;
  }

  &__add {
    @include flex(row, center, flex-start, 0.5rem);

    .btn {
      flex: none;
      padding: 0.75rem 1.1rem;
    }
  }
}
</style>
