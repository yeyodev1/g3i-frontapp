<script setup lang="ts">
import { onMounted } from 'vue'
import PageIntro from '@/components/pages/PageIntro.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import MarkdownContent from '@/components/common/MarkdownContent.vue'
import { siteService } from '@/services/site.service'
import { useAsyncData } from '@/composables/useAsyncData'
import { useSeo } from '@/composables/useSeo'
import { site, whatsappLink } from '@/config/site'
import { copy } from '@/config/copy.public'
import { copyPages } from '@/config/copy.pages'

const c = copyPages.faq
const { data: faqs, loading, error, load } = useAsyncData(() => siteService.getFaqs())
onMounted(load)

useSeo({ title: site.faq.title, description: site.faq.text })
</script>

<template>
  <div class="faq">
    <div class="faq__inner">
      <PageIntro :eyebrow="c.eyebrow" :title="c.title" :title-em="c.titleEm" :text="site.faq.text" />

      <section class="faq__body">
        <div v-if="loading && !faqs" class="faq__skeleton" aria-busy="true">
          <div v-for="n in 5" :key="n"></div>
        </div>
        <StateMessage v-else-if="error" icon="fa-solid fa-plug-circle-exclamation" :text="error" retry @retry="load" />
        <StateMessage v-else-if="faqs && !faqs.length" icon="fa-regular fa-circle-question" :text="copy.faq.empty" />

        <!-- details/summary: acordeón accesible por teclado y lector de pantalla sin JS. -->
        <div v-else-if="faqs" class="faq__list">
          <details v-for="item in faqs" :key="item._id" class="faq__item">
            <summary class="faq__question">
              <span>{{ item.question }}</span>
              <i class="fa-solid fa-plus" aria-hidden="true"></i>
            </summary>
            <MarkdownContent class="faq__answer" :source="item.answer" />
          </details>
        </div>
      </section>
    </div>

    <aside class="faq__more">
      <div class="faq__more-inner">
        <div>
          <p class="faq__more-eyebrow">{{ c.moreEyebrow }}</p>
          <p class="faq__more-title">{{ c.moreTitle }}</p>
        </div>
        <div class="faq__actions">
          <a :href="whatsappLink()" target="_blank" rel="noopener" class="btn btn--primary btn--lg">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ c.whatsapp }}
          </a>
          <RouterLink to="/contacto?interes=consulta" class="btn btn--light btn--lg">{{ c.contact }}</RouterLink>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped lang="scss">
.faq {
  &__inner {
    @include container(880px);
    padding-block: clamp(2.5rem, 7vw, 6rem) $space-section;
  }

  &__body {
    margin-top: clamp(2.5rem, 5vw, 3.5rem);
  }

  &__list {
    border-top: 1px solid $line;
  }

  &__item {
    border-bottom: 1px solid $line;

    &[open] .faq__question i {
      transform: rotate(45deg);
      color: $ember-500;
    }
  }

  &__question {
    @include flex(row, center, space-between, 1.5rem);
    list-style: none;
    cursor: pointer;
    padding-block: 1.5rem;
    font: 400 clamp(1.3rem, 1.15rem + 0.6vw, 1.6rem) / 1.25 $font-display;
    color: $ink;
    @include transition(color);
    @include focus-ring;

    &::-webkit-details-marker {
      display: none;
    }

    &:hover {
      color: $navy-900;
    }

    i {
      flex-shrink: 0;
      font-size: 0.9rem;
      color: $navy-900;
      transition: transform 0.3s $ease;
    }
  }

  &__answer {
    padding: 0 2.5rem 1.8rem 0;
    max-width: 68ch;
  }

  &__skeleton div {
    height: 4.5rem;
    background: $sand;
    margin-bottom: 1px;
  }

  &__more {
    background: $inverse;
    color: $on-inverse;
    padding-block: clamp(3rem, 7vw, 5rem);
  }

  &__more-inner {
    @include container;
    @include flex(column, flex-start, space-between, 1.8rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
    }
  }

  &__more-eyebrow {
    @include eyebrow;
    color: $ember-300;
  }

  &__more-title {
    color: $on-inverse;
    @include display(clamp(2rem, 1.4rem + 2vw, 2.75rem));
    margin-top: 0.8rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }
}
</style>
