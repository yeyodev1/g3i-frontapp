<script setup lang="ts">
import { useCatalogStore } from '@/stores/catalog'

// solid: navy sobre la foto de la tarjeta. line: raya ember + texto, para la portada oscura.
withDefaults(defineProps<{ stage: string; tone?: 'solid' | 'line' }>(), { tone: 'solid' })
const catalog = useCatalogStore()
</script>

<template>
  <span class="stage" :class="[`stage--${stage}`, `stage--${tone}`]">
    <span class="stage__mark" aria-hidden="true"></span>
    {{ catalog.stageLabel(stage) }}
  </span>
</template>

<style scoped lang="scss">
.stage {
  @include flex(row, center, flex-start, 0.5rem);
  display: inline-flex;
  @include caps(0.625rem, 0.22em);
  white-space: nowrap;

  &--solid {
    height: 24px;
    padding: 0 0.65rem;
    border-radius: $radius-sm;
    background: $navy-900;
    color: $surface;

    .stage__mark {
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
      background: $blue-300;
    }
  }

  &--solid.stage--en-construccion .stage__mark {
    background: $ember-300;
  }

  &--solid.stage--por-estrenar .stage__mark {
    background: #9fd0b3;
  }

  &--line {
    @include caps(0.75rem, 0.28em);
    color: $on-inverse;
    gap: 0.9rem;

    .stage__mark {
      width: 40px;
      height: 2px;
      background: $ember-300;
    }
  }
}
</style>
