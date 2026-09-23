<script setup lang="ts">
defineProps<{
  label?: string
  help?: string
  error?: string
  forId?: string
  required?: boolean
}>()
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label v-if="label" class="field__label" :for="forId">
      {{ label }}<span v-if="required" class="field__req" aria-hidden="true">*</span>
    </label>
    <slot />
    <p v-if="error" class="field__error" role="alert">
      <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
    </p>
    <p v-else-if="help" class="field__help">{{ help }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start, 0.35rem);
  min-width: 0;

  &__label {
    font-size: 0.88rem;
    font-weight: 600;
    color: $ink;
    margin: 0;
  }

  &__req {
    color: $brand-orange;
    margin-left: 0.2rem;
  }

  &__help {
    font-size: 0.8rem;
    color: $ink-muted;
    line-height: 1.45;
  }

  &__error {
    font-size: 0.82rem;
    color: $danger;
    line-height: 1.45;
  }

  :deep(input),
  :deep(select),
  :deep(textarea) {
    min-height: 48px;
  }

  :deep(textarea) {
    resize: vertical;
    line-height: 1.55;
  }

  &--error {
    :deep(input),
    :deep(select),
    :deep(textarea) {
      border-color: $danger;
    }
  }
}
</style>
