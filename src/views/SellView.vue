<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SellForm from '@/components/forms/SellForm.vue'
import { useSeo } from '@/composables/useSeo'
import { useCatalogStore } from '@/stores/catalog'
import { site, whatsappLink } from '@/config/site'
import { copy } from '@/config/copy.public'

const catalog = useCatalogStore()

// El texto lo puede ajustar la inmobiliaria desde el portal (settings.sellCta).
const title = computed(() => catalog.site?.settings.sellCta.title || site.sell.title)
const text = computed(() => catalog.site?.settings.sellCta.text || site.sell.text)

useSeo(() => ({ title: site.sell.eyebrow, description: text.value }))
onMounted(() => catalog.ensureSite())
</script>

<template>
  <div class="sell">
    <div class="sell__inner">
      <section class="sell__intro">
        <p class="sell__eyebrow">{{ site.sell.eyebrow }}</p>
        <h1 class="sell__title">{{ title }}</h1>
        <p class="sell__text">{{ text }}</p>
        <ol class="sell__steps">
          <li v-for="step in copy.sell.steps" :key="step.label">
            <i :class="step.icon" aria-hidden="true"></i>
            <span>{{ step.label }}</span>
          </li>
        </ol>
        <a :href="whatsappLink(copy.sell.whatsappMessage)" target="_blank" rel="noopener" class="sell__wa">
          <i class="fa-brands fa-whatsapp"></i> {{ copy.contact.whatsapp }}: {{ catalog.contact.phone }}
        </a>
      </section>

      <section class="sell__card">
        <SellForm />
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sell {
  background: $sand;

  @include from('lg') {
    background: linear-gradient(90deg, $sand 0%, $sand 50%, $paper 50%);
  }

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2rem);
    padding-block: clamp(2.5rem, 6vw, 5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 4rem;
    }
  }

  &__intro {
    flex: 1 1 0;
    min-width: 0;

    @include from('lg') {
      position: sticky;
      top: 100px;
    }
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.6rem);
    margin-bottom: 0.9rem;

    &::before {
      content: '';
      width: 1.4rem;
      height: 1px;
      background: $brand-orange;
    }
  }

  &__title {
    @include display($display-md, 600);
    max-width: 16ch;
  }

  &__text {
    margin-top: 1rem;
    color: $ink-soft;
    font-size: $text-lg;
    max-width: 44ch;
  }

  &__steps {
    list-style: none;
    counter-reset: step;
    @include flex(column, stretch, flex-start, 0.9rem);
    margin-top: 2rem;

    li {
      @include flex(row, center, flex-start, 0.8rem);
      font-size: $text-sm;
      color: $ink;
    }

    i {
      @include flex(row, center, center);
      flex-shrink: 0;
      width: 2.3rem;
      height: 2.3rem;
      border-radius: 50%;
      background: $surface;
      border: 1px solid $line;
      color: $brand-blue;
      font-size: 0.85rem;
    }
  }

  &__wa {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    border-bottom: 1px solid $line;
    padding-bottom: 0.2rem;

    i {
      color: #25d366;
      font-size: 1.1rem;
    }
  }

  &__card {
    flex: 1 1 0;
    min-width: 0;
    @include card;
    box-shadow: $shadow-md;
    padding: 1.5rem 1.25rem;

    @include from('md') {
      padding: 2.25rem;
    }
  }
}
</style>
