<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; text?: string }>()
</script>

<template>
  <section class="page-hero">
    <div class="page-hero__inner">
      <p v-if="eyebrow" class="page-hero__eyebrow">{{ eyebrow }}</p>
      <h1 class="page-hero__title">{{ title }}</h1>
      <p v-if="text" class="page-hero__text">{{ text }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
// Encabezado sobrio de páginas internas: papel blanco, título ligero y línea ember.
.page-hero {
  background: $paper;

  &__inner {
    @include container;
    padding-block: clamp(2.75rem, 7vw, 4.5rem) clamp(1.5rem, 3vw, 2.25rem);
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.9rem;
  }

  &__title {
    @include display(clamp(2.5rem, 1.8rem + 3vw, 4rem));
    @include title-rule;
    color: $ink;
    max-width: 22ch;
  }

  &__text {
    margin-top: 1.4rem;
    font-size: $text-lg;
    font-weight: 300;
    line-height: 1.65;
    color: $ink-soft;
    max-width: 56ch;
  }
}
</style>
