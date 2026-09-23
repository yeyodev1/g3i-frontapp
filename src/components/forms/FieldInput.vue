<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    label: string
    type?: string
    placeholder?: string
    required?: boolean
    autocomplete?: string
    inputmode?: 'text' | 'numeric' | 'tel' | 'email'
    multiline?: boolean
    rows?: number
  }>(),
  { type: 'text', rows: 4 },
)
const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <div class="field">
    <label :for="id" class="field__label">{{ label }}<span v-if="required" class="field__req" aria-hidden="true"> *</span></label>
    <textarea v-if="multiline" :id="id" v-model="model" :rows="rows" :placeholder="placeholder" :required="required"></textarea>
    <input
      v-else
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
    />
  </div>
</template>

<style scoped lang="scss">
// Campo de línea inferior del sistema de diseño: sin caja, label en mayúsculas.
.field {
  min-width: 0;

  &__label {
    @include caps(0.6875rem, 0.28em);
    color: $ink-muted;
    margin-bottom: 0.25rem;
  }

  &__req {
    color: $ember-500;
  }

  input,
  textarea {
    padding: 0;
    border: 0;
    border-bottom: 1px solid $gray-400;
    border-radius: 0;
    background: transparent;
    font-size: 1rem;
    font-weight: 300;
    color: $ink;

    &::placeholder {
      color: $gray-500;
    }

    &:hover {
      border-bottom-color: $gray-600;
    }

    &:focus {
      border-bottom-color: $navy-900;
      box-shadow: 0 1px 0 0 $navy-900;
    }

    &:focus-visible {
      outline: 2px solid $navy-900;
      outline-offset: 2px;
    }
  }

  input {
    height: 3rem;
  }

  textarea {
    padding-block: 0.75rem;
    resize: vertical;
    min-height: 6rem;
    line-height: 1.6;
  }
}
</style>
