<script setup lang="ts">
import { computed } from 'vue'
import ProjectIntro from '@/components/project/ProjectIntro.vue'
import ProjectSectionNav from '@/components/project/ProjectSectionNav.vue'
import ProjectMosaic from '@/components/project/ProjectMosaic.vue'
import ProjectOverview from '@/components/project/ProjectOverview.vue'
import UnitsInventory from '@/components/project/UnitsInventory.vue'
import ProjectContactAside from '@/components/project/ProjectContactAside.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import AmenityList from '@/components/common/AmenityList.vue'
import LocationMap from '@/components/common/LocationMap.vue'
import VideoEmbed from '@/components/common/VideoEmbed.vue'
import SkeletonCards from '@/components/common/SkeletonCards.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useProjectDetail } from '@/composables/useProjectDetail'
import { useCatalogStore } from '@/stores/catalog'
import { toParagraphs } from '@/utils/markdown'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { copyProjects } from '@/config/copy.projects'

const { slug, detail, related, project, units, title, whatsappHref } = useProjectDetail()
const catalog = useCatalogStore()

const paragraphs = computed(() => toParagraphs(project.value?.description ?? ''))
const hasLocation = computed(() => project.value?.location.lat != null && project.value?.location.lng != null)
const hasAmenities = computed(() => Boolean(project.value?.amenities.length || project.value?.highlights.length))

// La navegación solo ofrece las secciones que realmente se pintan.
const sections = computed(() =>
  copy.project.sections.filter((s) => {
    if (s.id === 'descripcion') return paragraphs.value.length > 0
    if (s.id === 'amenidades') return hasAmenities.value
    if (s.id === 'ubicacion') return hasLocation.value
    return true
  }),
)
const placeLabel = computed(() =>
  project.value ? `${catalog.sectorLabel(project.value.sector)} · ${project.value.city || copy.common.city}` : '',
)
</script>

<template>
  <div class="pdetail">
    <div v-if="detail.loading.value && !project" class="pdetail__state">
      <SkeletonCards :count="3" basis="300px" />
    </div>

    <div v-else-if="detail.notFound.value" class="pdetail__state">
      <StateMessage
        icon="fa-regular fa-building"
        :title="copy.project.notFoundTitle"
        :text="copy.project.notFoundText"
        link-to="/proyectos"
        :link-label="copy.project.seeProjects"
      />
    </div>

    <div v-else-if="detail.error.value" class="pdetail__state">
      <StateMessage icon="fa-solid fa-triangle-exclamation" :title="copy.common.error" :text="detail.error.value" retry @retry="detail.load()" />
    </div>

    <template v-else-if="project">
      <ProjectIntro :project="project" :title="title" />
      <ProjectSectionNav :sections="sections" />

      <div class="pdetail__layout">
        <div class="pdetail__main">
          <section id="galeria" class="pdetail__section">
            <ProjectMosaic :images="project.images" :title="title" />
          </section>

          <section id="vision-general" class="pdetail__section">
            <h2 class="pdetail__h2">{{ copy.project.overviewTitle }}</h2>
            <ProjectOverview :project="project" />
          </section>

          <section v-if="paragraphs.length" id="descripcion" class="pdetail__section">
            <h2 class="pdetail__h2">{{ site.detail.descriptionTitle }}</h2>
            <div class="pdetail__text">
              <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
            </div>
            <a v-if="project.brochure?.url" :href="project.brochure.url" target="_blank" rel="noopener" class="btn btn--ghost pdetail__brochure">
              <i class="fa-solid fa-download"></i> {{ site.detail.brochureCta }}
            </a>
            <div v-if="project.videos.length" class="pdetail__videos">
              <VideoEmbed v-for="v in project.videos" :key="v.url" :url="v.url" :title="title" />
            </div>
          </section>

          <section v-if="hasAmenities" id="amenidades" class="pdetail__section">
            <h2 class="pdetail__h2">{{ site.detail.amenitiesTitle }}</h2>
            <AmenityList :keys="project.amenities" />
            <div v-if="project.highlights.length" class="pdetail__highlights">
              <h3>{{ copy.project.highlightsTitle }}</h3>
              <ul>
                <li v-for="h in project.highlights" :key="h"><i class="fa-solid fa-check"></i> {{ h }}</li>
              </ul>
            </div>
          </section>

          <section id="unidades" class="pdetail__section">
            <h2 class="pdetail__h2">{{ site.detail.unitsTitle }}</h2>
            <p class="pdetail__sub">
              {{ units.length ? copyProjects.inventoryText : '' }}
            </p>
            <UnitsInventory v-if="units.length" :units="units" :slug="slug" />
            <StateMessage v-else icon="fa-solid fa-key" :text="copy.project.unitsEmpty" />
          </section>

          <section v-if="hasLocation" id="ubicacion" class="pdetail__section">
            <h2 class="pdetail__h2">{{ site.detail.locationTitle }}</h2>
            <LocationMap :location="project.location" :label="placeLabel" />
          </section>
        </div>

        <ProjectContactAside :project="project" :title="title" :whatsapp-href="whatsappHref" class="pdetail__aside" />
      </div>

      <section v-if="related.data.value?.length" class="pdetail__related">
        <SectionHeading :title="copyProjects.similarTitle" :link-label="copy.common.seeAllProjects" link-to="/proyectos" />
        <div class="pdetail__cards">
          <ProjectCard v-for="p in related.data.value" :key="p._id" :project="p" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pdetail {
  padding-bottom: $space-xl;

  &__state {
    @include container;
    padding-block: $space-xl;
  }

  &__layout {
    @include container;
    @include flex(column, stretch, flex-start, $space-lg);
    padding-top: $space-md;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__aside {
    @include from('lg') {
      flex: 0 0 360px;
    }
  }

  &__section {
    padding-block: 1.5rem 2rem;
    scroll-margin-top: 130px;

    & + & {
      border-top: 1px solid $line;
    }
  }

  &__h2 {
    @include display($text-xl, 600);
    margin-bottom: 1.1rem;
  }

  &__sub {
    margin: -0.6rem 0 1rem;
    font-size: $text-sm;
    color: $ink-muted;

    &:empty {
      display: none;
    }
  }

  &__text {
    color: $ink-soft;
    max-width: 68ch;

    p + p {
      margin-top: 1em;
    }
  }

  &__brochure {
    margin-top: 1.4rem;

    i {
      color: $brand-orange;
    }
  }

  &__videos {
    @include flex(column, stretch, flex-start, 1rem);
    margin-top: 1.5rem;
  }

  &__highlights {
    margin-top: 1.5rem;

    h3 {
      font-size: $text-base;
      margin-bottom: 0.7rem;
    }

    ul {
      list-style: none;
      @include flex(row, center, flex-start, 0.5rem);
      flex-wrap: wrap;
    }

    li {
      font-size: $text-sm;
      padding: 0.4rem 0.85rem;
      border: 1px solid $line;
      border-radius: $radius-pill;

      i {
        color: $brand-blue;
        font-size: 0.8em;
        margin-right: 0.25rem;
      }
    }
  }

  &__related {
    @include container;
    padding-top: $space-xl;
  }

  &__cards {
    @include flex-cards(280px, 1.5rem);

    > * {
      max-width: 420px;
    }
  }
}
</style>
