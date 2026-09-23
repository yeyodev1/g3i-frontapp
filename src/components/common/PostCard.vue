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
        <div v-else class="post-card__placeholder"><i class="fa-regular fa-newspaper" aria-hidden="true"></i></div>
      </div>
      <div class="post-card__body">
        <h3 class="post-card__title">{{ post.title }}</h3>
        <p v-if="post.excerpt" class="post-card__excerpt">{{ post.excerpt }}</p>
        <span class="post-card__more">{{ copy.blog.readMore }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
.post-card {
  &__link {
    @include flex(column, stretch, flex-start);
    height: 100%;
    @include focus-ring;

    &:hover img {
      transform: scale(1.04);
    }

    &:hover .post-card__more {
      color: $ember-600;
      border-color: $ember-600;
    }
  }

  &__media {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s $ease;
    }
  }

  &__placeholder {
    @include flex(row, center, center);
    height: 100%;
    color: $ink-muted;
    font-size: 1.6rem;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.7rem);
    flex: 1;
    padding-top: 1.25rem;
  }

  &__title {
    font: 400 1.625rem/1.15 $font-display;
    color: $ink;
    text-wrap: pretty;
  }

  &__excerpt {
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.65;
    color: $ink-body;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__more {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    @include caps(0.7rem, 0.22em);
    color: $navy-900;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid $navy-900;
    @include transition;

    i {
      font-size: 0.8em;
    }
  }
}
</style>
