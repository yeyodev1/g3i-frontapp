<script setup lang="ts">
import { computed, ref } from 'vue'
import ProjectIntro from '@/components/project/ProjectIntro.vue'
import ProjectSectionNav from '@/components/project/ProjectSectionNav.vue'
import ProjectBlockHead from '@/components/project/ProjectBlockHead.vue'
import ProjectMosaic from '@/components/project/ProjectMosaic.vue'
import ProjectOverview from '@/components/project/ProjectOverview.vue'
import ProjectDescription from '@/components/project/ProjectDescription.vue'
import ProjectAmenities from '@/components/project/ProjectAmenities.vue'
import UnitsInventory from '@/components/project/UnitsInventory.vue'
import ProjectLocation from '@/components/project/ProjectLocation.vue'
import ProjectContact from '@/components/project/ProjectContact.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import SkeletonCards from '@/components/common/SkeletonCards.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import { useProjectDetail } from '@/composables/useProjectDetail'
import { toParagraphs } from '@/utils/markdown'
import { copy } from '@/config/copy.public'
import { copyProjects } from '@/config/copy.projects'

const { slug, detail, related, project, units, title, whatsappHref } = useProjectDetail()
const nav = ref<InstanceType<typeof ProjectSectionNav> | null>(null)

const paragraphs = computed(() => toParagraphs(project.value?.description ?? ''))
const hasLocation = computed(
  () => project.value?.location.lat != null && project.value?.location.lng != null,
)
const hasAmenities = computed(() =>
  Boolean(project.value?.amenities.length || project.value?.highlights.length),
)

// La navegación solo ofrece las secciones que realmente se pintan.
const sections = computed(() =>
  copyProjects.sections.filter((s) => {
    if (s.id === 'descripcion') return paragraphs.value.length > 0
    if (s.id === 'amenidades') return hasAmenities.value
    if (s.id === 'ubicacion') return hasLocation.value
    return true
  }),
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
      <StateMessage
        icon="fa-solid fa-triangle-exclamation"
        :title="copy.common.error"
        :text="detail.error.value"
        retry
        @retry="detail.load()"
      />
    </div>

    <template v-else-if="project">
      <ProjectIntro :project="project" :title="title" @request="nav?.scrollTo('contacto')" />
      <ProjectSectionNav
        ref="nav"
        :sections="sections"
        :name="project.locality"
        :whatsapp-href="whatsappHref"
        :share-title="title"
      />

      <section id="galeria" class="pdetail__section">
        <ProjectBlockHead
          :eyebrow="copyProjects.galleryEyebrow"
          :title="copyProjects.galleryTitle"
          class="pdetail__head"
        />
        <ProjectMosaic :images="project.images" :title="title" />
      </section>

      <section id="vision-general" class="pdetail__section">
        <ProjectOverview :project="project" />
      </section>

      <section v-if="paragraphs.length" id="descripcion" class="pdetail__section">
        <ProjectDescription :project="project" :title="title" :paragraphs="paragraphs" />
      </section>

      <section v-if="hasAmenities" id="amenidades" class="pdetail__band">
        <ProjectAmenities :project="project" />
      </section>

      <section id="unidades" class="pdetail__section">
        <div class="pdetail__units-head">
          <ProjectBlockHead :eyebrow="copyProjects.unitsEyebrow" :title="copyProjects.unitsTitle" />
          <p v-if="units.length" class="pdetail__note">
            {{ copyProjects.inventoryText }}<br />{{ copyProjects.unitsNote }}
          </p>
        </div>
        <UnitsInventory v-if="units.length" :units="units" :slug="slug" />
        <StateMessage v-else icon="fa-solid fa-key" :text="copy.project.unitsEmpty" />
      </section>

      <section v-if="hasLocation" id="ubicacion" class="pdetail__section">
        <ProjectLocation :project="project" />
      </section>

      <section id="contacto" class="pdetail__section">
        <ProjectContact :project="project" :title="title" :whatsapp-href="whatsappHref" />
      </section>

      <section v-if="related.data.value?.length" class="pdetail__section pdetail__related">
        <div class="pdetail__related-head">
          <p class="pdetail__eyebrow">{{ copyProjects.similarEyebrow }}</p>
          <RouterLink to="/proyectos" class="link-caps">
            {{ copy.common.seeAllProjects }}
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </div>
        <div class="pdetail__cards">
          <ProjectCard
            v-for="p in related.data.value.slice(0, 3)"
            :key="p._id"
            :project="p"
            overlay
          />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pdetail {
  padding-bottom: $space-section;

  &__state {
    @include container;
    padding-block: $space-xl;
  }

  &__section {
    @include container;
    padding-top: 4.5rem;
    // Descuenta parte del padding para que el salto desde la barra no deje un hueco enorme.
    scroll-margin-top: calc(var(--header-h, 73px) + 46px - 2.5rem);

    @include from('lg') {
      padding-top: 5rem;
      scroll-margin-top: calc(var(--header-h, 65px) + 46px - 3rem);
    }
  }

  // Galería: justo bajo la portada, con menos aire.
  &__section:first-of-type {
    padding-top: 3.5rem;

    @include from('lg') {
      padding-top: 3.5rem;
    }
  }

  &__band {
    margin-top: 4.5rem;
    scroll-margin-top: calc(var(--header-h, 73px) + 46px);

    @include from('lg') {
      margin-top: 5rem;
    }
  }

  &__head {
    margin-bottom: 2rem;

    @include from('lg') {
      margin-bottom: 2.25rem;
    }
  }

  &__units-head {
    @include flex(column, flex-start, space-between, 1rem 2rem);
    margin-bottom: 2rem;

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
    }

    @include from('lg') {
      margin-bottom: 3rem;
    }
  }

  &__note {
    font-size: 0.8125rem;
    font-weight: 300;
    line-height: 1.6;
    color: $ink-muted;

    @include from('md') {
      text-align: right;
    }
  }

  &__related-head {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    margin-bottom: 1.75rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__cards {
    @include flex-cards(280px, 1.25rem);

    > * {
      max-width: 560px;

      @include from('lg') {
        max-width: calc((100% - 2.5rem) / 3);
      }
    }
  }
}
</style>
