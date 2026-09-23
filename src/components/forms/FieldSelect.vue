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
    <label :for="id" class="field__label" :class="{ 'visually-hidden': hideLabel }">{{ label }}</label>
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
// Select de línea inferior del sistema de diseño: sin caja, label en mayúsculas.
.field {
  min-width: 0;

  &__label {
    @include caps(0.6875rem, 0.28em);
    color: $ink-muted;
    margin-bottom: 0.4rem;
  }

  &__select {
    position: relative;

    select {
      appearance: none;
      height: 3rem;
      padding: 0 1.75rem 0 0;
      border: 0;
      border-bottom: 1px solid $gray-400;
      border-radius: 0;
      background: transparent;
      font-size: 1rem;
      font-weight: 300;
      color: $ink;
      cursor: pointer;
      text-overflow: ellipsis;

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

    i {
      position: absolute;
      right: 0.15rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.62rem;
      color: $ink-soft;
      pointer-events: none;
    }
  }
}
</style>
