<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { copyProperties } from '@/config/copy.properties'

defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const catalog = useCatalogStore()
const chips = computed(() => [{ key: '', label: copyProperties.allTypes }, ...catalog.propertyTypes])
</script>

<template>
  <div class="chips" role="group" :aria-label="copyProperties.typesLabel">
    <button
      v-for="chip in chips"
      :key="chip.key || 'all'"
      type="button"
      class="chips__item"
      :class="{ 'is-active': modelValue === chip.key }"
      :aria-pressed="modelValue === chip.key"
      @click="emit('update:modelValue', chip.key)"
    >
      {{ chip.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.chips {
  @include flex(row, center, flex-start, 0.5rem);
  // En móvil los tipos corren en una sola fila deslizable.
  overflow-x: auto;
  scrollbar-width: none;
  margin-inline: -1.25rem;
  padding-inline: 1.25rem;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('md') {
    flex-wrap: wrap;
    overflow: visible;
    margin-inline: 0;
    padding-inline: 0;
  }

  &__item {
    flex-shrink: 0;
    height: 36px;
    padding-inline: 1rem;
    border: 1px solid $gray-400;
    border-radius: $radius-pill;
    font-size: $text-sm;
    color: $ink-body;
    white-space: nowrap;
    @include transition;

    &:hover {
      border-color: $gray-600;
    }

    &.is-active {
      background: $navy-900;
      border-color: $navy-900;
      color: $surface;
    }
  }
}
</style>
