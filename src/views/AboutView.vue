<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AdvisorCard from '@/components/common/AdvisorCard.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useSeo } from '@/composables/useSeo'
import { toParagraphs } from '@/utils/markdown'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { copyPages } from '@/config/copy.pages'

const c = copyPages.about
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
      <figure class="about__figure">
        <img v-if="about?.image" :src="about.image.url" :alt="about.image.alt || title" />
      </figure>
      <div class="about__copy">
        <p class="about__eyebrow">{{ c.eyebrow }}</p>
        <h1 class="about__title">{{ title }}</h1>
        <div v-if="loading" class="about__sk" aria-busy="true"><span></span><span></span><span></span></div>
        <p v-for="(p, i) in paragraphs" v-else :key="i" class="about__text">{{ p }}</p>
        <p class="about__welcome">{{ c.welcome }}</p>
        <ul class="about__values">
          <li v-for="v in c.values" :key="v.label">
            <i :class="v.icon" aria-hidden="true"></i>
            <span>{{ v.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section v-if="advisors.length" class="about__team">
      <header class="about__team-head">
        <div>
          <p class="about__eyebrow">{{ c.teamEyebrow }}</p>
          <h2 class="about__h2">{{ c.teamTitle }}</h2>
        </div>
        <p class="about__team-text">{{ c.teamText }}</p>
      </header>
      <div class="about__grid">
        <AdvisorCard v-for="advisor in advisors" :key="advisor._id" :advisor="advisor" />
      </div>
    </section>

    <section class="about__cta">
      <div class="about__cta-inner">
        <div>
          <p class="about__cta-eyebrow">{{ c.ctaEyebrow }}</p>
          <h2 class="about__cta-title">{{ c.ctaTitle }}</h2>
        </div>
        <RouterLink to="/contacto" class="btn btn--primary btn--lg">{{ c.ctaButton }}</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss" src="./AboutView.scss"></style>
