<script setup lang="ts">
// Los números vacíos se guardan como null: así el sitio sabe que no debe
// mostrar el ícono, en lugar de pintar un "0 baños".
const props = defineProps<{
  modelValue: number | null
  id?: string
  suffix?: string
  placeholder?: string
  min?: number
  step?: number
}>()

const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>()

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  if (raw === '') return emit('update:modelValue', null)
  const value = Number(raw)
  emit('update:modelValue', Number.isFinite(value) ? value : null)
}
</script>

<template>
  <div class="number" :class="{ 'number--suffix': suffix }">
    <input
      :id="id"
      type="number"
      inputmode="decimal"
      :min="props.min ?? 0"
      :step="props.step ?? 'any'"
      :placeholder="placeholder"
      :value="modelValue ?? ''"
      @input="onInput"
    />
    <span v-if="suffix" class="number__suffix">{{ suffix }}</span>
  </div>
</template>

<style scoped lang="scss">
.number {
  position: relative;

  &--suffix input {
    padding-right: 3.2rem;
  }

  &__suffix {
    position: absolute;
    right: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.82rem;
    color: $ink-muted;
    pointer-events: none;
  }
}
</style>
