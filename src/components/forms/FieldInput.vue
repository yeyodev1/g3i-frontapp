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
    <label :for="id">{{ label }}<span v-if="required" class="field__req" aria-hidden="true"> *</span></label>
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
.field {
  min-width: 0;

  textarea {
    resize: vertical;
    min-height: 6rem;
  }

  &__req {
    color: $brand-orange;
  }
}
</style>
