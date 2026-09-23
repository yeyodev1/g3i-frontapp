<script setup lang="ts">
import type { PostCard } from '@/types'
import { copy } from '@/config/copy.public'

// Sin fecha a propósito: pedido explícito de la clienta.
defineProps<{ post: PostCard }>()
</script>

<template>
  <article class="post-card">
    <RouterLink :to="`/blog/${post.slug}`" class="post-card__link">
      <div class="post-card__media">
        <img v-if="post.cover" :src="post.cover.url" :alt="post.cover.alt || post.title" loading="lazy" />
        <div v-else class="post-card__placeholder"><i class="fa-regular fa-newspaper"></i></div>
      </div>
      <div class="post-card__body">
        <h3 class="post-card__title">{{ post.title }}</h3>
        <p v-if="post.excerpt" class="post-card__excerpt">{{ post.excerpt }}</p>
        <span class="post-card__more">{{ copy.blog.readMore }} <i class="fa-solid fa-arrow-right"></i></span>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
.post-card {
  &__link {
    @include flex(column, stretch, flex-start, 1rem);
    height: 100%;

    &:hover img {
      transform: scale(1.03);
    }

    &:hover .post-card__more {
      border-color: $ink;
    }
  }

  &__media {
    aspect-ratio: 16 / 10;
    border-radius: 14px;
    overflow: hidden;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s $ease;
    }
  }

  &__placeholder {
    @include flex(row, center, center);
    height: 100%;
    color: $ink-muted;
    font-size: 1.6rem;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.5rem);
    flex: 1;
  }

  &__title {
    @include display($text-lg, 600);
    line-height: 1.25;
  }

  &__excerpt {
    font-size: $text-sm;
    color: $ink-soft;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__more {
    margin-top: auto;
    padding-top: 0.3rem;
    font-size: $text-sm;
    font-weight: 600;
    border-bottom: 1px solid $line;
    @include transition(border-color);

    i {
      font-size: 0.75em;
      color: $brand-blue;
      margin-left: 0.2rem;
    }
  }
}
</style>
