<script setup lang="ts">
defineProps<{ id?: string; step?: number; title: string; text?: string }>()
</script>

<template>
  <section :id="id" class="section">
    <header class="section__head">
      <span v-if="step" class="section__step">{{ step }}</span>
      <div>
        <h2 class="section__title">{{ title }}</h2>
        <p v-if="text" class="section__text">{{ text }}</p>
      </div>
    </header>
    <div class="section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.section {
  @include card;
  padding: 1.25rem 1rem;
  scroll-margin-top: 130px;

  @include from('md') {
    padding: 1.8rem 1.8rem;
  }

  &__head {
    @include flex(row, flex-start, flex-start, 0.8rem);
    margin-bottom: 1.3rem;
  }

  &__step {
    flex: none;
    @include flex(row, center, center);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: $accent;
    color: $surface;
    font-size: 0.85rem;
    font-weight: 700;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 700;
  }

  &__text {
    font-size: 0.85rem;
    color: $ink-soft;
    margin-top: 0.2rem;
  }

  &__body {
    @include flex(column, stretch, flex-start, 1.2rem);
  }
}
</style>
