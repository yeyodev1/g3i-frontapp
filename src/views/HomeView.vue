<script setup lang="ts">
import HomeHero from '@/components/home/HomeHero.vue'
import HomeStats from '@/components/home/HomeStats.vue'
import HomeAbout from '@/components/home/HomeAbout.vue'
import HomeServices from '@/components/home/HomeServices.vue'
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
  heroImage,
  properties,
  projects,
  posts,
  loadingProperties,
  loadingProjects,
  propertiesError,
  loadProperties,
  stats,
} = useHomeData()

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

    <!-- Cifras bajo el buscador: el panel las define; si no, conteos reales por tipo. -->
    <HomeStats :stats="stats" />

    <section v-if="loadingProjects || projects.length" class="block block--sand" data-reveal>
      <div class="block__inner">
        <SectionHeading
          :eyebrow="copyHome.projects.eyebrow"
          :title="copyHome.projects.title"
          :link-label="copyHome.projects.link"
          link-to="/proyectos"
        />
        <!-- Etapas: a la clienta le gusta que se vean de entrada. -->
        <ul class="stages" :aria-label="copyHome.projects.stagesLabel">
          <li v-for="stage in catalog.projectStages" :key="stage.key">
            <RouterLink
              :to="{ path: '/proyectos', query: { stage: stage.key } }"
              class="stages__chip"
            >
              {{ stage.label }}
            </RouterLink>
          </li>
        </ul>
        <SkeletonCards v-if="loadingProjects" :count="3" basis="300px" />
        <div v-else class="cards">
          <ProjectCard v-for="p in projects" :key="p._id" :project="p" />
        </div>
      </div>
    </section>

    <!-- Pedido de la clienta (24/9): primero proyectos y después «Las más buscadas». -->
    <section class="block" data-reveal>
      <div class="block__inner">
        <SectionHeading
          :eyebrow="copyHome.featured.eyebrow"
          :title="copyHome.featured.title"
          :link-label="copyHome.featured.link"
          link-to="/propiedades"
        />
        <SkeletonCards v-if="loadingProperties" :count="3" basis="300px" />
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
        <StateMessage
          v-else
          :text="site.listing.empty"
          link-to="/contacto"
          :link-label="copy.nav.contact"
        />
      </div>
    </section>

    <HomeAbout
      :title="settings?.about.title"
      :text="settings?.about.text"
      :image="settings?.about.image"
    />

    <HomeServices />

    <TestimonialsCarousel :testimonials="catalog.site?.testimonials ?? []" />

    <PartnersStrip :partners="catalog.site?.partners ?? []" />

    <BlogTeaser :posts="posts" />

    <HomeSellCta />
  </div>
</template>

<style scoped lang="scss">
.block {
  padding-block: $space-section;

  &--sand {
    background: $gray-50;
    border-block: 1px solid $gray-200;
  }

  &__inner {
    @include container;
  }
}

.cards {
  @include flex-cards(300px, 1.5rem);

  // Con pocas tarjetas no se estiran a todo el ancho.
  > * {
    max-width: calc((100% - 3rem) / 3);
  }

  @include until('lg') {
    > * {
      max-width: none;
    }
  }
}

// Etapas de proyecto como filtros rápidos.
.stages {
  list-style: none;
  @include flex(row, center, flex-start, 0.6rem);
  flex-wrap: wrap;
  margin: -1.25rem 0 2.25rem;

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    @include caps(0.6875rem, 0.2em);
    padding: 0.7rem 1rem;
    border: 1px solid $gray-300;
    border-radius: $radius-sm;
    background: $paper;
    color: $navy-900;
    @include transition;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      background: $ember-500;
    }

    &:hover {
      border-color: $navy-900;
    }
  }
}

// Revelado suave al hacer scroll, solo con CSS: sin JS el contenido se ve igual,
// y con movimiento reducido o navegadores sin soporte no se anima.
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .home :deep([data-reveal]) {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }
  }
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
