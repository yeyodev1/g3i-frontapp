<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHero from '@/components/common/PageHero.vue'
import PostCard from '@/components/common/PostCard.vue'
import SkeletonCards from '@/components/common/SkeletonCards.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import PaginationNav from '@/components/common/PaginationNav.vue'
import { postService } from '@/services/post.service'
import { useAsyncData } from '@/composables/useAsyncData'
import { useSeo } from '@/composables/useSeo'
import { copy } from '@/config/copy.public'
import { site } from '@/config/site'

const route = useRoute()
const router = useRouter()
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const { data, loading, error, load } = useAsyncData(() => postService.list(page.value, 12))
watch(page, load, { immediate: true })

useSeo({ title: copy.blog.title, description: copy.blog.text })

function go(n: number) {
  router.push({ query: n > 1 ? { page: String(n) } : {} })
}
</script>

<template>
  <div class="blog">
    <PageHero :eyebrow="copy.blog.title" :title="site.home.blogTitle" :text="copy.blog.text" />

    <section class="blog__body">
      <SkeletonCards v-if="loading && !data" :count="6" basis="300px" />
      <StateMessage v-else-if="error" icon="fa-solid fa-plug-circle-exclamation" :text="error" retry @retry="load" />
      <StateMessage v-else-if="data && !data.items.length" icon="fa-regular fa-newspaper" :text="copy.blog.empty" />
      <template v-else-if="data">
        <div class="blog__grid">
          <PostCard v-for="post in data.items" :key="post._id" :post="post" />
        </div>
        <PaginationNav :page="data.page" :pages="data.pages" @go="go" />
      </template>

      <RouterLink to="/preguntas-frecuentes" class="blog__faq">
        <i class="fa-regular fa-circle-question"></i>
        {{ copy.blog.faqCta }}
        <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped lang="scss">
.blog {
  &__body {
    @include container;
    padding-block: $space-xl;
  }

  &__grid {
    @include flex-cards(300px, 2.5rem 1.75rem);
  }

  &__faq {
    @include flex(row, center, center, 0.7rem);
    margin-top: $space-xl;
    padding: 1.2rem 1.4rem;
    border: 1px solid $line;
    border-radius: $radius-md;
    font-weight: 600;
    font-size: $text-sm;
    text-align: center;
    @include transition;

    i:first-child {
      color: $brand-blue;
    }

    i:last-child {
      font-size: 0.75em;
    }

    &:hover {
      border-color: $ink;
    }
  }
}
</style>
