<script setup lang="ts">
import SectionHeading from '@/components/common/SectionHeading.vue'
import type { PostCard } from '@/types'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'

defineProps<{ posts: PostCard[] }>()
</script>

<template>
  <section v-if="posts.length" class="blog">
    <div class="blog__inner">
      <SectionHeading :eyebrow="site.home.blogEyebrow" :title="site.home.blogTitle" :link-label="copy.home.seeBlog" link-to="/blog" />
      <div class="blog__list">
        <RouterLink v-for="post in posts" :key="post._id" :to="`/blog/${post.slug}`" class="post">
          <div class="post__media">
            <img v-if="post.cover" :src="post.cover.url" :alt="post.cover.alt || post.title" loading="lazy" />
          </div>
          <h3 class="post__title">{{ post.title }}</h3>
          <p v-if="post.excerpt" class="post__excerpt">{{ post.excerpt }}</p>
          <span class="post__more">{{ copy.blog.readMore }} <i class="fa-solid fa-arrow-right"></i></span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.blog {
  padding-block: $space-section;
  border-top: 1px solid $line;

  &__inner {
    @include container;
  }

  &__list {
    @include flex-cards(280px, 2rem 1.5rem);
  }
}

.post {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__media {
    aspect-ratio: 16 / 10;
    border-radius: 14px;
    overflow: hidden;
    background: $sand;
    margin-bottom: 0.4rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s $ease;
    }
  }

  &:hover img {
    transform: scale(1.03);
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
    font-size: $text-sm;
    font-weight: 600;

    i {
      font-size: 0.75em;
      color: $brand-blue;
      margin-left: 0.25rem;
    }
  }
}
</style>
