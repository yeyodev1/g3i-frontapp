<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownContent from '@/components/common/MarkdownContent.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import ShareButton from '@/components/common/ShareButton.vue'
import { postService } from '@/services/post.service'
import { useAsyncData } from '@/composables/useAsyncData'
import { useSeo } from '@/composables/useSeo'
import { copy } from '@/config/copy.public'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data: post, loading, error, notFound, load } = useAsyncData(() => postService.getBySlug(slug.value))
watch(slug, (value) => value && load(), { immediate: true })

useSeo(() => ({
  title: post.value?.title || copy.blog.title,
  description: post.value?.excerpt,
  image: post.value?.cover?.url,
}))
</script>

<template>
  <article class="post">
    <div v-if="loading && !post" class="post__skeleton" aria-busy="true">
      <div class="post__sk-title"></div>
      <div class="post__sk-cover"></div>
    </div>

    <div v-else-if="notFound" class="post__state">
      <StateMessage icon="fa-regular fa-newspaper" :title="copy.blog.notFoundTitle" link-to="/blog" :link-label="copy.blog.back" />
    </div>
    <div v-else-if="error" class="post__state">
      <StateMessage icon="fa-solid fa-plug-circle-exclamation" :text="error" retry @retry="load" />
    </div>

    <template v-else-if="post">
      <header class="post__head">
        <RouterLink to="/blog" class="post__back"><i class="fa-solid fa-arrow-left"></i> {{ copy.blog.back }}</RouterLink>
        <h1 class="post__title">{{ post.title }}</h1>
        <p v-if="post.excerpt" class="post__excerpt">{{ post.excerpt }}</p>
      </header>

      <figure v-if="post.cover" class="post__cover">
        <img :src="post.cover.url" :alt="post.cover.alt || post.title" />
      </figure>

      <div class="post__content">
        <MarkdownContent :source="post.content" />
        <footer class="post__foot">
          <ShareButton :title="post.title" />
          <RouterLink to="/preguntas-frecuentes" class="post__faq">
            {{ copy.blog.faqCta }} <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
        </footer>
      </div>
    </template>
  </article>
</template>

<style scoped lang="scss">
.post {
  padding-block: clamp(2rem, 5vw, 4rem) $space-xl;

  &__head,
  &__content,
  &__state,
  &__skeleton {
    @include container(760px);
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: $text-sm;
    color: $ink-muted;
    margin-bottom: 1.5rem;

    &:hover {
      color: $ink;
    }
  }

  &__title {
    @include display($display-md, 600);
  }

  &__excerpt {
    margin-top: 1rem;
    font-size: $text-lg;
    color: $ink-soft;
  }

  &__cover {
    @include container(1040px);
    margin-block: 2rem 2.5rem;

    img {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      border-radius: $radius-md;
    }
  }

  &__content {
    margin-top: 2rem;
  }

  &__cover + &__content {
    margin-top: 0;
  }

  &__foot {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid $line;
  }

  &__faq {
    font-size: $text-sm;
    font-weight: 600;

    i {
      font-size: 0.75em;
      color: $brand-blue;
    }
  }

  &__sk-title,
  &__sk-cover {
    background: $sand;
    border-radius: $radius-sm;
  }

  &__sk-title {
    height: 3rem;
    width: 80%;
  }

  &__sk-cover {
    margin-top: 2rem;
    aspect-ratio: 16 / 9;
  }
}
</style>
