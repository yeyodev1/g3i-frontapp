<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageIntro from '@/components/pages/PageIntro.vue'
import PostCard from '@/components/common/PostCard.vue'
import SkeletonCards from '@/components/common/SkeletonCards.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import PaginationNav from '@/components/common/PaginationNav.vue'
import { postService } from '@/services/post.service'
import { useAsyncData } from '@/composables/useAsyncData'
import { useSeo } from '@/composables/useSeo'
import { copy } from '@/config/copy.public'
import { copyPages } from '@/config/copy.pages'

const c = copyPages.blog
const route = useRoute()
const router = useRouter()
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const { data, loading, error, load } = useAsyncData(() => postService.list(page.value, 12))
watch(page, load, { immediate: true })

useSeo({ title: copy.blog.title, description: c.text })

function go(n: number) {
  router.push({ query: n > 1 ? { page: String(n) } : {} })
}
</script>

<template>
  <div class="blog">
    <div class="blog__top">
      <PageIntro :eyebrow="c.eyebrow" :title="c.title" :title-em="c.titleEm" :text="c.text" class="blog__intro" />

      <!-- Preguntas frecuentes a la vista: en el pie «nadie lo va a ver» (pedido de la clienta). -->
      <RouterLink to="/preguntas-frecuentes" class="blog__faq">
        <span class="blog__faq-icon"><i class="fa-regular fa-circle-question" aria-hidden="true"></i></span>
        <span class="blog__faq-eyebrow">{{ c.faqEyebrow }}</span>
        <span class="blog__faq-title">{{ c.faqTitle }}</span>
        <span class="blog__faq-text">{{ c.faqText }}</span>
        <span class="blog__faq-link">{{ c.faqLink }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
      </RouterLink>
    </div>

    <section class="blog__body" :aria-label="c.postsTitle">
      <SkeletonCards v-if="loading && !data" :count="6" basis="300px" />
      <StateMessage v-else-if="error" icon="fa-solid fa-plug-circle-exclamation" :text="error" retry @retry="load" />
      <StateMessage v-else-if="data && !data.items.length" icon="fa-regular fa-newspaper" :text="copy.blog.empty" />
      <template v-else-if="data">
        <div class="blog__grid">
          <PostCard v-for="post in data.items" :key="post._id" :post="post" />
        </div>
        <PaginationNav :page="data.page" :pages="data.pages" @go="go" />
      </template>
    </section>
  </div>
</template>

<style scoped lang="scss">
.blog {
  &__top {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: clamp(2.5rem, 7vw, 6rem) clamp(2.5rem, 5vw, 4rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 4rem;
    }
  }

  &__intro {
    min-width: 0;

    @include from('lg') {
      flex: 1 1 0;
    }
  }

  // Tarjeta navy destacada, del ancho de una columna.
  &__faq {
    @include flex(column, flex-start, flex-start, 0.6rem);
    padding: 2rem 1.75rem;
    background: $inverse;
    color: $on-inverse;
    @include transition(background);
    @include focus-ring;

    @include from('lg') {
      flex: 0 0 380px;
    }

    &:hover {
      background: $inverse-deep;
    }

    &:hover .blog__faq-link {
      color: $ember-300;
      border-color: $ember-300;
    }
  }

  &__faq-icon {
    font-size: 1.6rem;
    color: $ember-300;
    margin-bottom: 0.4rem;
  }

  &__faq-eyebrow {
    @include eyebrow;
    color: $ember-300;
  }

  &__faq-title {
    font: 300 2.1rem/1.05 $font-display;
  }

  &__faq-text {
    font-size: 0.92rem;
    font-weight: 300;
    line-height: 1.65;
    color: $on-inverse-muted;
  }

  &__faq-link {
    margin-top: 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    @include caps(0.7rem, 0.22em);
    padding-bottom: 0.3rem;
    border-bottom: 1px solid currentColor;
    @include transition;
  }

  &__body {
    @include container;
    padding-bottom: $space-section;
  }

  &__grid {
    @include flex-cards(300px, 3.5rem 2rem);
  }
}
</style>
