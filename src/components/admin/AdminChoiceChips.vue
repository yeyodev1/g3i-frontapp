<script setup lang="ts" generic="T extends string | string[]">
// Selección con botones grandes: más fácil que un select en el celular.
// Con `multiple` el v-model es un arreglo; sin él, un valor.
const props = defineProps<{
  modelValue: T
  options: { key: string; label: string; icon?: string; help?: string }[]
  multiple?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: T] }>()

function isOn(key: string) {
  return Array.isArray(props.modelValue) ? props.modelValue.includes(key) : props.modelValue === key
}

function toggle(key: string) {
  if (!props.multiple) return emit('update:modelValue', key as T)
  const list: string[] = Array.isArray(props.modelValue) ? props.modelValue : []
  emit('update:modelValue', (isOn(key) ? list.filter((k) => k !== key) : [...list, key]) as T)
}
</script>

<template>
  <div class="chips" :role="multiple ? 'group' : 'radiogroup'">
    <button
      v-for="opt in options"
      :key="opt.key"
      type="button"
      class="chips__item"
      :class="{ 'chips__item--on': isOn(opt.key) }"
      :role="multiple ? 'checkbox' : 'radio'"
      :aria-checked="isOn(opt.key)"
      @click="toggle(opt.key)"
    >
      <i v-if="opt.icon" :class="opt.icon"></i>
      <i v-else-if="multiple" :class="isOn(opt.key) ? 'fa-solid fa-square-check' : 'fa-regular fa-square'"></i>
      <span class="chips__text">
        <span>{{ opt.label }}</span>
        <small v-if="opt.help">{{ opt.help }}</small>
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.chips {
  @include flex(row, stretch, flex-start, 0.5rem);
  flex-wrap: wrap;

  &__item {
    @include flex(row, center, flex-start, 0.55rem);
    text-align: left;
    min-height: 46px;
    padding: 0.55rem 1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    font-size: 0.88rem;
    font-weight: 500;
    @include transition(border-color);

    i {
      color: $ink-muted;
      width: 1.1em;
      text-align: center;
    }

    &:hover {
      border-color: $ink-soft;
    }

    &--on {
      border-color: $ink;
      background: $sand;
      box-shadow: inset 0 0 0 1px $ink;

      i {
        color: $brand-blue;
      }
    }
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.1rem);

    small {
      font-size: 0.74rem;
      color: $ink-muted;
      font-weight: 400;
      line-height: 1.35;
    }
  }
}
</style>
