<script setup lang="ts">
import SectionHeading from '@/components/common/SectionHeading.vue'
import PostCard from '@/components/common/PostCard.vue'
import type { PostCard as Post } from '@/types'
import { copyHome } from '@/config/copy.home'

defineProps<{ posts: Post[] }>()
const t = copyHome.blog
</script>

<template>
  <section class="blog" :class="{ 'blog--compact': !posts.length }" data-reveal>
    <div class="blog__inner">
      <template v-if="posts.length">
        <SectionHeading
          :eyebrow="t.eyebrow"
          :title="t.title"
          :link-label="t.link"
          link-to="/blog"
        />
        <div class="blog__list">
          <PostCard v-for="post in posts" :key="post._id" :post="post" />
        </div>
      </template>
      <!-- Acceso visible a preguntas frecuentes, aunque aún no haya artículos. -->
      <div class="blog__faq">
        <p class="blog__faq-title">{{ t.faqTitle }}</p>
        <RouterLink to="/preguntas-frecuentes" class="link-caps">
          {{ t.faqLink }} <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.blog {
  padding-block: $space-section;

  &__inner {
    @include container;
  }

  &--compact {
    padding-block: 0 $space-section;
  }

  &__list {
    @include flex-cards(280px, 2.5rem 1.5rem);
  }

  &__faq {
    @include flex(column, flex-start, space-between, 1rem 2rem);
    margin-top: 3.5rem;
    padding: 1.75rem 1.5rem;
    border: 1px solid $line;
    border-left: 2px solid $ember-500;
    background: $gray-50;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      padding-inline: 2.25rem;
    }
  }

  &--compact &__faq {
    margin-top: 0;
  }

  &__faq-title {
    font-family: $font-display;
    font-size: clamp(1.4rem, 1.2rem + 0.8vw, 1.75rem);
    font-weight: 300;
    line-height: 1.2;
    color: $ink;
  }
}
</style>
