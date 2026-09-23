<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import AdvisorCard from '@/components/common/AdvisorCard.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useSeo } from '@/composables/useSeo'
import { toParagraphs } from '@/utils/markdown'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'

const catalog = useCatalogStore()

const about = computed(() => catalog.site?.settings.about)
// Si el título guardado repite el eyebrow ("Conócenos"), se usa el del sitio.
const title = computed(() => {
  const t = about.value?.title
  return t && t !== site.about.eyebrow ? t : site.about.title
})
const paragraphs = computed(() => toParagraphs(about.value?.text || copy.about.fallbackText))
const advisors = computed(() => (catalog.site?.advisors ?? []).filter((a) => a.isActive !== false))
const loading = computed(() => !catalog.site && !catalog.siteError)

useSeo(() => ({ title: site.about.eyebrow, description: copy.about.description, image: about.value?.image?.url }))
onMounted(() => catalog.ensureSite())
</script>

<template>
  <div class="about">
    <section class="about__intro">
      <div class="about__copy">
        <p class="about__eyebrow">{{ site.about.eyebrow }}</p>
        <h1 class="about__title">{{ title }}</h1>
        <div v-if="loading" class="about__sk" aria-busy="true"><span></span><span></span><span></span></div>
        <p v-for="(p, i) in paragraphs" v-else :key="i" class="about__text">{{ p }}</p>
      </div>
      <figure v-if="about?.image" class="about__figure">
        <img :src="about.image.url" :alt="about.image.alt || title" />
      </figure>
    </section>

    <section v-if="advisors.length" class="about__team">
      <SectionHeading :eyebrow="site.about.eyebrow" :title="site.about.teamTitle" />
      <div class="about__grid">
        <AdvisorCard v-for="advisor in advisors" :key="advisor._id" :advisor="advisor" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.about {
  &__intro {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: clamp(2.5rem, 6vw, 5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
    }
  }

  &__copy {
    flex: 1 1 0;
    min-width: 0;
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
    margin-bottom: 1.4rem;
    max-width: 18ch;
  }

  &__text {
    color: $ink-soft;
    font-size: $text-lg;
    max-width: 58ch;

    & + & {
      margin-top: 1rem;
    }
  }

  &__sk span {
    display: block;
    height: 1rem;
    border-radius: 6px;
    background: $sand;
    margin-bottom: 0.7rem;

    &:last-child {
      width: 60%;
    }
  }

  &__figure {
    flex: 1 1 0;
    min-width: 0;

    img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: $radius-md;
    }
  }

  &__team {
    @include container;
    padding-block: $space-lg $space-section;
    border-top: 1px solid $line;
    padding-top: $space-xl;
  }

  &__grid {
    @include flex-cards(240px, 2.5rem 1.75rem);

    > * {
      max-width: 340px;
    }
  }
}
</style>
