<script setup lang="ts">
import { computed } from 'vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeStats from '@/components/home/HomeStats.vue'
import HomeMapTeaser from '@/components/home/HomeMapTeaser.vue'
import PartnersStrip from '@/components/home/PartnersStrip.vue'
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel.vue'
import BlogTeaser from '@/components/home/BlogTeaser.vue'
import HomeSellCta from '@/components/home/HomeSellCta.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import SkeletonCards from '@/components/common/SkeletonCards.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import PropertyCard from '@/components/property/PropertyCard.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import { useHomeData } from '@/composables/useHomeData'
import { useSeo } from '@/composables/useSeo'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { copyHome } from '@/config/copy.home'

const {
  catalog,
  settings,
  properties,
  projects,
  posts,
  loadingProperties,
  loadingProjects,
  propertiesError,
  loadProperties,
} = useHomeData()

const heroImage = computed(() => settings.value?.hero.image?.url || properties.value[0]?.cover || '')

useSeo(() => ({
  title: site.name,
  description: site.description,
  image: heroImage.value,
}))
</script>

<template>
  <div class="home">
    <HomeHero
      :title="settings?.hero.title"
      :subtitle="settings?.hero.subtitle"
      :image="heroImage"
      :popular="settings?.popularSearches ?? []"
    />

    <HomeStats />

    <section class="block">
      <div class="block__inner">
        <SectionHeading
          :eyebrow="site.home.featuredEyebrow"
          :title="site.home.featuredTitle"
          :link-label="copy.home.seeProperties"
          link-to="/propiedades"
        />
        <SkeletonCards v-if="loadingProperties" :count="3" />
        <StateMessage
          v-else-if="propertiesError"
          icon="fa-solid fa-triangle-exclamation"
          :text="copyHome.propertiesError"
          retry
          @retry="loadProperties"
        />
        <div v-else-if="properties.length" class="cards">
          <PropertyCard v-for="p in properties" :key="p._id" :property="p" />
        </div>
        <StateMessage v-else :text="site.listing.empty" link-to="/contacto" :link-label="copy.nav.contact" />
      </div>
    </section>

    <section v-if="loadingProjects || projects.length" class="block block--line">
      <div class="block__inner">
        <SectionHeading
          :eyebrow="site.home.projectsEyebrow"
          :title="site.home.projectsTitle"
          :link-label="copy.home.seeProjects"
          link-to="/proyectos"
        />
        <SkeletonCards v-if="loadingProjects" :count="3" basis="300px" />
        <div v-else class="cards cards--projects">
          <ProjectCard v-for="p in projects" :key="p._id" :project="p" />
        </div>
      </div>
    </section>

    <HomeMapTeaser />

    <TestimonialsCarousel :testimonials="catalog.site?.testimonials ?? []" />

    <PartnersStrip :partners="catalog.site?.partners ?? []" />

    <BlogTeaser :posts="posts" />

    <HomeSellCta />
  </div>
</template>

<style scoped lang="scss">
.block {
  padding-block: $space-section;

  &--line {
    border-top: 1px solid $line;
  }

  &__inner {
    @include container;
  }
}

.cards {
  @include flex-cards(280px, 1.5rem);

  // Con pocas tarjetas no se estiran a todo el ancho.
  > * {
    max-width: 420px;
  }

  @include until('sm') {
    > * {
      max-width: none;
    }
  }

  &--projects > * {
    flex-basis: 300px;
  }
}
</style>
