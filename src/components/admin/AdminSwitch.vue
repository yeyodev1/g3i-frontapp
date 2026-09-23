<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; help?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <label class="switch">
    <input
      type="checkbox"
      class="visually-hidden"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="switch__track" aria-hidden="true"><span class="switch__thumb"></span></span>
    <span class="switch__text">
      <span class="switch__label">{{ label }}</span>
      <span v-if="help" class="switch__help">{{ help }}</span>
    </span>
  </label>
</template>

<style scoped lang="scss">
.switch {
  @include flex(row, flex-start, flex-start, 0.8rem);
  cursor: pointer;
  margin: 0;
  min-height: 44px;

  &__track {
    flex: none;
    width: 46px;
    height: 26px;
    border-radius: $radius-pill;
    background: $line;
    position: relative;
    margin-top: 0.1rem;
    @include transition(background);
  }

  &__thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm;
    @include transition(transform);
  }

  input:checked + &__track {
    background: $accent;

    .switch__thumb {
      transform: translateX(20px);
    }
  }

  input:focus-visible + &__track {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.15rem);
  }

  &__label {
    font-size: 0.92rem;
    font-weight: 600;
    color: $ink;
  }

  &__help {
    font-size: 0.8rem;
    color: $ink-muted;
    font-weight: 400;
    line-height: 1.45;
  }
}
</style>
