<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { copy } from '@/config/copy.public'

useSeo({ title: copy.notFound.title, description: copy.notFound.text })
</script>

<template>
  <section class="not-found">
    <p class="not-found__code">{{ copy.notFound.code }}</p>
    <h1 class="not-found__title">{{ copy.notFound.title }}</h1>
    <p class="not-found__text">{{ copy.notFound.text }}</p>
    <div class="not-found__actions">
      <RouterLink to="/propiedades" class="btn btn--primary">{{
        copy.notFound.seeProperties
      }}</RouterLink>
      <RouterLink to="/" class="btn btn--ghost">{{ copy.common.backHome }}</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  @include container(680px);
  @include flex(column, center, center, 1rem);
  flex: 1;
  text-align: center;
  padding-block: $space-section;

  &__code {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(2.5rem, 1.8rem + 3vw, 4rem));
    @include title-rule;
    color: $ink;

    &::after {
      margin-inline: auto;
    }
  }

  &__text {
    margin-top: 0.6rem;
    font-size: $text-lg;
    font-weight: 300;
    color: $ink-soft;
    max-width: 42ch;
  }

  &__actions {
    @include flex(row, center, center, 0.75rem);
    flex-wrap: wrap;
    margin-top: 1.25rem;
  }
}
</style>
