<script setup lang="ts">
// Encabezado de sección de la ficha: eyebrow en mayúsculas + título Cormorant (+ raya ember opcional).
defineProps<{ eyebrow: string; title?: string; light?: boolean; rule?: boolean }>()
</script>

<template>
  <div class="bhead" :class="{ 'bhead--light': light, 'bhead--rule': rule }">
    <p class="bhead__eyebrow">{{ eyebrow }}</p>
    <h2 v-if="title" class="bhead__title">{{ title }}</h2>
  </div>
</template>

<style scoped lang="scss">
.bhead {
  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(2rem, 1.5rem + 2vw, 3.5rem), 300);
    line-height: 1.04;
    color: $ink;
    margin-top: 0.9rem;
  }

  &--rule &__title {
    @include title-rule;
  }

  &--light {
    .bhead__eyebrow {
      color: $ember-300;
    }

    .bhead__title {
      color: $on-inverse;
    }
  }
}
</style>
