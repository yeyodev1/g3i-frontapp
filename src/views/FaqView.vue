<script setup lang="ts">
import { onMounted } from 'vue'
import PageHero from '@/components/common/PageHero.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import MarkdownContent from '@/components/common/MarkdownContent.vue'
import { siteService } from '@/services/site.service'
import { useAsyncData } from '@/composables/useAsyncData'
import { useSeo } from '@/composables/useSeo'
import { site, whatsappLink } from '@/config/site'
import { copy } from '@/config/copy.public'

const { data: faqs, loading, error, load } = useAsyncData(() => siteService.getFaqs())
onMounted(load)

useSeo({ title: site.faq.title, description: site.faq.text })
</script>

<template>
  <div class="faq">
    <PageHero :title="site.faq.title" :text="site.faq.text" />

    <section class="faq__body">
      <div v-if="loading && !faqs" class="faq__skeleton" aria-busy="true">
        <div v-for="n in 5" :key="n"></div>
      </div>
      <StateMessage v-else-if="error" icon="fa-solid fa-plug-circle-exclamation" :text="error" retry @retry="load" />
      <StateMessage v-else-if="faqs && !faqs.length" icon="fa-regular fa-circle-question" :text="copy.faq.empty" />

      <div v-else-if="faqs" class="faq__list">
        <details v-for="item in faqs" :key="item._id" class="faq__item">
          <summary class="faq__question">
            <span>{{ item.question }}</span>
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </summary>
          <MarkdownContent class="faq__answer" :source="item.answer" />
        </details>
      </div>

      <aside class="faq__more">
        <p>{{ copy.faq.moreQuestions }}</p>
        <div class="faq__actions">
          <a :href="whatsappLink()" target="_blank" rel="noopener" class="btn btn--primary">
            <i class="fa-brands fa-whatsapp"></i> {{ copy.faq.contactCta }}
          </a>
          <RouterLink to="/contacto" class="btn btn--ghost">{{ copy.nav.contact }}</RouterLink>
        </div>
      </aside>
    </section>
  </div>
</template>

<style scoped lang="scss">
.faq {
  &__body {
    @include container(860px);
    padding-block: $space-xl;
  }

  &__list {
    border-top: 1px solid $line;
  }

  &__item {
    border-bottom: 1px solid $line;

    &[open] .faq__question i {
      transform: rotate(45deg);
      color: $brand-orange;
    }
  }

  &__question {
    @include flex(row, center, space-between, 1rem);
    list-style: none;
    cursor: pointer;
    padding-block: 1.25rem;
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 600;
    color: $ink;
    @include focus-ring;

    &::-webkit-details-marker {
      display: none;
    }

    i {
      flex-shrink: 0;
      font-size: 0.85rem;
      color: $brand-blue;
      transition: transform 0.3s $ease;
    }
  }

  &__answer {
    padding-bottom: 1.4rem;
    max-width: 64ch;
  }

  &__skeleton div {
    height: 3.6rem;
    border-radius: $radius-sm;
    background: $sand;
    margin-bottom: 0.6rem;
  }

  &__more {
    @include flex(column, center, center, 1rem);
    text-align: center;
    margin-top: $space-xl;
    padding: 2rem 1.25rem;
    background: $sand;
    border-radius: $radius-md;

    p {
      @include display($text-xl, 600);
    }
  }

  &__actions {
    @include flex(row, center, center, 0.7rem);
    flex-wrap: wrap;
  }
}
</style>
