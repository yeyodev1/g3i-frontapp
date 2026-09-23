<script setup lang="ts">
import { computed } from 'vue'
import { useAdminCatalogStore } from '@/stores/adminCatalog'
import AdminChoiceChips from './AdminChoiceChips.vue'

const props = defineProps<{ modelValue: string[]; scope: 'property' | 'project' }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const catalog = useAdminCatalogStore()
const options = computed(() => catalog.amenitiesFor(props.scope))
</script>

<template>
  <div class="amenities">
    <p class="amenities__count">{{ modelValue.length }} marcadas</p>
    <AdminChoiceChips
      :model-value="modelValue"
      :options="options"
      multiple
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.amenities {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__count {
    font-size: 0.82rem;
    color: $ink-muted;
  }
}
</style>
