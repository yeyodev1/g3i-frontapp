<script setup lang="ts">
import { computed } from 'vue'
import { useFavorites } from '@/composables/useFavorites'
import { copyProperties } from '@/config/copy.properties'

const props = defineProps<{ id: string }>()
const { isFavorite, toggle } = useFavorites()
const active = computed(() => isFavorite(props.id))
</script>

<template>
  <button
    type="button"
    class="fav"
    :class="{ 'is-active': active }"
    :aria-pressed="active"
    :aria-label="active ? copyProperties.saved : copyProperties.save"
    :title="active ? copyProperties.saved : copyProperties.save"
    @click.prevent.stop="toggle(id)"
  >
    <i :class="active ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" aria-hidden="true"></i>
  </button>
</template>

<style scoped lang="scss">
.fav {
  @include flex(row, center, center);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba($surface, 0.88);
  backdrop-filter: blur(8px);
  color: $navy-900;
  font-size: 1rem;
  @include transition;

  &:hover {
    background: $surface;
  }

  &.is-active {
    color: $ember-500;
  }

  &.is-active i {
    animation: pop 0.35s $ease;
  }

  @include reduced-motion {
    &.is-active i {
      animation: none;
    }
  }
}

@keyframes pop {
  50% {
    transform: scale(1.25);
  }
}
</style>
