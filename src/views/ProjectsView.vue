<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHero from '@/components/common/PageHero.vue'
import ProjectFilters from '@/components/project/ProjectFilters.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import SkeletonCards from '@/components/common/SkeletonCards.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import PaginationNav from '@/components/common/PaginationNav.vue'
import ProjectsTypeFallback from '@/components/project/ProjectsTypeFallback.vue'
import { useListingFilters } from '@/composables/useListingFilters'
import { useAsyncData } from '@/composables/useAsyncData'
import { useSeo } from '@/composables/useSeo'
import { projectService } from '@/services/project.service'
import { useCatalogStore } from '@/stores/catalog'
import { site } from '@/config/site'
import { copy } from '@/config/copy.public'
import { copyProjects } from '@/config/copy.projects'

const route = useRoute()
const catalog = useCatalogStore()
const { filters, page, activeCount, update, setPage, clear } = useListingFilters(['stage', 'type', 'sector'] as const)


const list = useAsyncData(() => projectService.list({ ...filters.value, page: page.value, limit: 12 }))

// Sin proyectos de un tipo (p. ej. terrenos) se ofrecen sus propiedades individuales.
// fallbackTotal: null mientras se consulta, así el estado vacío no parpadea.
const fallbackTotal = ref<number | null>(null)
const showFallback = computed(
  () => Boolean(filters.value.type) && !list.loading.value && list.data.value?.total === 0,
)
const showEmpty = computed(
  () =>
    !list.loading.value &&
    !list.error.value &&
    list.data.value?.total === 0 &&
    (!showFallback.value || fallbackTotal.value === 0),
)
watch(showFallback, () => (fallbackTotal.value = null))

catalog.ensureBasics()
watch(() => route.query, () => list.load(), { immediate: true, deep: true })

function goPage(n: number) {
  setPage(n)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

useSeo({ title: site.listing.projectsTitle, description: copyProjects.seoDescription })
</script>

<template>
  <div class="projects">
    <PageHero :eyebrow="site.home.projectsEyebrow" :title="site.listing.projectsTitle" :text="site.listing.projectsText" />

    <div class="projects__body">
      <ProjectFilters :filters="filters" :active-count="activeCount" @update="update" @clear="clear" />

      <p v-if="list.data.value && !list.loading.value && !(showFallback && fallbackTotal)" class="projects__count" aria-live="polite">
        {{ copy.filters.results(list.data.value.total) }}
      </p>

      <SkeletonCards v-if="list.loading.value" :count="6" basis="300px" class="projects__list" />

      <StateMessage
        v-else-if="list.error.value"
        icon="fa-solid fa-triangle-exclamation"
        :title="copy.common.error"
        :text="list.error.value"
        retry
        @retry="list.load()"
      />

      <template v-else-if="list.data.value?.items.length">
        <div class="projects__list">
          <ProjectCard v-for="p in list.data.value.items" :key="p._id" :project="p" />
        </div>
        <PaginationNav :page="list.data.value.page" :pages="list.data.value.pages" @go="goPage" />
      </template>

      <ProjectsTypeFallback
        v-if="showFallback"
        :type="filters.type"
        :sector="filters.sector || undefined"
        @resolved="fallbackTotal = $event"
      />

      <StateMessage v-if="showEmpty" icon="fa-regular fa-building" :text="site.listing.empty">
        <button v-if="activeCount" type="button" class="btn btn--ghost" @click="clear">{{ site.listing.clearFilters }}</button>
      </StateMessage>
    </div>
  </div>
</template>

<style scoped lang="scss">
.projects {
  &__body {
    @include container;
    padding-block: $space-lg $space-xl;
  }

  &__count {
    margin: 1.5rem 0 1rem;
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__list {
    @include flex-cards(300px, 1.5rem);
    margin-top: 1.5rem;

    > * {
      max-width: 560px;
    }
  }

  &__count + &__list {
    margin-top: 0;
  }
}
</style>
