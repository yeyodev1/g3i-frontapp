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
import { copyPages } from '@/config/copy.pages'

const c = copyPages.post
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
        <RouterLink to="/blog" class="post__back"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ copy.blog.back }}</RouterLink>
        <p class="post__eyebrow">{{ c.eyebrow }}</p>
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
          <RouterLink to="/preguntas-frecuentes" class="link-caps">
            {{ copyPages.blog.faqLink }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </footer>
      </div>

      <aside class="post__cta">
        <div class="post__cta-inner">
          <div>
            <p class="post__cta-eyebrow">{{ c.ctaEyebrow }}</p>
            <p class="post__cta-title">{{ c.ctaTitle }}</p>
          </div>
          <RouterLink to="/propiedades" class="btn btn--primary btn--lg">{{ c.ctaButton }}</RouterLink>
        </div>
      </aside>
    </template>
  </article>
</template>

<style scoped lang="scss" src="./PostView.scss"></style>
