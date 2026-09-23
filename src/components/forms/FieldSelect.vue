<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  label: string
  options: ReadonlyArray<{ key: string; label: string }>
  placeholder?: string
  required?: boolean
  hideLabel?: boolean
}>()
const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <div class="field">
    <label :for="id" :class="{ 'visually-hidden': hideLabel }">{{ label }}</label>
    <div class="field__select">
      <select :id="id" v-model="model" :required="required">
        <option v-if="placeholder !== undefined" value="">{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.key" :value="opt.key">{{ opt.label }}</option>
      </select>
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </div>
  </div>
</template>

<style scoped lang="scss">
.field {
  min-width: 0;

  &__select {
    position: relative;

    select {
      appearance: none;
      padding-right: 2.2rem;
      cursor: pointer;
      text-overflow: ellipsis;
    }

    i {
      position: absolute;
      right: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.7rem;
      color: $ink-muted;
      pointer-events: none;
    }
  }
}
</style>
