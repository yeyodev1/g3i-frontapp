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
    // Línea ember bajo el título, como en todas las secciones del diseño aprobado.
    rule?: boolean
  }>(),
  { level: 'h2', rule: true },
)
</script>

<template>
  <header class="heading" :class="{ 'heading--center': center }">
    <div class="heading__copy">
      <p v-if="eyebrow" class="heading__eyebrow">{{ eyebrow }}</p>
      <component
        :is="level"
        class="heading__title"
        :class="[`heading__title--${level}`, { 'heading__title--rule': rule }]"
      >
        {{ title }}
      </component>
      <p v-if="text" class="heading__text">{{ text }}</p>
    </div>
    <RouterLink v-if="linkTo && linkLabel" :to="linkTo" class="heading__link link-caps">
      {{ linkLabel }} <span aria-hidden="true">→</span>
    </RouterLink>
  </header>
</template>

<style scoped lang="scss">
.heading {
  @include flex(column, flex-start, space-between, 1.5rem);
  margin-bottom: clamp(2.25rem, 5vw, 3.5rem);

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

    .heading__title--rule::after {
      margin-inline: auto;
    }
  }

  &__copy {
    max-width: 44rem;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.9rem;
  }

  &__title {
    @include display($display-md);
    color: $ink;

    &--h1 {
      @include display(clamp(2.5rem, 1.8rem + 3vw, 4rem));
    }

    &--rule {
      @include title-rule;
    }
  }

  &__text {
    margin-top: 1.25rem;
    font-weight: 300;
    font-size: $text-lg;
    line-height: 1.65;
    color: $ink-soft;
    max-width: 58ch;
  }

  &__link {
    flex-shrink: 0;
  }
}
</style>
