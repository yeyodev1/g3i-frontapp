<script setup lang="ts">
import { site } from '@/config/site'
import { copyHome } from '@/config/copy.home'

const t = copyHome.sellCta
</script>

<template>
  <section class="sell">
    <div class="sell__inner">
      <div class="sell__copy">
        <p class="sell__eyebrow">{{ t.eyebrow }}</p>
        <h2 class="sell__title">{{ t.title }}</h2>
      </div>
      <RouterLink :to="site.sellLink.to" class="btn btn--primary btn--lg sell__btn">{{
        t.button
      }}</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sell {
  background: $navy-900;
  color: $on-inverse;
  padding-block: clamp(4rem, 9vw, 6rem);

  &__inner {
    @include container;
    @include flex(column, flex-start, space-between, 2rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 3rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $ember-300;
  }

  &__title {
    @include display(clamp(2.2rem, 1.7rem + 2vw, 3rem));
    color: $on-inverse;
    margin-top: 0.9rem;
    max-width: 620px;
  }

  &__btn {
    flex-shrink: 0;

    @include until('sm') {
      width: 100%;
      padding-inline: 1rem;
    }
  }
}
</style>
