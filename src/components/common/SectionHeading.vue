<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    text?: string
    linkLabel?: string
    linkTo?: string
    level?: 'h1' | 'h2'
    center?: boolean
  }>(),
  { level: 'h2' },
)
</script>

<template>
  <header class="heading" :class="{ 'heading--center': center }">
    <div class="heading__copy">
      <p v-if="eyebrow" class="heading__eyebrow">{{ eyebrow }}</p>
      <component :is="level" class="heading__title" :class="`heading__title--${level}`">{{ title }}</component>
      <p v-if="text" class="heading__text">{{ text }}</p>
    </div>
    <RouterLink v-if="linkTo && linkLabel" :to="linkTo" class="heading__link">
      {{ linkLabel }} <i class="fa-solid fa-arrow-right"></i>
    </RouterLink>
  </header>
</template>

<style scoped lang="scss">
.heading {
  @include flex(column, flex-start, space-between, 1rem);
  margin-bottom: $space-lg;

  @include from('md') {
    flex-direction: row;
    align-items: flex-end;
  }

  &--center {
    align-items: center;
    text-align: center;

    .heading__copy {
      margin-inline: auto;
    }
  }

  &__copy {
    max-width: 44rem;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.6rem);
    margin-bottom: 0.7rem;

    &::before {
      content: '';
      width: 1.4rem;
      height: 1px;
      background: $brand-orange;
    }
  }

  &__title {
    @include display($display-sm, 600);
    color: $ink;

    &--h1 {
      @include display($display-md, 600);
    }
  }

  &__text {
    margin-top: 0.7rem;
    color: $ink-soft;
    max-width: 58ch;
  }

  &__link {
    flex-shrink: 0;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    border-bottom: 1px solid $line;
    padding-bottom: 0.2rem;
    @include transition;

    i {
      font-size: 0.75em;
      margin-left: 0.3rem;
      color: $brand-blue;
    }

    &:hover {
      border-color: $ink;
    }
  }
}
</style>
