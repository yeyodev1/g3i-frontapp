<script setup lang="ts">
// Encabezado de página interna: eyebrow ember, título Cormorant (segunda idea en cursiva) y línea.
defineProps<{ eyebrow: string; title: string; titleEm?: string; text?: string; center?: boolean }>()
</script>

<template>
  <header class="intro" :class="{ 'intro--center': center }">
    <p class="intro__eyebrow">{{ eyebrow }}</p>
    <h1 class="intro__title">
      {{ title }} <em v-if="titleEm">{{ titleEm }}</em>
    </h1>
    <p v-if="text" class="intro__text">{{ text }}</p>
  </header>
</template>

<style scoped lang="scss">
.intro {
  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(2.5rem, 1.6rem + 3.6vw, 4rem));
    line-height: 1.04;
    margin-top: 0.9rem;
    color: $ink;
    @include title-rule;

    em {
      font-style: italic;
    }
  }

  &__text {
    margin-top: 1.5rem;
    max-width: 56ch;
    font-size: 1.0625rem;
    font-weight: 300;
    line-height: 1.75;
    color: $ink-body;
  }

  &--center {
    text-align: center;

    .intro__title::after {
      margin-inline: auto;
    }

    .intro__text {
      margin-inline: auto;
    }
  }
}
</style>
