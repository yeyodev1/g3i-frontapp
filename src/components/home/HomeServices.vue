<script setup lang="ts">
import SectionHeading from '@/components/common/SectionHeading.vue'
import { copyHome } from '@/config/copy.home'

const t = copyHome.services
</script>

<template>
  <section class="services" data-reveal>
    <div class="services__inner">
      <SectionHeading :eyebrow="t.eyebrow" :title="t.title" center />
      <ul class="services__list">
        <li v-for="item in t.items" :key="item.title" class="service">
          <i :class="item.icon" class="service__icon" aria-hidden="true"></i>
          <h3 class="service__title">{{ item.title }}</h3>
          <p class="service__text">{{ item.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.services {
  padding-bottom: $space-section;

  &__inner {
    @include container;
  }

  &__list {
    list-style: none;
    @include flex-cards(230px, 1.5rem);
  }
}

.service {
  @include card;
  padding: 1.5rem 1.5rem 1.75rem;
  transition:
    transform 0.35s $ease,
    box-shadow 0.35s $ease;

  @include from('md') {
    padding: 2rem 1.75rem 2.25rem;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
  }

  &__icon {
    font-size: 1.5rem;
    color: $ember-500;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.625rem;
    font-weight: 400;
    line-height: 1.15;
    color: $ink;
    margin-top: 1rem;

    @include from('md') {
      margin-top: 1.4rem;
    }
  }

  &__text {
    margin-top: 0.65rem;
    font-size: 0.9375rem;
    font-weight: 300;
    line-height: 1.65;
    color: $ink-body;
  }
}
</style>
