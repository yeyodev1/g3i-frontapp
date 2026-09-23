<script setup lang="ts">
import { copy } from '@/config/copy.public'

withDefaults(
  defineProps<{
    icon?: string
    title?: string
    text?: string
    retry?: boolean
    linkTo?: string
    linkLabel?: string
  }>(),
  { icon: 'fa-regular fa-compass' },
)
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="state" role="status">
    <span class="state__icon"><i :class="icon"></i></span>
    <h2 v-if="title" class="state__title">{{ title }}</h2>
    <p v-if="text" class="state__text">{{ text }}</p>
    <div class="state__actions">
      <button v-if="retry" type="button" class="btn btn--ghost" @click="emit('retry')">
        <i class="fa-solid fa-rotate-right"></i> {{ copy.common.retry }}
      </button>
      <RouterLink v-if="linkTo" :to="linkTo" class="btn btn--primary">{{ linkLabel }}</RouterLink>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.state {
  @include flex(column, center, center, 0.7rem);
  text-align: center;
  padding: $space-xl 1rem;
  border: 1px dashed $line;
  border-radius: $radius-md;
  background: $sand;

  &__icon {
    @include flex(row, center, center);
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: $surface;
    border: 1px solid $line;
    color: $brand-blue;
    font-size: 1.1rem;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__text {
    color: $ink-soft;
    max-width: 46ch;
  }

  &__actions {
    @include flex(row, center, center, 0.7rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;

    &:empty {
      display: none;
    }
  }
}
</style>
