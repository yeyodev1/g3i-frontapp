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
.page-hero {
  background: $sand;
  border-bottom: 1px solid $line;

  &__inner {
    @include container;
    padding-block: clamp(2.5rem, 6vw, 4.5rem);
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.6rem);
    margin-bottom: 0.8rem;

    &::before {
      content: '';
      width: 1.4rem;
      height: 1px;
      background: $brand-orange;
    }
  }

  &__title {
    @include display($display-md, 600);
    max-width: 22ch;
  }

  &__text {
    margin-top: 0.9rem;
    color: $ink-soft;
    font-size: $text-lg;
    max-width: 56ch;
  }
}
</style>
